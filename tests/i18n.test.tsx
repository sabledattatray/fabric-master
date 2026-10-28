import assert from "node:assert/strict";
import test from "node:test";
import { renderPage } from "../scripts/prerender-entry";
import { createTranslationInstance } from "../src/i18n";
import { interfaceTranslations } from "../src/locales/translations";
import { ARTICLES } from "../src/data/articles";
import {
  LANGUAGES,
  localizedPath,
  localizedUrl,
  normalizeLanguage,
  parseLocalizedPath,
} from "../src/lib/localization";

test("language URLs preserve routes, query parameters and fragments", () => {
  assert.equal(
    localizedPath("/architecture/planner?view=outline#components", "fr"),
    "/fr/architecture/planner?view=outline#components",
  );
  assert.equal(
    localizedPath("/fr/architecture/planner?view=outline#components", "ja"),
    "/ja/architecture/planner?view=outline#components",
  );
  assert.equal(
    localizedPath("/ja/architecture/planner?view=outline#components", "en"),
    "/architecture/planner?view=outline#components",
  );
  assert.equal(localizedPath("/?q=fabric#tools", "es"), "/es?q=fabric#tools");
  assert.equal(localizedPath("/es", "en"), "/");
  assert.equal(localizedUrl("/", "pt-BR"), "https://fabric.dattasable.com/pt");
  assert.equal(parseLocalizedPath("/resources/open-source").language, "en");
  assert.equal(
    parseLocalizedPath("/de/architecture/planner").pathname,
    "/architecture/planner",
  );
  assert.equal(parseLocalizedPath("/english").basename, "");
  assert.equal(normalizeLanguage("zh-CN"), "zh");
  assert.equal(normalizeLanguage("PT_br"), "pt");
  assert.equal(normalizeLanguage("unsupported"), "en");
});

test("all interface dictionaries have matching, nonempty entries and interpolation variables", () => {
  const keys = Object.keys(interfaceTranslations.en).sort();
  const variables = (value: string) =>
    [...value.matchAll(/{{\s*([^}]+)\s*}}/g)]
      .map((match) => match[1].trim())
      .sort();
  for (const language of LANGUAGES) {
    const dictionary = interfaceTranslations[language.code];
    assert.deepEqual(Object.keys(dictionary).sort(), keys, language.code);
    for (const key of keys) {
      assert.ok(dictionary[key].trim(), `${language.code}: ${key}`);
      assert.deepEqual(
        variables(dictionary[key]),
        variables(key),
        `${language.code}: ${key}`,
      );
    }
  }
});

test("flat punctuation keys translate, unknown content stays intact, and SSR instances are isolated", async () => {
  const [spanish, japanese] = await Promise.all([
    createTranslationInstance("es"),
    createTranslationInstance("ja"),
  ]);
  assert.equal(
    spanish.t("Great architecture."),
    interfaceTranslations.es["Great architecture."],
  );
  assert.equal(
    japanese.t("Great architecture."),
    interfaceTranslations.ja["Great architecture."],
  );
  assert.equal(
    spanish.t("My customer-defined architecture"),
    "My customer-defined architecture",
  );
  assert.notEqual(
    spanish.t("Architecture Planner"),
    japanese.t("Architecture Planner"),
  );
  assert.equal(spanish.resolvedLanguage, "es");
  assert.equal(japanese.resolvedLanguage, "ja");
});

test("English reference articles disclose their language and localized routes stay out of the index", async () => {
  const route = `/docs/${ARTICLES[0].id}`;
  const page = await renderPage(localizedPath(route, "es"));
  assert.ok(page.head.includes('noindex, follow'));
  assert.ok(page.head.includes(`rel="canonical" href="${localizedUrl(route, "en")}"`));
  assert.ok(!page.head.includes('hreflang='));
  assert.ok(page.html.includes('lang="en"'));
  assert.ok(page.html.includes(interfaceTranslations.es["Reference article in English"]));
});

for (const language of LANGUAGES) {
  test(`${language.code}: homepage has translated content and one complete set of SEO metadata`, async () => {
    const page = await renderPage(localizedPath("/", language.code));
    assert.equal(page.language, language.tag);
    assert.equal((page.head.match(/<title\b/g) || []).length, 1);
    assert.equal((page.head.match(/name="description"/g) || []).length, 1);
    assert.equal((page.head.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(
      page.head.includes(
        `rel="canonical" href="${localizedUrl("/", language.code)}"`,
      ),
    );
    assert.ok(!page.head.includes("noindex"));
    assert.ok(page.head.includes(`"inLanguage":"${language.tag}"`));
    assert.ok(
      !/<title|rel="canonical"/.test(page.html),
      "metadata belongs in the document head",
    );
    for (const alternate of LANGUAGES) {
      assert.ok(
        page.head.includes(
          `hreflang="${alternate.tag}" href="${localizedUrl("/", alternate.code)}"`,
        ),
        "reciprocal alternate",
      );
    }
    assert.ok(
      page.head.includes(
        'hreflang="x-default" href="https://fabric.dattasable.com/"',
      ),
    );
    assert.ok(
      page.html.includes(
        interfaceTranslations[language.code]["Great architecture."],
      ),
    );
    if (language.code !== "en") {
      assert.ok(!page.html.includes("Great architecture."));
      assert.ok(
        page.html.includes(`href="/${language.code}/architecture/planner"`),
      );
    }
  });
  test(`${language.code}: architecture screens translate without advertising mixed-language search alternates`, async () => {
    for (const route of ["/architecture/planner", "/architecture/onelake"]) {
      const page = await renderPage(localizedPath(route, language.code));
      assert.ok(page.html.includes("<h1"));
      assert.equal((page.head.match(/<title\b/g) || []).length, 1);
      assert.ok(
        page.head.includes(
          `rel="canonical" href="${localizedUrl(route, "en")}"`,
        ),
      );
      if (language.code !== "en") {
        assert.ok(page.head.includes("noindex, follow"));
        assert.ok(!page.head.includes("hreflang="));
        const key = route.endsWith("planner")
          ? "Architecture Planner"
          : "OneLake Visualizer";
        assert.ok(
          page.head.includes(interfaceTranslations[language.code][key]),
        );
      }
    }
  });
}
