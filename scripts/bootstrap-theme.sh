#!/usr/bin/env bash
# Bootstrap the shop.julianmonge.com Shopify theme.
#
# Strategy: Dawn is the base. We pull a fresh Dawn, then overlay only the files
# in theme/ on top of it. That way Dawn stays upgradeable and the diff is small.
#
# Usage:
#   ./scripts/bootstrap-theme.sh <store-handle>
#
# Example:
#   ./scripts/bootstrap-theme.sh julianmonge

set -euo pipefail

STORE_HANDLE="${1:-}"
if [[ -z "$STORE_HANDLE" ]]; then
  echo "usage: $0 <store-handle>      (e.g. julianmonge for julianmonge.myshopify.com)"
  exit 1
fi
STORE_DOMAIN="${STORE_HANDLE}.myshopify.com"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/.build/theme"
OVERRIDES_DIR="$ROOT_DIR/theme"

echo "==> Checking Shopify CLI"
if ! command -v shopify >/dev/null 2>&1; then
  echo "Shopify CLI is not installed. Install it with:"
  echo "  npm install -g @shopify/cli @shopify/theme"
  exit 1
fi

echo "==> Resetting build directory: $BUILD_DIR"
rm -rf "$BUILD_DIR"
mkdir -p "$(dirname "$BUILD_DIR")"

echo "==> Cloning Shopify Dawn into build directory"
git clone --depth=1 https://github.com/Shopify/dawn.git "$BUILD_DIR"
rm -rf "$BUILD_DIR/.git"

echo "==> Overlaying brand customizations from $OVERRIDES_DIR"
# Copy every file from theme/ on top of the Dawn tree. -a preserves structure.
cp -a "$OVERRIDES_DIR/." "$BUILD_DIR/"

echo "==> Patching settings_schema.json (adds 'Brand' group)"
node "$ROOT_DIR/scripts/merge-settings-schema.mjs" \
  "$BUILD_DIR/config/settings_schema.json" \
  "$OVERRIDES_DIR/config/settings_schema.brand-patch.json"

# The brand-patch file is now merged into settings_schema.json — remove it from the build.
rm -f "$BUILD_DIR/config/settings_schema.brand-patch.json"

echo "==> Done. Build is at $BUILD_DIR"
echo ""
echo "Next steps:"
echo "  cd $BUILD_DIR"
echo "  shopify theme dev --store $STORE_DOMAIN          # preview locally"
echo "  shopify theme push --unpublished --store $STORE_DOMAIN  # push as unpublished theme"
echo "  shopify theme push --live --store $STORE_DOMAIN          # publish (use only when ready)"
