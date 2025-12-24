#!/bin/bash
#
# Fetch CIDs voor alle provincies, één voor één
# Met pauze tussen provincies om rate limits te voorkomen
#

PROVINCIES=(
  "Drenthe"
  "Flevoland"
  "Friesland"
  "Gelderland"
  "Groningen"
  "Limburg"
  "Noord-Brabant"
  "Noord-Holland"
  "Overijssel"
  "Utrecht"
  "Zeeland"
  "Zuid-Holland"
)

PAUSE_BETWEEN_PROVINCES=30  # seconden pauze tussen provincies

echo "🔍 Start CID fetch voor alle provincies"
echo "=========================================="
echo ""

TOTAL=${#PROVINCIES[@]}
CURRENT=0

for PROVINCIE in "${PROVINCIES[@]}"; do
  CURRENT=$((CURRENT + 1))

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📍 [$CURRENT/$TOTAL] $PROVINCIE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  npx tsx scripts/fetch-place-ids-serp.ts --provincie "$PROVINCIE"

  EXIT_CODE=$?

  if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "⚠️  Fout bij $PROVINCIE (exit code: $EXIT_CODE)"
    echo "   Wacht 60 seconden en ga door..."
    sleep 60
  fi

  # Pauze tussen provincies (behalve na de laatste)
  if [ $CURRENT -lt $TOTAL ]; then
    echo ""
    echo "⏳ Pauze van ${PAUSE_BETWEEN_PROVINCES}s voor rate limit..."
    sleep $PAUSE_BETWEEN_PROVINCES
  fi
done

echo ""
echo "=========================================="
echo "✅ Klaar met alle provincies!"
echo "=========================================="

# Toon statistieken
echo ""
echo "📊 Resultaat:"
TOTAL_CIDS=$(grep -c '"google_place_id"' data/begraafplaatsen.json 2>/dev/null || echo "0")
echo "   Totaal CIDs gevonden: $TOTAL_CIDS"
