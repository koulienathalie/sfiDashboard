# 🚀 SFI Dashboard Monitoring - Démarrage Localhost

## ⚡ Démarrage en 30 secondes

```bash
./start.sh
```

Puis ouvre : **http://localhost:5173**

C'est tout ! 🎉

---

## 📍 URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend** | http://localhost:3001 |
| **WebSocket** | ws://localhost:3001/socket.io |

---

## 🔧 Commandes utiles

```bash
# Démarrage (tous les services)
./start.sh

# Backend uniquement
npm run backend

# Frontend uniquement
npm run frontend

# Backend + Frontend en parallèle
npm run start:all

# Tester la configuration
./test-localhost.sh

# Configurer localhost (première utilisation)
./configure-localhost.sh
```

---

## 📋 Logs

```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log

# Tous les logs
tail -f logs/*.log
```

---

## 🆘 Dépannage

### Port déjà utilisé ?

```bash
# Voir les services en cours
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Libérer un port
kill -9 <PID>
```

### Services ne démarrent pas ?

```bash
# Réinstaller les dépendances
npm run setup

# Nettoyer et relancer
rm -rf node_modules backend/node_modules
npm run setup
./start.sh
```

### Configuration n'est pas OK ?

```bash
./configure-localhost.sh
./test-localhost.sh
```

---

## 📚 Documentation complète

Voir **LOCALHOST_CONFIG.md** pour :
- Configuration détaillée
- Troubleshooting avancé
- Configuration pour déploiement
- Variables d'environnement

---

## ✅ Checklist

- [ ] `./start.sh` fonctionne
- [ ] Frontend sur http://localhost:5173
- [ ] Backend sur http://localhost:3001
- [ ] Pas d'erreurs en console
- [ ] WebSocket connecté
- [ ] Page login fonctionne

---

**Made with ❤️ for SFI Dashboard Monitoring**
