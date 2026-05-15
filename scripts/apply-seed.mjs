#!/usr/bin/env node
// Apply shopify-seed/store.json to the connected Shopify store.
//
// Requires:
//   SHOPIFY_STORE   (e.g. julianmonge.myshopify.com)
//   SHOPIFY_TOKEN   (Admin API access token with read_products, write_products,
//                    read_publications, write_publications scopes)
//
// Usage:
//   SHOPIFY_STORE=julianmonge.myshopify.com SHOPIFY_TOKEN=shpat_xxx \
//     node scripts/apply-seed.mjs
//
// This script is idempotent on handle: it skips products/collections that
// already exist with the same handle.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_PATH = join(__dirname, '..', 'shopify-seed', 'store.json');

const STORE = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

if (!STORE || !TOKEN) {
  console.error('Missing SHOPIFY_STORE or SHOPIFY_TOKEN environment variables.');
  process.exit(1);
}

const ENDPOINT = `https://${STORE}/admin/api/${API_VERSION}/graphql.json`;

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function findCollectionByHandle(handle) {
  const data = await gql(
    `query($handle: String!) { collectionByHandle(handle: $handle) { id title handle } }`,
    { handle }
  );
  return data.collectionByHandle;
}

async function findProductByHandle(handle) {
  const data = await gql(
    `query($handle: String!) { productByHandle(handle: $handle) { id title handle } }`,
    { handle }
  );
  return data.productByHandle;
}

async function createCollection(c) {
  const data = await gql(
    `mutation($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id handle title }
        userErrors { field message }
      }
    }`,
    {
      input: {
        handle: c.handle,
        title: c.title,
        descriptionHtml: c.descriptionHtml,
        sortOrder: c.sortOrder,
        seo: c.seo,
      },
    }
  );
  const errs = data.collectionCreate.userErrors;
  if (errs.length) throw new Error(`collectionCreate errors: ${JSON.stringify(errs)}`);
  return data.collectionCreate.collection;
}

async function createProduct(p, collectionId) {
  const productInput = {
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    productType: p.productType,
    vendor: p.vendor,
    tags: p.tags,
    status: p.status,
    templateSuffix: p.templateSuffix,
    seo: p.seo,
    productOptions: (p.options || ['Title']).map((name) => ({ name, values: [{ name: 'Default' }] })),
  };
  if (collectionId) productInput.collectionsToJoin = [collectionId];
  if (p.metafields) {
    productInput.metafields = p.metafields.map((m) => ({
      namespace: m.namespace,
      key: m.key,
      type: m.type,
      value: m.value,
    }));
  }
  const data = await gql(
    `mutation($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product { id handle title }
        userErrors { field message }
      }
    }`,
    { product: productInput }
  );
  const errs = data.productCreate.userErrors;
  if (errs.length) throw new Error(`productCreate errors: ${JSON.stringify(errs)}`);
  return data.productCreate.product;
}

async function setVariantPrice(productId, price) {
  const data = await gql(
    `query($id: ID!) { product(id: $id) { variants(first: 1) { edges { node { id } } } } }`,
    { id: productId }
  );
  const variantId = data.product.variants.edges[0]?.node?.id;
  if (!variantId) return;
  await gql(
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { field message }
      }
    }`,
    {
      productId,
      variants: [{ id: variantId, price }],
    }
  );
}

async function main() {
  const seed = JSON.parse(readFileSync(SEED_PATH, 'utf8'));

  console.log(`Applying seed to ${STORE} (API ${API_VERSION})\n`);

  const collectionIds = {};
  for (const c of seed.collections) {
    const existing = await findCollectionByHandle(c.handle);
    if (existing) {
      console.log(`  collection ${c.handle}  ← already exists (${existing.id})`);
      collectionIds[c.handle] = existing.id;
    } else {
      const created = await createCollection(c);
      console.log(`  collection ${c.handle}  + created (${created.id})`);
      collectionIds[c.handle] = created.id;
    }
  }

  for (const p of seed.products) {
    const existing = await findProductByHandle(p.handle);
    if (existing) {
      console.log(`  product ${p.handle}  ← already exists (${existing.id})`);
      continue;
    }
    const collectionId = collectionIds[p.collection];
    const created = await createProduct(p, collectionId);
    if (p.price) await setVariantPrice(created.id, p.price);
    console.log(`  product ${p.handle}  + created (${created.id}) → ${p.collection}`);
  }

  console.log('\nDone. Note: Printful and Digital Downloads still need to be wired up in their respective apps.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
