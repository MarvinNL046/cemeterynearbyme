#!/bin/bash

# Remove all fake ratings from the homepage
echo "Removing fake ratings from homepage..."

# Use sed to remove rating divs with Star components
sed -i '/<div className="flex items-center gap-1 mt-1">/,/<\/div>/d' app/page.tsx

# Also remove from the "Recent toegevoegde begraafplaatsen" section
sed -i '/rating: [0-9]\.[0-9],/d' app/page.tsx
sed -i '/reviews: [0-9]*,*/d' app/page.tsx

# Remove rating display from recent cemeteries
sed -i '/<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" \/>/d' app/page.tsx
sed -i '/<span className="font-medium">{cemetery.rating}<\/span>/d' app/page.tsx
sed -i '/<span className="text-muted-foreground">({cemetery.reviews})<\/span>/d' app/page.tsx

echo "✓ Removed all fake ratings!"