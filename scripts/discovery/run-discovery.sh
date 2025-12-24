#!/bin/bash
#
# 🔍 Cemetery Discovery Runner
# ============================
# Automatisch begraafplaatsen ontdekken in heel Nederland
#
# Gebruik:
#   ./scripts/discovery/run-discovery.sh              # Volledige run
#   ./scripts/discovery/run-discovery.sh --provincie "Utrecht"
#   ./scripts/discovery/run-discovery.sh --batch 50   # Max 50 locaties
#   ./scripts/discovery/run-discovery.sh --dry-run    # Test modus
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Data paths
DATA_DIR="$PROJECT_DIR/data/discovery"
LOCATIONS_FILE="$DATA_DIR/locations.json"
PROGRESS_FILE="$DATA_DIR/progress.json"
RESULTS_FILE="$DATA_DIR/discovered-cemeteries.json"

# Parse arguments
PROVINCIE=""
BATCH=""
DRY_RUN=""
SKIP_SEED=""
SKIP_EXPORT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --provincie)
            PROVINCIE="$2"
            shift 2
            ;;
        --batch)
            BATCH="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN="--dry-run"
            shift
            ;;
        --skip-seed)
            SKIP_SEED="true"
            shift
            ;;
        --skip-export)
            SKIP_EXPORT="true"
            shift
            ;;
        --help|-h)
            echo ""
            echo -e "${BOLD}🔍 Cemetery Discovery Runner${NC}"
            echo ""
            echo "Gebruik:"
            echo "  $0                           # Volledige run"
            echo "  $0 --provincie \"Utrecht\"     # Alleen Utrecht"
            echo "  $0 --batch 50                # Max 50 locaties"
            echo "  $0 --dry-run                 # Test modus (geen API calls)"
            echo "  $0 --skip-seed               # Skip seed stap"
            echo "  $0 --skip-export             # Skip export stap"
            echo ""
            echo "Opties:"
            echo "  --provincie NAME   Filter op provincie"
            echo "  --batch N          Maximaal N locaties verwerken"
            echo "  --dry-run          Preview zonder wijzigingen"
            echo "  --skip-seed        Sla seed-locations over"
            echo "  --skip-export      Sla export over"
            echo "  --help, -h         Toon deze help"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Onbekende optie: $1${NC}"
            exit 1
            ;;
    esac
done

# Header
clear
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}     ${BOLD}🔍 Cemetery Discovery System${NC}                             ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}     ${BOLD}   BegraafplaatsInDeBuurt.nl${NC}                             ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if in project directory
cd "$PROJECT_DIR"

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local niet gevonden!${NC}"
    echo "   Zorg dat BRIGHTDATA_API_KEY is ingesteld."
    exit 1
fi

# Check for API key
if ! grep -q "BRIGHTDATA_API" .env.local; then
    echo -e "${RED}❌ BRIGHTDATA_API_KEY niet gevonden in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} API key gevonden"
echo ""

# ============================================================================
# Step 1: Seed Locations
# ============================================================================

