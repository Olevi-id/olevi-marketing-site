# BunnyCDN HTTP uploader — usage notes

Reference: https://docs.bunny.net/storage/http

What it does
- Lists current files in the storage zone at deploy time, uploads all files found under SITE_DIR, and (optionally) deletes remote files that no longer exist locally.

Required secrets / env
- BUNNY_REGION
- BUNNY_API_KEY
- BUNNY_STORAGE_ZONE

Important env vars
- SITE_DIR (default: /site) — directory mounted into the container (use dist from your build).
- DRY_RUN (default: true) — when true, only simulates uploads/deletes.
- DELETE_MISSING (default: true) — when true, deletes remote files not present locally.

Run with Docker (recommended)
1. Build site: npm run build
2. Build image:
   docker build -t bunny-uploader-http scripts/bunny-upload-http
3. Run uploader (real run):
   docker run --rm \
     -e BUNNY_REGION="your_region" \
     -e BUNNY_API_KEY="your_key" \
     -e BUNNY_STORAGE_ZONE="your_zone" \
     -e DRY_RUN="false" \
     -e DELETE_MISSING="true" \
     -v "$(pwd)/dist:/site:ro" \
     bunny-uploader-http

Run locally without Docker
- Ensure jq, curl, file are installed.
- Then:
  BUNNY_API_KEY="your_key" BUNNY_STORAGE_ZONE="your_zone" DRY_RUN=false DELETE_MISSING=true SITE_DIR=dist ./scripts/bunny-upload-http/upload.sh

Notes
- Ensure your build step emits all assets (src/assets, src/js, etc.) into the directory you point SITE_DIR to (commonly dist).
- Use DRY_RUN=true first to verify behavior before enabling deletions.
