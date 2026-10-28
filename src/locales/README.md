# Interface translations

`interface.tsv` is the editable UTF-8 source for English keys and eight translations. Keep columns and interpolation placeholders unchanged. Run `node scripts/build-translations.mjs` after editing it; the production build also validates and regenerates `translations.ts` automatically. Run `npm run test:i18n` for routing, dictionary parity, interpolation, SSR isolation and metadata checks.

The URL is the language source of truth: English uses `/`, Spanish uses `/es`, and tools retain the prefix (for example `/es/architecture/planner`). The selector preserves the current route, query and fragment. Explicit URLs work independently of browser storage. Microsoft product names, identifiers, user inputs and saved scenario data retain their original values.

Only the fully translated homepage currently qualifies for localized search indexing, reciprocal hreflang links and sitemap entries. Technical reference content and article bodies remain in English. Their localized interface routes use `noindex, follow` with an English canonical, and the selector discloses this limitation. Add a route to `hasLocalizedSearchContent` only after its complete page content and metadata have translations in every supported language; update sitemap generation and tests at the same time.

The prerenderer creates an isolated i18next instance per route and moves React 19 metadata into the document head. Client startup replaces marked prerendered metadata with React-managed metadata, preventing duplicates while preserving SEO without JavaScript.
