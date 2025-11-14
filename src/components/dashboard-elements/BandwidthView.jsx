import { useEffect, useState, useRef } from 'react'
import { Box, Typography, Dialog, DialogTitle, DialogContent, Button, CircularProgress, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import { LineChart } from '@mui/x-charts'
import { io } from 'socket.io-client'

function formatTime(ts) {
    try {
        const d = new Date(ts)
        if (Number.isNaN(d.getTime())) return '-'
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch (err) {
        return '-'
    }
}

function toMB(bytes) {
    return bytes / 1024 / 1024
}

export function BandwidthView() {
    const [timeline, setTimeline] = useState([])
    const [total, setTotal] = useState(0)
    const [topSources, setTopSources] = useState([])
    const [topProtocols, setTopProtocols] = useState([])
    const [topApplications, setTopApplications] = useState([])
    const socketRef = useRef(null)
    const [refreshLoading, setRefreshLoading] = useState(false)
    const [topLoading, setTopLoading] = useState(false)
    const [protocolsLoading, setProtocolsLoading] = useState(false)
    const [samplesOpen, setSamplesOpen] = useState(false)
    const [samplesLoading, setSamplesLoading] = useState(false)
    const [selectedIp, setSelectedIp] = useState(null)
    const [sampleHits, setSampleHits] = useState([])
    const [sampleSize, setSampleSize] = useState(5)

    async function fetchBandwidth() {
        try {
            const to = new Date()
            const from = new Date(to.getTime() - 1000 * 60 * 5) // last 5 minutes
            const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/bandwidth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeRange: { from: from.toISOString(), to: to.toISOString() }, interval: '15s' }),
            })
            const data = await res.json()
            if (res.ok) {
                // Convert bucket totals into MB/s for display (interval is 15s)
                const bucketSeconds = 15
                const points = (data.timeline || []).map((b) => ({
                    t: b.key, // ms
                    total: b.total_bytes?.value || 0,
                    sent: b.sent_bytes?.value || 0,
                    received: b.received_bytes?.value || 0,
                    rateMBs: ((b.total_bytes?.value || 0) / bucketSeconds) / 1024 / 1024,
                }))
                setTimeline(points)
                setTotal(data.total || 0)
            } else {
                console.error('Bandwidth API error', data)
            }
        } catch (err) {
            console.error('fetchBandwidth', err)
        }
    }

    async function fetchTopData() {
        // use the two focused loaders so callers can display spinners independently
        await Promise.all([fetchTopSources(), fetchProtocols()])
    }

    async function fetchTopSources() {
        setTopLoading(true)
        try {
            const to = new Date()
            const from = new Date(to.getTime() - 1000 * 60 * 5) // last 5 minutes
            const topRes = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/top-bandwidth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeRange: { from: from.toISOString(), to: to.toISOString() }, size: 10, type: 'source' }),
            })
            const topData = await topRes.json()
            if (topRes.ok) {
                const top = (topData || []).map((b) => ({ ip: b.key, bytes: b.total_bytes?.value || (b.total_bytes || 0), count: b.connection_count?.value || b.doc_count || 0, mb: (b.total_bytes?.value || (b.total_bytes || 0)) / 1024 / 1024 }))
                setTopSources(top)
            }
        } catch (err) {
            console.error('fetchTopSources', err)
        } finally {
            setTopLoading(false)
        }
    }

    async function fetchProtocols() {
        setProtocolsLoading(true)
        try {
            const to = new Date()
            const from = new Date(to.getTime() - 1000 * 60 * 5) // last 5 minutes
            const protoRes = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/protocols', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeRange: { from: from.toISOString(), to: to.toISOString() }, size: 10 }),
            })
            const protoData = await protoRes.json()
            if (protoRes.ok) {
                const protocols = (protoData.protocols || []).map(p => ({ protocol: p.key, bytes: p.bytes?.value || 0, count: p.doc_count || 0, mb: (p.bytes?.value || 0) / 1024 / 1024 }))
                const apps = (protoData.applications || protoData.ports || []).map(a => ({ name: a.key || a.name, bytes: a.bytes?.value || (a.bytes || 0), count: a.doc_count || 0, mb: (a.bytes?.value || (a.bytes || 0)) / 1024 / 1024 }))
                setTopProtocols(protocols)
                setTopApplications(apps)
            }
        } catch (err) {
            console.error('fetchProtocols', err)
        } finally {
            setProtocolsLoading(false)
        }
    }

    useEffect(() => {
        let mounted = true
        // fetch initial history via HTTP
        fetchBandwidth()
        fetchTopData()

        // connect socket.io for live bandwidth deltas
        const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const socket = io(socketUrl, { transports: ['websocket'] })
        socketRef.current = socket

        socket.on('connect', () => {
            console.log('Socket connected', socket.id)
        })

        socket.on('bandwidth', (payload) => {
            try {
                const ts = new Date(payload.timestamp).getTime()
                const intervalS = (payload.intervalMs || 2000) / 1000
                const totalBytes = payload.totalBytes || payload.bytes || 0
                const point = { t: ts, total: totalBytes, sent: payload.sentBytes || 0, received: payload.receivedBytes || 0, rateMBs: (totalBytes / intervalS) / 1024 / 1024 }
                // append and keep a reasonable window
                setTimeline((prev) => {
                    const next = [...prev, point]
                    return next.slice(-300)
                })
                setTotal((prev) => (prev || 0) + (point.total || 0))
            } catch (err) {
                console.error('Error handling bandwidth socket event', err)
            }
        })

        socket.on('top-bandwidth', (payload) => {
            try {
                const intervalS = (payload.intervalMs || 2000) / 1000
                const top = (payload.top || []).map((p) => ({ ip: p.ip, bytes: p.bytes, count: p.count, mb: p.bytes / 1024 / 1024, mbs: (p.bytes / intervalS) / 1024 / 1024 }))
                const protocols = (payload.topProtocols || []).map((p) => ({ protocol: p.protocol, bytes: p.bytes, count: p.count, mb: p.bytes / 1024 / 1024 }))
                const apps = (payload.topApplications || []).map((p) => ({ name: p.name, bytes: p.bytes, count: p.count, mb: p.bytes / 1024 / 1024 }))
                setTopSources(top)
                setTopProtocols(protocols)
                setTopApplications(apps)
            } catch (err) {
                console.error('Error handling top-bandwidth', err)
            }
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected')
        })

        return () => {
            mounted = false
            if (socketRef.current) socketRef.current.disconnect()
        }
    }, [])

    async function refreshAll() {
        setRefreshLoading(true)
        try {
            await Promise.all([fetchBandwidth(), fetchTopData()])
        } finally {
            setRefreshLoading(false)
        }
    }

    async function loadSamples(ip, size = 10) {
        try {
            setSamplesLoading(true)
            const to = new Date()
            const from = new Date(to.getTime() - 1000 * 60 * 60) // last 60 minutes
            const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/consumer-samples', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeRange: { from: from.toISOString(), to: to.toISOString() }, ip, field: 'source.ip', size }),
            })
            const data = await res.json()
            if (res.ok) {
                setSampleHits(data.hits || [])
            } else {
                console.error('consumer-samples error', data)
                setSampleHits([])
            }
        } catch (err) {
            console.error('loadSamples', err)
            setSampleHits([])
        } finally {
            setSamplesLoading(false)
        }
    }

    async function openSamplesForIp(ip) {
        setSelectedIp(ip)
        setSamplesOpen(true)
        setSampleSize(10)
        await loadSamples(ip, 10)
    }

    async function seeMoreSamples() {
        const nextSize = (sampleSize || 10) + 5
        setSampleSize(nextSize)
        await loadSamples(selectedIp, nextSize)
    }

    const xData = timeline.map((p) => formatTime(p.t))
    const totalSeries = timeline.map((p) => Number((p.rateMBs || (toMB(p.total) / 1)).toFixed(3)))
    const sentSeries = timeline.map((p) => Number(( (p.sent || 0) / 1024 / 1024 ).toFixed(3)))
    const recvSeries = timeline.map((p) => Number(( (p.received || 0) / 1024 / 1024 ).toFixed(3)))
    const totalMB = Number(toMB(total).toFixed(2))

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography fontSize={20} fontWeight={600}>Bande passante (MB)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Actualiser">
                        <IconButton size="small" onClick={refreshAll}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography fontSize={14} color="text.secondary">Total (fenêtre): {totalMB.toLocaleString()} MB</Typography>
                </Box>
            </Box>

            <LineChart
                xAxis={[{ scaleType: 'point', data: xData, showMark: false }]}
                series={[
                    { data: totalSeries, label: 'Débit (MB/s)', color: '#1976d2', area: true },
                    { data: sentSeries, label: 'Envoyé (MB)', color: '#29BAE2' },
                    { data: recvSeries, label: 'Reçu (MB)', color: '#A1D490' },
                ]}
                grid={{ vertical: true, horizontal: true }}
                height={420}
                margin={{ left: 0, bottom: 0 }}
                slotProps={{ legend: { position: { vertical: 'top', horizontal: 'start' } } }}
            />

            {/* Top sources list */}
            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography fontSize={16} fontWeight={600}>Top sources (en temps réel)</Typography>
                    <Box>
                        {topLoading ? (
                            <CircularProgress size={18} />
                        ) : (
                            <Tooltip title="Actualiser Top sources"><IconButton size="small" onClick={fetchTopSources}><RefreshIcon /></IconButton></Tooltip>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {topSources.length === 0 && <Typography color="text.secondary">Aucune donnée en direct</Typography>}
                    {topSources.map((s) => (
                        <Box key={s.ip} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                            <Box>
                                <Button variant="text" onClick={() => openSamplesForIp(s.ip)} sx={{ p: 0, textTransform: 'none' }}>
                                    <Typography fontWeight={700}>{s.ip}</Typography>
                                </Button>
                                <Typography fontSize={12} color="text.secondary">{s.count} connexions</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography fontWeight={700}>{(s.mb || 0).toFixed(2)} MB</Typography>
                                <Typography fontSize={12} color="text.secondary">{((s.mbs || 0)).toFixed(3)} MB/s</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* Protocols & Applications */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography fontSize={15} fontWeight={600}>Protocoles utilisés</Typography>
                        <Box>
                            {protocolsLoading ? (
                                <CircularProgress size={18} />
                            ) : (
                                <Tooltip title="Actualiser Protocoles"><IconButton size="small" onClick={fetchProtocols}><RefreshIcon /></IconButton></Tooltip>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {topProtocols.length === 0 && <Typography color="text.secondary">Aucune donnée</Typography>}
                        {topProtocols.map((p) => (
                            <Box key={p.protocol} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Box>
                                    <Typography fontWeight={700}>{p.protocol}</Typography>
                                    <Typography fontSize={12} color="text.secondary">{p.count} paquets</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography fontWeight={700}>{((p.mb || 0)).toFixed(2)} MB</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography fontSize={15} fontWeight={600}>Services / Applications</Typography>
                        <Box>
                            {protocolsLoading ? (
                                <CircularProgress size={18} />
                            ) : (
                                <Tooltip title="Actualiser Services"><IconButton size="small" onClick={fetchProtocols}><RefreshIcon /></IconButton></Tooltip>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {topApplications.length === 0 && <Typography color="text.secondary">Aucune donnée</Typography>}
                        {topApplications.map((a) => (
                            <Box key={a.name} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Box>
                                    <Typography fontWeight={700}>{a.name}</Typography>
                                    <Typography fontSize={12} color="text.secondary">{a.count} connexions</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography fontWeight={700}>{((a.mb || 0)).toFixed(2)} MB</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Samples dialog */}
            <Dialog open={samplesOpen} onClose={() => setSamplesOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Échantillons pour {selectedIp}</span>
                    <IconButton onClick={() => setSamplesOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {samplesLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>
                    ) : (
                        <> 
                            {sampleHits.length === 0 ? (
                                <Typography color="text.secondary">Aucun échantillon trouvé</Typography>
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            <TableCell>Source</TableCell>
                                            <TableCell>Destination</TableCell>
                                            <TableCell>Ports</TableCell>
                                            <TableCell>Protocole</TableCell>
                                            <TableCell>Application</TableCell>
                                            <TableCell>Message</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sampleHits.map((h, idx) => {
                                            const src = h._source?.source || {}
                                            const dst = h._source?.destination || {}
                                            const timestamp = h._source?.['@timestamp'] || h._source?._timestamp || h._id || new Date().toISOString()
                                            const proto = h._source?.network?.protocol || 'n/a'
                                            const app = h._source?.network?.application || h._source?.process?.name || (h._source?.destination?.port ? `port:${h._source.destination.port}` : 'n/a')
                                            const message = h._source?.message || ''
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{new Date(timestamp).toLocaleString()}</TableCell>
                                                    <TableCell>{src.ip || src.address || 'n/a'}</TableCell>
                                                    <TableCell>{dst.ip || dst.address || 'n/a'}</TableCell>
                                                    <TableCell>{(src.port || '-') + ' → ' + (dst.port || '-')}</TableCell>
                                                    <TableCell>{proto}</TableCell>
                                                    <TableCell>{app}</TableCell>
                                                    <TableCell style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>{message}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                                <Button variant="outlined" onClick={() => setSamplesOpen(false)}>Fermer</Button>
                                <Button variant="outlined" onClick={() => loadSamples(selectedIp, sampleSize)}>Actualiser</Button>
                                <Button variant="contained" onClick={seeMoreSamples}>Voir plus</Button>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    )
}
