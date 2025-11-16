#!/usr/bin/env bash

# ================================================
# Configure Localhost Setup
# Initialise la configuration pour localhost
# ================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Configuration Localhost - SFI Monitoring              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# ================================================
# Step 1: Create .env.local for frontend
# ================================================
echo -e "${YELLOW}[STEP 1]${NC} Configuration Frontend - .env.local\n"

if [ -f ".env.local" ]; then
    echo -e "${YELLOW}  .env.local existe déjà${NC}"
    read -p "  Overwrite? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}  ✓ Skipped${NC}\n"
    else
        cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3001
VITE_BACKEND_WS_URL=ws://localhost:3001
VITE_ENV=development
EOF
        echo -e "${GREEN}  ✓ .env.local créé/mis à jour${NC}\n"
    fi
else
    cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3001
VITE_BACKEND_WS_URL=ws://localhost:3001
VITE_ENV=development
EOF
    echo -e "${GREEN}  ✓ .env.local créé${NC}\n"
fi

# ================================================
# Step 2: Verify backend/.env
# ================================================
echo -e "${YELLOW}[STEP 2]${NC} Configuration Backend - backend/.env\n"

if [ ! -f "backend/.env" ]; then
    if [ -f "backend/envDefault" ]; then
        cp backend/envDefault backend/.env
        echo -e "${GREEN}  ✓ backend/.env créé depuis envDefault${NC}\n"
    else
        echo -e "${RED}  ✗ backend/envDefault non trouvé${NC}\n"
        exit 1
    fi
else
    echo -e "${GREEN}  ✓ backend/.env existe${NC}\n"
fi

# Update backend/.env with localhost config
if ! grep -q "FRONTEND_URL=.*localhost:5173" backend/.env; then
    sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL=http://localhost:3000 http://localhost:5173|' backend/.env
    echo -e "${GREEN}  ✓ FRONTEND_URL mis à jour${NC}\n"
fi

# ================================================
# Step 3: Check vite.config.js
# ================================================
echo -e "${YELLOW}[STEP 3]${NC} Vérifier vite.config.js\n"

if grep -q "host: '0.0.0.0'" vite.config.js; then
    echo -e "${GREEN}  ✓ vite.config.js configuré pour localhost${NC}\n"
else
    echo -e "${YELLOW}  ⚠ vite.config.js peut nécessiter une mise à jour${NC}\n"
fi

# ================================================
# Step 4: Check Node.js
# ================================================
echo -e "${YELLOW}[STEP 4]${NC} Vérifier les prérequis\n"

if ! command -v node &>/dev/null; then
    echo -e "${RED}  ✗ Node.js non installé${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Node.js: $(node --version)${NC}"

if ! command -v npm &>/dev/null; then
    echo -e "${RED}  ✗ npm non installé${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ npm: $(npm --version)\n${NC}"

# ================================================
# Step 5: Install dependencies
# ================================================
echo -e "${YELLOW}[STEP 5]${NC} Installation des dépendances\n"

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}  📦 Installation frontend...${NC}"
    npm install --no-save > /dev/null 2>&1
    echo -e "${GREEN}  ✓ Frontend OK${NC}"
else
    echo -e "${GREEN}  ✓ Frontend dépendances OK${NC}"
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}  📦 Installation backend...${NC}"
    (cd backend && npm install --no-save > /dev/null 2>&1)
    echo -e "${GREEN}  ✓ Backend OK${NC}"
else
    echo -e "${GREEN}  ✓ Backend dépendances OK${NC}"
fi
echo

# ================================================
# Summary
# ================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ✅ Configuration complète!                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}📍 Localhost URLs:${NC}"
echo -e "  Frontend:  http://localhost:5173"
echo -e "  Backend:   http://localhost:3001"
echo -e "  WebSocket: ws://localhost:3001/socket.io\n"

echo -e "${CYAN}🚀 Démarrage:${NC}"
echo -e "  ./start.sh              (Démarrer tout)"
echo -e "  npm run backend         (Backend uniquement)"
echo -e "  npm run frontend        (Frontend uniquement)"
echo -e "  npm run start:all       (Backend + Frontend en parallèle)\n"

echo -e "${CYAN}🧪 Test:${NC}"
echo -e "  ./test-localhost.sh     (Vérifier la configuration)\n"

echo -e "${CYAN}📚 Documentation:${NC}"
echo -e "  LOCALHOST_CONFIG.md     (Configuration détaillée)\n"
