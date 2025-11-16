#!/usr/bin/env bash

# ================================================
# Test Localhost Configuration
# Vérifie que tous les services localhost fonctionnent
# ================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Test Localhost Configuration - SFI Monitoring         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

test_passed=0
test_failed=0

# ================================================
# Test 1: Backend running
# ================================================
echo -e "${YELLOW}[TEST 1]${NC} Backend sur http://localhost:3001"

if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Backend accessible${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ Backend NON accessible${NC}"
    test_failed=$((test_failed + 1))
fi

# ================================================
# Test 2: Frontend running
# ================================================
echo -e "\n${YELLOW}[TEST 2]${NC} Frontend sur http://localhost:5173"

if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Frontend accessible${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ Frontend NON accessible${NC}"
    test_failed=$((test_failed + 1))
fi

# ================================================
# Test 3: Backend API
# ================================================
echo -e "\n${YELLOW}[TEST 3]${NC} API Backend - /api/top-sources"

api_response=$(curl -s http://localhost:3001/api/top-sources 2>&1)
if [[ $api_response == *"error"* ]] || [ -z "$api_response" ]; then
    echo -e "${YELLOW}  ⚠ API non disponible (backend peut avoir besoin de temps)${NC}"
    test_failed=$((test_failed + 1))
else
    echo -e "${GREEN}  ✓ API réactive${NC}"
    test_passed=$((test_passed + 1))
fi

# ================================================
# Test 4: Ports
# ================================================
echo -e "\n${YELLOW}[TEST 4]${NC} Vérifier les ports en écoute"

if lsof -i :3001 > /dev/null 2>&1; then
    pid=$(lsof -i :3001 | tail -1 | awk '{print $2}')
    echo -e "${GREEN}  ✓ Port 3001 en écoute (PID: $pid)${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ Port 3001 NOT en écoute${NC}"
    test_failed=$((test_failed + 1))
fi

if lsof -i :5173 > /dev/null 2>&1; then
    pid=$(lsof -i :5173 | tail -1 | awk '{print $2}')
    echo -e "${GREEN}  ✓ Port 5173 en écoute (PID: $pid)${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ Port 5173 NOT en écoute${NC}"
    test_failed=$((test_failed + 1))
fi

# ================================================
# Test 5: Environment files
# ================================================
echo -e "\n${YELLOW}[TEST 5]${NC} Fichiers de configuration"

if [ -f "$SCRIPT_DIR/.env.local" ]; then
    echo -e "${GREEN}  ✓ .env.local trouvé${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ .env.local manquant${NC}"
    test_failed=$((test_failed + 1))
fi

if [ -f "$SCRIPT_DIR/backend/.env" ]; then
    echo -e "${GREEN}  ✓ backend/.env trouvé${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ backend/.env manquant${NC}"
    test_failed=$((test_failed + 1))
fi

# ================================================
# Test 6: Node modules
# ================================================
echo -e "\n${YELLOW}[TEST 6]${NC} Dépendances npm"

if [ -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "${GREEN}  ✓ Frontend node_modules OK${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ Frontend node_modules manquants${NC}"
    test_failed=$((test_failed + 1))
fi

if [ -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo -e "${GREEN}  ✓ Backend node_modules OK${NC}"
    test_passed=$((test_passed + 1))
else
    echo -e "${RED}  ✗ Backend node_modules manquants${NC}"
    test_failed=$((test_failed + 1))
fi

# ================================================
# Résumé
# ================================================
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Résumé des tests                                      ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  Tests réussis:  ${GREEN}$test_passed${BLUE}${NC}"
echo -e "${BLUE}║  Tests échoués:  ${RED}$test_failed${BLUE}${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

if [ $test_failed -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les tests réussis - Configuration OK!${NC}\n"
    echo -e "${CYAN}URLs d'accès:${NC}"
    echo -e "  Frontend:  http://localhost:5173"
    echo -e "  Backend:   http://localhost:3001"
    echo -e "  WebSocket: ws://localhost:3001/socket.io"
    echo
    exit 0
else
    echo -e "${YELLOW}⚠️  Certains tests ont échoué${NC}\n"
    echo -e "${YELLOW}Solutions:${NC}"
    echo -e "  1. Lancer les services: ./start.sh"
    echo -e "  2. Attendre 5-10 secondes"
    echo -e "  3. Relancer ce test"
    echo
    exit 1
fi
