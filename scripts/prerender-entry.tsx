import React from "react";
import { renderToString } from "react-dom/server";
import App from "../src/App";
import { createTranslationInstance } from "../src/i18n";
import { languageInfo, parseLocalizedPath } from "../src/lib/localization";
import { ARTICLES } from "../src/data/articles";
export const extraPaths = ARTICLES.map(
  (article) => "/docs/" + article.id,
).concat([
  "/privacy",
  "/terms",
  "/observability",
  "/architecture/planner",
  "/architecture/onelake",
  "/workspace",
  "/ai-advisor",
  "/resources/open-source",
  "/report",
  "/results",
  "/labs",
]);
export async function renderPage(route: string) {
  const language = parseLocalizedPath(route).language;
  const translationInstance = await createTranslationInstance(language);
  const context: any = {};
  let html = renderToString(
    <App
      initialPath={route}
      helmetContext={context}
      translationInstance={translationInstance}
    />,
  );
  const helmet = context.helmet;
  let head = helmet
    ? helmet.title.toString() +
      helmet.meta.toString() +
      helmet.link.toString() +
      helmet.script.toString()
    : "";
  // React 19 hoists native metadata into renderToString output; Helmet 3 no longer
  // collects it in context. Extract those tags into the actual document head.
  html = html.replace(
    /<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*\/?\s*>|<link\b[^>]*\/?\s*>|<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
    (tag) => {
      head += tag
        .replace(/hrefLang=/g, "hreflang=")
        .replace(/^<(title|meta|link|script)\b/i, '<$1 data-app-seo=""');
      return "";
    },
  );
  return { html, language: languageInfo(language).tag, head };
}
