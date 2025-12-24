#!/bin/bash
#
# Fetch Reviews voor alle provincies, één voor één
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
MAX_RETRIES=3

echo "⭐ Start Reviews fetch voor alle provincies"
echo "==========================================="
echo ""

TOTAL=${#PROVINCIES[@]}
CURRENT=0
FAILED_PROVINCES=()

for PROVINCIE in "${PROVINCIES[@]}"; do
  CURRENT=$((CURRENT + 1))
  RETRY_COUNT=0
  SUCCESS=false

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📍 [$CURRENT/$TOTAL] $PROVINCIE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$SUCCESS" = false ]; do
    if [ $RETRY_COUNT -gt 0 ]; then
      echo ""
      echo "🔄 Retry $RETRY_COUNT/$MAX_RETRIES voor $PROVINCIE..."
      sleep 30
    fi

    npx tsx scripts/fetch-reviews-by-cid.ts --provincie "$PROVINCIE"
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
      SUCCESS=true
    else
      RETRY_COUNT=$((RETRY_COUNT + 1))
      echo ""
      echo "⚠️  Fout bij $PROVINCIE (exit code: $EXIT_CODE)"
    fi
  done

  if [ "$SUCCESS" = false ]; then
    echo "❌ $PROVINCIE gefaald na $MAX_RETRIES pogingen"
    FAILED_PROVINCES+=("$PROVINCIE")
  fi

  # Pauze tussen provincies (behalve na de laatste)
  if [ $CURRENT -lt $TOTAL ]; then
    echo ""
    echo "⏳ Pauze van ${PAUSE_BETWEEN_PROVINCES}s voor rate limit..."
    sleep $PAUSE_BETWEEN_PROVINCES
  fi
done

echo ""
echo "==========================================="
echo "✅ Klaar met alle provincies!"
echo "==========================================="

# Toon statistieken
echo ""
echo "📊 Resultaat:"

# Tel reviews bestanden
REVIEW_FILES=$(find data/reviews -name "*.json" 2>/dev/null | wc -l)
echo "   Reviews bestanden: $REVIEW_FILES"

# Tel begraafplaatsen met reviews_fetched_at
FETCHED=$(grep -c '"reviews_fetched_at"' data/begraafplaatsen.json 2>/dev/null || echo "0")
echo "   Begraafplaatsen met reviews opgehaald: $FETCHED"

# Toon gefaalde provincies
if [ ${#FAILED_PROVINCES[@]} -gt 0 ]; then
  echo ""
  echo "⚠️  Gefaalde provincies:"
  for FAILED in "${FAILED_PROVINCES[@]}"; do
    echo "   - $FAILED"
  done
fi
