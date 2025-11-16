#!/usr/bin/env bash

# ================================================
# Test WebSocket Connection
# Vérifie la connexion WebSocket du frontend
# ================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Test WebSocket Connection - SFI Monitoring           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}Instructions:${NC}\n"
echo -e "1. Ouvre le navigateur: http://localhost:5173"
echo -e "2. Ouvre la console (F12 → Console)"
echo -e "3. Copie et exécute le code ci-dessous:\n"

cat << 'EOF'
const { io } = await import('socket.io-client');

console.log('🔍 Connexion WebSocket...');

const socket = io('ws://localhost:3001', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('✅ Connecté au WebSocket!');
  console.log('Socket ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Déconnecté du WebSocket');
});

socket.on('error', (error) => {
  console.error('❌ Erreur WebSocket:', error);
});

socket.on('connected', (data) => {
  console.log('📡 Message du serveur:', data);
});

// Keep socket alive for 10 seconds
setTimeout(() => {
  console.log('📊 État final:');
  console.log('  Connected:', socket.connected);
  console.log('  ID:', socket.id);
  socket.disconnect();
}, 10000);
EOF

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Ou utilise le test cURL ci-dessous                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}Test avec WebSocket CLI:${NC}\n"
echo -e "${CYAN}wscat -c ws://localhost:3001${NC}\n"

echo -e "Puis envoie:"
echo -e "${CYAN}2['request-initial-logs', {\"timeRange\": \"15m\", \"size\": 10}]${NC}\n"

echo -e "${YELLOW}État du serveur:${NC}"
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Backend en écoute${NC}\n"
else
    echo -e "${RED}  ✗ Backend non accessible${NC}"
    echo -e "${YELLOW}  Lancer: ./start.sh${NC}\n"
    exit 1
fi

echo -e "${YELLOW}Logs en temps réel:${NC}"
echo -e "  tail -f logs/backend.log | grep -E 'Client|Socket|connected|error'"
