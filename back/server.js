// back/server.js
require('dotenv').config();
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration Elasticsearch
const esClient = new Client({
    node: process.env.ES_NODE || 'http://localhost:9200',
    auth: process.env.ES_USERNAME ? {
        username: process.env.ES_USERNAME,
        password: process.env.ES_PASSWORD
    } : undefined
});

// Middleware
app.use(cors());
app.use(express.json());

// Test de connexion Elasticsearch
esClient.ping()
    .then(() => console.log('✅ Connecté à Elasticsearch'))
    .catch(err => console.error('❌ Erreur connexion Elasticsearch:', err.message));

// ============= ROUTES =============

// Santé du cluster
app.get('/api/health', async (req, res) => {
    try {
        const health = await esClient.cluster.health();
        const info = await esClient.info();
        res.json({
            cluster: health,
            elasticsearch: {
                version: info.version.number,
                cluster_name: info.cluster_name
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recherche de logs
app.post('/api/search', async (req, res) => {
    try {
        const {
            query = '*',
            from = 0,
            size = 100,
            timeRange,
            sortField = '@timestamp',
            sortOrder = 'desc'
        } = req.body;

        const mustClauses = [];
        const filterClauses = [];

        // Filtre temporel
        if (timeRange?.from && timeRange?.to) {
            filterClauses.push({
                range: {
                    '@timestamp': {
                        gte: timeRange.from,
                        lte: timeRange.to
                    }
                }
            });
        }

        // Recherche textuelle
        if (query && query !== '*') {
            mustClauses.push({
                query_string: {
                    query: query,
                    default_operator: 'AND'
                }
            });
        }

        const searchBody = {
            index: process.env.ES_INDEX || 'filebeat-*',
            from,
            size,
            body: {
                query: {
                    bool: {
                        must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }],
                        filter: filterClauses
                    }
                },
                sort: [{ [sortField]: { order: sortOrder } }]
            }
        };

        const result = await esClient.search(searchBody);

        res.json({
            total: result.hits.total.value,
            hits: result.hits.hits,
            took: result.took
        });
    } catch (error) {
        console.error('Erreur recherche:', error);
        res.status(500).json({ error: error.message });
    }
});

// Statistiques et agrégations
app.post('/api/stats', async (req, res) => {
    try {
        const { timeRange, fields = ['event.action', 'source.ip'] } = req.body;

        const aggs = {
            timeline: {
                date_histogram: {
                    field: '@timestamp',
                    fixed_interval: '1h'
                }
            }
        };

        // Agrégations dynamiques par champ
        fields.forEach(field => {
            const aggName = field.replace(/\./g, '_');
            aggs[aggName] = {
                terms: {
                    field: field,
                    size: 10
                }
            };
        });

        const result = await esClient.search({
            index: process.env.ES_INDEX || 'filebeat-*',
            body: {
                size: 0,
                query: {
                    range: {
                        '@timestamp': {
                            gte: timeRange.from,
                            lte: timeRange.to
                        }
                    }
                },
                aggs
            }
        });

        res.json({
            timeline: result.aggregations.timeline.buckets,
            stats: Object.keys(result.aggregations)
                .filter(key => key !== 'timeline')
                .reduce((acc, key) => {
                    acc[key] = result.aggregations[key].buckets;
                    return acc;
                }, {})
        });
    } catch (error) {
        console.error('Erreur stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Top N sources IP
app.post('/api/top-sources', async (req, res) => {
    try {
        const { timeRange, size = 10, field = 'source.ip' } = req.body;

        const result = await esClient.search({
            index: process.env.ES_INDEX || 'filebeat-*',
            body: {
                size: 0,
                query: {
                    range: {
                        '@timestamp': {
                            gte: timeRange.from,
                            lte: timeRange.to
                        }
                    }
                },
                aggs: {
                    top_sources: {
                        terms: {
                            field: field,
                            size: size
                        }
                    }
                }
            }
        });

        res.json(result.aggregations.top_sources.buckets);
    } catch (error) {
        console.error('Erreur top sources:', error);
        res.status(500).json({ error: error.message });
    }
});

// Liste des index disponibles
app.get('/api/indices', async (req, res) => {
    try {
        const indices = await esClient.cat.indices({ format: 'json' });
        res.json(indices.filter(idx => idx.index.startsWith('filebeat')));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mapping des champs d'un index
app.get('/api/fields/:index', async (req, res) => {
    try {
        const mapping = await esClient.indices.getMapping({
            index: req.params.index
        });
        res.json(mapping);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stream de logs en temps réel (derniers N secondes)
app.get('/api/realtime', async (req, res) => {
    try {
        const { seconds = 10, size = 50 } = req.query;
        const now = new Date();
        const from = new Date(now - seconds * 1000);

        const result = await esClient.search({
            index: process.env.ES_INDEX || 'filebeat-*',
            body: {
                size: parseInt(size),
                query: {
                    range: {
                        '@timestamp': {
                            gte: from.toISOString(),
                            lte: now.toISOString()
                        }
                    }
                },
                sort: [{ '@timestamp': { order: 'desc' } }]
            }
        });

        res.json({
            total: result.hits.total.value,
            hits: result.hits.hits,
            timestamp: now.toISOString()
        });
    } catch (error) {
        console.error('Erreur realtime:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= DÉMARRAGE =============
app.listen(PORT, () => {
    console.log(`
  🚀 Serveur API démarré
  📡 URL: http://localhost:${PORT}
  🔍 Elasticsearch: ${process.env.ES_NODE || 'http://localhost:9200'}
  📊 Index: ${process.env.ES_INDEX || 'filebeat-*'}
  `);
});

// Gestion des erreurs non gérées
process.on('unhandledRejection', (err) => {
    console.error('Erreur non gérée:', err);
});