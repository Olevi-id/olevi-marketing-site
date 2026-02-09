#!/usr/bin/env bash
# Bunny Storage HTTP API uploader (listing-based)
# Docs: https://docs.bunny.net/storage/http
set -euo pipefail

if [ -z "${BUNNY_API_KEY:-}" ] || [ -z "${BUNNY_STORAGE_ZONE:-}" ]; then
  echo "BUNNY_API_KEY and BUNNY_STORAGE_ZONE must be set"
  exit 1
fi

DRY_RUN="${DRY_RUN:-true}"
DELETE_MISSING="${DELETE_MISSING:-true}"
SITE_DIR="/site"
BASE_URL="https://${BUNNY_REGION}.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}"

if [ ! -d "$SITE_DIR" ]; then
  echo "No site found at $SITE_DIR"
  exit 1
fi

# Try multiple candidate listing endpoints; pick first that returns JSON
list_json=""
candidates=(
  "${BASE_URL}?list=true&recursive=true&format=json"
  "${BASE_URL}?list&recursive=true&format=json"
  "${BASE_URL}?list=true&format=json"
  "${BASE_URL}?format=json"
  "${BASE_URL}?list=true"
  "${BASE_URL}?list"
)
for u in "${candidates[@]}"; do
  if out=$(curl -fsS -H "AccessKey: ${BUNNY_API_KEY}" "$u" 2>/dev/null || true); then
    if [ -n "$out" ]; then
      # basic JSON check
      case "$out" in
        *\{*|*\[*)
          list_json="$out"
          break
          ;;
      esac
    fi
  fi
done

# Parse remote files into array (robust to a few JSON shapes)
remote_files=()
if [ -n "$list_json" ]; then
  mapfile -t remote_files < <(printf '%s\n' "$list_json" | jq -r '
    if type=="array" then .[] else if .files then .files[] else . end end |
    if type=="string" then . else (.Path // .path // .Name // .name // .FilePath // .FullPath // .FileName // .file) end' 2>/dev/null || true)
  # normalize leading slashes
  for i in "${!remote_files[@]}"; do
    remote_files[$i]="${remote_files[$i]#/}"
  done
else
  echo "Warning: remote listing not available; skipping remote-delete detection."
fi

# Gather local files (relative paths)
local_files=()
while IFS= read -r -d '' f; do
  local_files+=("${f#$SITE_DIR/}")
done < <(find "$SITE_DIR" -type f -print0)

# Build lookup set for local files
declare -A local_set=()
for p in "${local_files[@]}"; do local_set["$p"]=1; done

# Determine remote-only files
to_delete=()
if [ "${#remote_files[@]}" -gt 0 ]; then
  for p in "${remote_files[@]}"; do
    if [ -n "$p" ] && [ -z "${local_set[$p]:-}" ]; then
      to_delete+=("$p")
    fi
  done
fi

upload_file() {
  local file="$1"
  local rel="$2"
  local mime
  mime=$(file --mime-type -b "$file" 2>/dev/null || echo "application/octet-stream")
  local url="${BASE_URL}/${rel}"

  if [ "$DRY_RUN" = "true" ]; then
    echo "[DRY RUN] PUT $url (Content-Type: $mime) -> $file"
  else
    echo "Uploading $rel"
    curl -fS --silent -X PUT -H "AccessKey: ${BUNNY_API_KEY}" -H "Content-Type: ${mime}" --data-binary @"${file}" "${url}" \
      || { echo "Upload failed for $rel"; return 1; }
  fi
}

delete_remote() {
  local rel="$1"
  local url="${BASE_URL}/${rel}"
  if [ "$DRY_RUN" = "true" ]; then
    echo "[DRY RUN] DELETE ${url}"
  else
    echo "Deleting remote file: $rel"
    curl -fS --silent -X DELETE -H "AccessKey: ${BUNNY_API_KEY}" "${url}" \
      || { echo "Failed to delete ${rel}"; return 1; }
  fi
}

# Upload local files
for rel in "${local_files[@]}"; do
  upload_file "${SITE_DIR}/${rel}" "$rel" || exit 1
done

# Delete remote-only files if enabled
if [ "${DELETE_MISSING}" = "true" ] && [ "${#to_delete[@]}" -gt 0 ]; then
  for p in "${to_delete[@]}"; do
    delete_remote "$p" || exit 1
  done
else
  if [ "${#to_delete[@]}" -gt 0 ]; then
    echo "DELETE_MISSING is false; remote-only files detected but not deleted."
  else
    echo "No remote-only files detected."
  fi
fi

echo "Upload complete."
