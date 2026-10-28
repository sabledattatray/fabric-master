import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowUpRight,
  BookOpen,
  ArrowRight,
  Layers,
} from "lucide-react";
import { ARTICLES } from "../data/articles";
import { SEO } from "../components/SEO";
import { Footer } from "../components/Footer";
import { useTranslation } from "react-i18next";
const categories = [
  "All guides",
  ...new Set(ARTICLES.map((article) => article.category)),
];
export function Documentation() {
  const tx = useTranslation().t;
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All guides");
  const visibleArticles = ARTICLES.filter(
    (article) =>
      (category === "All guides" || category === article.category) &&
      `${t(article.title)} ${t(article.description)} ${t(article.category)}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="documentation-page">
      <SEO
        title={t("Documentation & Articles")}
        description={t(
          "Learn how to optimize your Microsoft Fabric workloads, understand capacity units, and manage your FinOps.",
        )}
        keywords="Microsoft Fabric, Documentation, Articles, FinOps, Capacity Planning"
      />
      <div className="knowledge-container">
        <header className="knowledge-header">
          <div className="eyebrow">
            <BookOpen size={14} />
            {tx("THE FABRIC KNOWLEDGE LIBRARY")}
          </div>
          <h1>
            {t("Documentation")}
            <span>{tx("A clearer understanding starts here.")}</span>
          </h1>
          <p>
            {t(
              "Learn how to optimize your Microsoft Fabric workloads, understand capacity units, and manage your FinOps.",
            )}
          </p>
          <label className="library-search">
            <Search size={18} />
            <input
              aria-label={tx("Search documentation")}
              type="search"
              placeholder={tx("Find a concept, workload, or guide...")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>
              {ARTICLES.length}
              {" " + tx("guides")}
            </kbd>
          </label>
        </header>
        <Link
          to="/docs/getting-started-fabric-master"
          className="library-feature"
        >
          <span className="library-feature-icon">
            <Layers size={31} strokeWidth={1.4} />
          </span>
          <div>
            <span className="eyebrow">{tx("NEW TO FABRIC MASTER?")}</span>
            <h2>{tx("Start with a plan you can explain.")}</h2>
            <p>{tx("Your first capacity estimate, step by step.")}</p>
          </div>
          <span className="text-link">
            {tx("Read the getting started guide") + " "}
            <ArrowUpRight size={17} />
          </span>
        </Link>
        <div
          className="library-filters"
          aria-label={tx("Filter guides by category")}
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={category === item ? "selected" : ""}
            >
              {t(item)}
            </button>
          ))}
        </div>
        <div className="library-result-count" role="status">
          {visibleArticles.length}{" "}
          {visibleArticles.length === 1 ? tx("guide") : tx("guides")}
          {query && " " + tx("matching “{{query}}”", { query })}
        </div>
        <div className="library-grid">
          {visibleArticles.map((article, index) => (
            <Link
              key={article.id}
              to={`/docs/${article.id}`}
              className="library-card"
            >
              <div className="library-card-top">
                <span>{t(article.category)}</span>
                <ArrowUpRight size={16} />
              </div>
              <h2>{t(article.title)}</h2>
              <p>{t(article.description)}</p>
              <span className="library-card-bottom">
                {tx("Read guide") + " "}
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
        {visibleArticles.length === 0 && (
          <div className="library-empty">
            <Search size={28} />
            <h2>{tx("No guides found")}</h2>
            <p>{tx("Try another search or browse all categories.")}</p>
            <button
              className="premium-button secondary"
              onClick={() => {
                setQuery("");
                setCategory("All guides");
              }}
            >
              {tx("Clear filters")}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
