# Build Instructions for Vercel Deployment

## Overview

This project uses CSV files as the data source, but these files are not included in the repository due to their size. Instead, we generate a processed JSON file during the build process.

## How it works

1. **Local Development**: The application can read from either:
   - `/data/cemeteries.csv` (original CSV file)
   - `/data/cemeteries-processed.json` (processed JSON)
   - `/public/data/cemeteries.json` (production data)

2. **Build Process**: The `prebuild` script runs automatically before `next build` and:
   - Reads the CSV file from `/data/cemeteries.csv`
   - Processes it and adds slugs
   - Saves a compact JSON file to `/public/data/cemeteries.json`
   - This file is included in the git repository and deployed to Vercel

3. **Production**: The application reads from `/public/data/cemeteries.json`

## Scripts

- `npm run build-data` - Manually run the data build script
- `npm run build` - Builds the Next.js app (automatically runs prebuild first)

## Adding New Data

1. Update the CSV file in `/data/cemeteries.csv`
2. Run `npm run build-data` to regenerate the public JSON file
3. Commit the updated `/public/data/cemeteries.json` file
4. Push to deploy

## File Structure

```
/data/
  cemeteries.csv          # Source CSV (not in git)
  cemeteries-processed.json # Optional processed data (not in git)
/public/data/
  cemeteries.json        # Production data (in git)
  summary.json           # Data summary (in git)
```