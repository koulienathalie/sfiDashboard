# 🚀 SFI Dashboard - Local Development

Mode LOCAL pour développement sur votre machine avec localhost.

## ⚡ Démarrage rapide

```bash
./start.sh
```

Puis ouvre: **http://localhost:5173**

## 📍 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| WebSocket | ws://localhost:3001 |

## 🛠️ Scripts disponibles

```bash
./configure.sh          # Configurer (première utilisation)
./start.sh              # Démarrer les services
./test.sh               # Tester la configuration
./test-websocket.sh     # Tester WebSocket
```

## 📋 Logs

```bash
tail -f ../logs/backend.log    # Logs backend
tail -f ../logs/frontend.log   # Logs frontend
```

## 🆘 Aide

```bash
lsof -i :3001           # Vérifier backend port
lsof -i :5173           # Vérifier frontend port
```

## 📚 Documentation complète

Voir `../LOCALHOST_CONFIG.md`