if [ -z "$SKIP_SEED" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}📍 Stap 1: Seed Nederlandse locaties${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    SEED_ARGS=""
    if [ -n "$PROVINCIE" ]; then
        SEED_ARGS="--provincie \"$PROVINCIE\""
    fi

    if [ -n "$DRY_RUN" ]; then
        echo -e "${YELLOW}🧪 DRY RUN - Preview modus${NC}"
        echo ""
        npx tsx scripts/discovery/seed-locations.ts $SEED_ARGS --dry-run
    else
        npx tsx scripts/discovery/seed-locations.ts $SEED_ARGS
    fi

    echo ""
else
    echo -e "${YELLOW}⏭️  Seed stap overgeslagen${NC}"
    echo ""
fi

# ============================================================================
# Step 2: Discovery
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}🔍 Stap 2: Discover begraafplaatsen via Bright Data SERP${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Show current status
if [ -f "$PROGRESS_FILE" ]; then
    TOTAL=$(jq -r '.total_locations // 0' "$PROGRESS_FILE")
    PENDING=$(jq -r '.pending // 0' "$PROGRESS_FILE")
    COMPLETED=$(jq -r '.completed // 0' "$PROGRESS_FILE")
    FOUND=$(jq -r '.total_cemeteries_found // 0' "$PROGRESS_FILE" 2>/dev/null || echo "0")

    echo -e "${CYAN}📊 Huidige status:${NC}"
    echo -e "   Totaal locaties:     ${BOLD}$TOTAL${NC}"
    echo -e "   Nog te verwerken:    ${YELLOW}$PENDING${NC}"
    echo -e "   Afgerond:            ${GREEN}$COMPLETED${NC}"
    echo -e "   Begraafplaatsen:     ${BOLD}$FOUND${NC}"
    echo ""
fi

# Build discovery arguments
DISCOVER_ARGS=""
if [ -n "$PROVINCIE" ]; then
    DISCOVER_ARGS="$DISCOVER_ARGS --provincie \"$PROVINCIE\""
fi
if [ -n "$BATCH" ]; then
    DISCOVER_ARGS="$DISCOVER_ARGS --batch $BATCH"
fi
if [ -n "$DRY_RUN" ]; then
    DISCOVER_ARGS="$DISCOVER_ARGS --dry-run"
fi

# Run discovery
echo -e "${GREEN}▶ Start discovery...${NC}"
echo ""

eval "npx tsx scripts/discovery/discover-cemeteries.ts $DISCOVER_ARGS"

echo ""

# ============================================================================
# Step 3: Post-Process (Transform to website format)
# ============================================================================

if [ -z "$SKIP_EXPORT" ] && [ -z "$DRY_RUN" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}🔄 Stap 3: Post-process naar website formaat${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    npx tsx scripts/discovery/post-process-discovered.ts

    echo ""
fi

# ============================================================================
# Final Summary
# ============================================================================

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}                    ${BOLD}✅ KLAAR!${NC}                                ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -f "$PROGRESS_FILE" ]; then
    TOTAL=$(jq -r '.total_locations // 0' "$PROGRESS_FILE")
    PENDING=$(jq -r '.pending // 0' "$PROGRESS_FILE")
    COMPLETED=$(jq -r '.completed // 0' "$PROGRESS_FILE")
    FOUND=$(jq -r '.total_cemeteries_found // 0' "$PROGRESS_FILE" 2>/dev/null || echo "0")
    UNIQUE=$(jq -r '.unique_cids // 0' "$PROGRESS_FILE" 2>/dev/null || echo "0")

    echo -e "${BOLD}📊 Eindresultaat:${NC}"
    echo -e "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "   Locaties verwerkt:   ${GREEN}$COMPLETED${NC} / $TOTAL"
    echo -e "   Nog te doen:         ${YELLOW}$PENDING${NC}"
    echo -e "   Begraafplaatsen:     ${BOLD}$FOUND${NC}"
    echo -e "   Unieke CIDs:         ${BOLD}$UNIQUE${NC}"
    echo -e "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

if [ -n "$PENDING" ] && [ "$PENDING" -gt 0 ]; then
    echo -e "${YELLOW}💡 Tip: Er zijn nog $PENDING locaties te verwerken.${NC}"
    echo -e "   Run dit script opnieuw om verder te gaan."
    echo ""
fi

echo -e "${CYAN}📁 Data locatie: $DATA_DIR${NC}"
echo ""

# Show next steps
if [ -z "$DRY_RUN" ]; then
    echo -e "${BOLD}🚀 Volgende stappen:${NC}"
    echo "   1. npm run build                     # Build de website"
    echo "   2. git add . && git commit -m 'Add discovered cemeteries'"
    echo "   3. git push                          # Triggers deployment"
    echo ""
    echo -e "${CYAN}💡 De nieuwe begraafplaatsen zijn nu in begraafplaatsen.json${NC}"
    echo ""
fi
