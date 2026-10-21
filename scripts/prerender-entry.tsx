import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import '../src/i18n';
import { ARTICLES } from '../src/data/articles';
export const extraPaths = ARTICLES.map(article => '/docs/' + article.id).concat(['/privacy', '/terms']);

export async function renderPage(route: string) {
  const context: any = {};
  const html = renderToString(<App initialPath={route} helmetContext={context} />);
  const helmet = context.helmet;
  return { html, head: helmet ? helmet.title.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString() : '' };
}
