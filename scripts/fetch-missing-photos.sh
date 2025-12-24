#!/bin/bash
#
# Fetch Missing Photos - Loop tot alles verwerkt is
#
# Features:
# - Herstart automatisch bij crashes
# - Pauze tussen runs om API niet te overbelasten
# - Stopt automatisch als alles klaar is
# - Toont statistieken
#
# Gebruik:
#   ./scripts/fetch-missing-photos.sh           # Start/hervat
#   ./scripts/fetch-missing-photos.sh --reset   # Start opnieuw
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

PAUSE_BETWEEN_RUNS=120  # 2 minuten pauze tussen runs
MAX_CONSECUTIVE_ERRORS=3
BATCH_SIZE=5

# Parse arguments
RESET_FLAG=""
if [ "$1" = "--reset" ]; then
  RESET_FLAG="--reset"
  echo "🔄 Reset mode: progress wordt gewist"
fi

echo ""
echo "📷 Missing Photos Fetcher - Continuous Mode"
echo "============================================="
echo ""
echo "📁 Project: $PROJECT_DIR"
echo "⏱️  Pauze tussen runs: ${PAUSE_BETWEEN_RUNS}s"
echo "📦 Batch size: ${BATCH_SIZE}"
echo ""
echo "Druk Ctrl+C om te stoppen (voortgang wordt opgeslagen)"
echo ""
echo "============================================="
echo ""

RUN_COUNT=0
ERROR_COUNT=0

while true; do
  RUN_COUNT=$((RUN_COUNT + 1))

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🚀 Run #$RUN_COUNT - $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Run the TypeScript script
  npx tsx scripts/fetch-missing-photos.ts --batch $BATCH_SIZE $RESET_FLAG
  EXIT_CODE=$?

  # Clear reset flag after first run
  RESET_FLAG=""

  # Check exit code
  if [ $EXIT_CODE -eq 0 ]; then
    ERROR_COUNT=0

    # Check if we're done
    REMAINING=$(npx tsx scripts/fetch-missing-photos.ts --dry-run 2>&1 | grep "Nog te verwerken" | grep -oP '\d+')

    if [ "$REMAINING" = "0" ] || [ -z "$REMAINING" ]; then
      echo ""
      echo "============================================="
      echo "🎉 KLAAR! Alle foto's zijn opgehaald!"
      echo "============================================="

      # Final stats
      PHOTO_FILES=$(find public/images/google -name "*.jpg" 2>/dev/null | wc -l)
      echo ""
      echo "📊 Eindresultaat:"
      echo "   Foto bestanden: $PHOTO_FILES"
      echo "   Totaal runs: $RUN_COUNT"
      echo ""

      # Commit changes
      echo "💾 Wijzigingen opslaan..."
      git add public/images/google/ data/begraafplaatsen.json data/missing-photos-progress.json 2>/dev/null
      git commit -m "feat: Add Google Maps photos for cemeteries (batch $RUN_COUNT)" 2>/dev/null

      exit 0
    fi

    echo ""
    echo "📊 Nog te verwerken: $REMAINING locaties"

  else
    ERROR_COUNT=$((ERROR_COUNT + 1))
    echo ""
    echo "⚠️  Run gefaald (exit code: $EXIT_CODE)"
    echo "   Consecutive errors: $ERROR_COUNT/$MAX_CONSECUTIVE_ERRORS"

    if [ $ERROR_COUNT -ge $MAX_CONSECUTIVE_ERRORS ]; then
      echo ""
      echo "❌ Te veel opeenvolgende fouten. Gestopt."
      echo "   Controleer de logs en probeer later opnieuw."

      # Save progress anyway
      git add public/images/google/ data/begraafplaatsen.json data/missing-photos-progress.json 2>/dev/null
      git commit -m "wip: Save photo fetch progress (stopped due to errors)" 2>/dev/null

      exit 1
    fi

    # Longer pause after error
    echo "   Wacht 5 minuten voor volgende poging..."
    sleep 300
    continue
  fi

  # Save progress periodically (every 5 runs)
  if [ $((RUN_COUNT % 5)) -eq 0 ]; then
    echo ""
    echo "💾 Tussentijds opslaan..."
    git add public/images/google/ data/begraafplaatsen.json data/missing-photos-progress.json 2>/dev/null
    git commit -m "wip: Save photo fetch progress (run $RUN_COUNT)" 2>/dev/null
  fi

  echo ""
  echo "⏳ Pauze van ${PAUSE_BETWEEN_RUNS}s..."
  sleep $PAUSE_BETWEEN_RUNS
done
