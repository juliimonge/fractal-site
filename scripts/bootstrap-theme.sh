#!/usr/bin/env bash
# Assemble the shop.julianmonge.com theme by pulling Dawn from the store,
# overlaying our brand files, and merging the settings_schema.
#
# WHY PULL FROM THE STORE (not GitHub): the agent proxy in some Claude Code
# environments blocks github.com fetches of Shopify/dawn (both git-clone and
# tarball paths). Every new Shopify store ships with Dawn already installed
# as the default theme, so we pull that copy over the Theme Access token
# instead. Same result, works everywhere.
#
# Usage:
#   export SHOPIFY_CLI_THEME_TOKEN=shptka_xxxxxxxxxxxxxxxxxxxxxx
#   ./scripts/bootstrap-theme.sh <store-handle>
#
# Example:
#   export SHOPIFY_CLI_THEME_TOKEN=shptka_abc123...
#   ./scripts/bootstrap-theme.sh julianmonge
#
# The script leaves .build/theme ready for:
#   cd .build/theme && shopify theme push --unpublished --json

set -euo pipefail

STORE_HANDLE="${1:-}"
if [[ -z "$STORE_HANDLE" ]]; then
  echo "usage: $0 <store-handle>      (e.g. julianmonge for julianmonge.myshopify.com)" >&2
  exit 1
fi
STORE_DOMAIN="${STORE_HANDLE}.myshopify.com"

if [[ -z "${SHOPIFY_CLI_THEME_TOKEN:-}" ]]; then
  echo "error: SHOPIFY_CLI_THEME_TOKEN is not set" >&2
  echo "" >&2
  echo "Install Shopify's Theme Access app (free), generate a password," >&2
  echo "and export it:" >&2
  echo "" >&2
  echo "  export SHOPIFY_CLI_THEME_TOKEN=shptka_..." >&2
  echo "  $0 $STORE_HANDLE" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/.build/theme"
OVERRIDES_DIR="$ROOT_DIR/theme"

echo "==> Checking Shopify CLI"
if ! command -v shopify >/dev/null 2>&1; then
  echo "Shopify CLI is not installed. Install it with:" >&2
  echo "  npm install -g @shopify/cli @shopify/theme" >&2
  exit 1
fi

echo "==> Resetting build directory: $BUILD_DIR"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo "==> Pulling Dawn from $STORE_DOMAIN (main theme)"
# --live pulls whatever's set as the store's published theme (Dawn by default).
shopify theme pull \
  --store "$STORE_DOMAIN" \
  --live \
  --path "$BUILD_DIR" \
  --no-color \
  --force

echo "==> Overlaying brand customizations from $OVERRIDES_DIR"
cp -a "$OVERRIDES_DIR/." "$BUILD_DIR/"

echo "==> Merging Brand group into settings_schema.json"
node "$ROOT_DIR/scripts/merge-settings-schema.mjs" \
  "$BUILD_DIR/config/settings_schema.json" \
  "$OVERRIDES_DIR/config/settings_schema.brand-patch.json"
rm -f "$BUILD_DIR/config/settings_schema.brand-patch.json"

echo "==> Done. Build is at $BUILD_DIR"
echo ""
echo "Next steps:"
echo "  cd $BUILD_DIR"
echo "  shopify theme check                                                # validate"
echo "  shopify theme push --unpublished --json --store $STORE_DOMAIN      # push as draft"
echo "  shopify theme push --live --json --store $STORE_DOMAIN             # publish (careful!)"
