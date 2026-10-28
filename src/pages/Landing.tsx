import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Database,
  GitCompare,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Zap,
  BookOpen,
  Calculator,
  Github,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { ARTICLES } from "../data/articles";
import { SEO } from "../components/SEO";
import { FABRIC_SKU_DATA } from "../data/fskus";
const tools = [
  {
    number: "01",
    icon: Calculator,
    title: "Capacity intelligence",
    category: "SIZE WITH CONFIDENCE",
    description:
      "Turn Data Factory, Spark, and Power BI workloads into a considered capacity plan.",
    href: "/wizard",
    link: "Plan your capacity",
    tone: "mint",
  },
  {
    number: "02",
    icon: TrendingDown,
    title: "Cost intelligence",
    category: "MAKE EVERY CU COUNT",
    description:
      "Compare pay-as-you-go and reserved pricing. Understand the cost before you commit.",
    href: "/cost-calculator",
    link: "Explore your costs",
    tone: "blue",
  },
  {
    number: "03",
    icon: Layers,
    title: "Architecture studio",
    category: "DESIGN THE BIG PICTURE",
    description:
      "Connect your data estate. Model Lakehouses, OneLake, and the architecture behind them.",
    href: "/architecture/planner",
    link: "Design your architecture",
    tone: "violet",
  },
  {
    number: "04",
    icon: Bot,
    title: "Engineering advisor",
    category: "UNDERSTAND THE WHY",
    description:
      "Get explainable recommendations grounded in documented rules and your workload.",
    href: "/ai-advisor",
    link: "Meet your advisor",
    tone: "amber",
  },
];
const faqs = [
  {
    q: "What can I plan with Fabric Master?",
    a: "Estimate compute demand across Data Factory, Spark, and Power BI; compare Fabric capacity tiers and pricing; design your data architecture; and export a decision report. The Engineering Workspace brings these tools together in saved scenarios.",
  },
  {
    q: "How are the estimates calculated?",
    a: "Estimates use deterministic formulas and your workload inputs. The tools show assumptions, smoothing windows, pricing sources, and configurable headroom so you can understand the result and validate it with a representative workload.",
  },
  {
    q: "Can I compare multiple scenarios?",
    a: "Yes. Create, duplicate, and compare scenarios in the Engineering Workspace. You can adjust workload assumptions and export or import your scenarios as JSON. Scenarios are stored locally in your browser.",
  },
  {
    q: "Is Fabric Master an official Microsoft product?",
    a: "Fabric Master is an independent, open-source planning tool created by Datta Sable and the community under the MIT License. It is not affiliated with, sponsored by, or endorsed by Microsoft.",
  },
];
const previewSlugs = ["f8", "f16", "f32", "f64", "f128", "f256"];
const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
export function Landing() {
  const tx = useTranslation().t;
  const [selectedSku, setSelectedSku] = useState("f64");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const sku = FABRIC_SKU_DATA.find((item) => item.slug === selectedSku)!;
  const demand = Number((sku.cu * 0.67).toFixed(1));
  const savings = (sku.monthlyPayg - sku.monthlyReserved) * 12;
  return (
    <div className="landing-page">
      <SEO
        title={tx(
          "Fabric Master \u2014 Microsoft Fabric Engineering Intelligence",
        )}
        description="A considered approach to Microsoft Fabric. Plan capacity, understand costs, and design your data architecture in one independent engineering workspace."
        keywords="Microsoft Fabric, capacity planning, FinOps, OneLake, architecture, Fabric Master"
        url="https://fabric.dattasable.com/"
      />
      <div className="release-strip">
        <span className="release-pill">{tx("WHAT\u2019S NEW")}</span>
        <span>{tx("One workspace. Every Fabric decision.")}</span>
        <Link to="/workspace">
          {tx("Explore v4.0") + " "}
          <ArrowRight size={13} />
        </Link>
      </div>
      <div className="landing-container">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              {tx("THE INDEPENDENT FABRIC WORKBENCH")}
            </div>
            <h1 id="hero-title">
              {tx("Great architecture.")}
              <br />
              {tx("Clear decisions.")}
              <br />
              <span>{tx("Built with confidence.")}</span>
            </h1>
            <p className="hero-description">
              {tx(
                "Bring clarity to your Microsoft Fabric estate. Plan the right capacity, understand every cost, and design what comes next.",
              )}
            </p>
            <div className="hero-actions">
              <Link to="/workspace" className="premium-button primary">
                {tx("Open workspace") + " "}
                <ArrowUpRight size={17} />
              </Link>
              <Link to="/wizard" className="premium-button secondary">
                {tx("Explore the tools") + " "}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-reassurance">
              <span>
                <Check size={13} />
                {tx("Free & open source")}
              </span>
              <span>
                <Check size={13} />
                {tx("No sign-up required")}
              </span>
            </div>
          </div>
          <div className="capacity-preview">
            <div className="preview-topline">
              <span>
                <span className="preview-icon">
                  <Activity size={15} />
                </span>
                {tx("Capacity overview")}
              </span>
              <span className="demo-label">
                <span />
                {tx("LIVE PREVIEW")}
              </span>
            </div>
            <div className="preview-meta">
              <span>{tx("Illustrative workload")}</span>
              <span>{tx("US East \u00B7 USD")}</span>
            </div>
            <div className="preview-value">
              <div>
                <strong>
                  {demand}
                  <span> / {sku.cu} CU</span>
                </strong>
                <small>{tx("Estimated compute utilization")}</small>
              </div>
              <span className="health-pill">
                <span className="status-dot" />
                {tx("Healthy")}
              </span>
            </div>
            <div
              className="capacity-chart"
              role="img"
              aria-label={tx("Illustrative utilization chart: baseline demand {{demand}} of {{capacity}} capacity units. Synthetic demonstration data.", { demand, capacity: sku.cu })}
            >
              <div className="chart-axis">
                <span>{sku.cu} CU</span>
                <span>{sku.cu / 2}</span>
                <span>0</span>
              </div>
              <svg
                viewBox="0 0 420 130"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="preview-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#56d8b5" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#56d8b5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="chart-grid"
                  d="M0 14H420 M0 68H420 M0 122H420"
                />
                <path className="chart-capacity" d="M0 14H420" />
                <path
                  d="M0 104C12 102 15 88 29 89S45 105 60 88S77 83 90 78S105 98 120 76S135 82 150 67S167 83 181 70S194 43 210 52S226 70 242 54S257 66 273 41S290 38 304 49S320 37 335 44S349 23 365 35S385 52 398 33S412 36 420 29V130H0Z"
                  fill="url(#preview-area)"
                />
                <path
                  d="M0 104C12 102 15 88 29 89S45 105 60 88S77 83 90 78S105 98 120 76S135 82 150 67S167 83 181 70S194 43 210 52S226 70 242 54S257 66 273 41S290 38 304 49S320 37 335 44S349 23 365 35S385 52 398 33S412 36 420 29"
                  fill="none"
                  stroke="#56d8b5"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="chart-times">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>
            </div>
            <div className="preview-tier-row">
              <span>{tx("Explore capacity")}</span>
              <span>{tx("67% utilized")}</span>
            </div>
            <div
              className="sku-segments"
              aria-label={tx("Preview capacity tier")}
            >
              {previewSlugs.map((slug) => (
                <button
                  type="button"
                  key={slug}
                  aria-pressed={slug === selectedSku}
                  onClick={() => setSelectedSku(slug)}
                  className={slug === selectedSku ? "selected" : ""}
                >
                  {slug.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="preview-costs">
              <div>
                <span>{tx("Pay-as-you-go / mo")}</span>
                <strong>{money(sku.monthlyPayg)}</strong>
              </div>
              <div>
                <span>{tx("Reserved / mo")}</span>
                <strong>
                  {money(sku.monthlyReserved)}
                  <small>{tx("~41% less")}</small>
                </strong>
              </div>
            </div>
            <div className="preview-footnote">
              <ShieldCheck size={13} />
              <span>{tx("Synthetic demo \u00B7 planning estimates only")}</span>
              <Link to="/wizard" aria-label={tx("Model your own capacity")}>
                <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="savings-float">
              <span className="savings-icon">
                <TrendingDown size={18} />
              </span>
              <div>
                <small>{tx("Potential annual savings")}</small>
                <strong>
                  {money(savings)}
                  <span>{tx("with reservation")}</span>
                </strong>
              </div>
            </div>
          </div>
        </section>
        <section
          className="platform-proof"
          aria-label={tx("Platform at a glance")}
        >
          <div>
            <strong>
              11<span>{tx("tiers")}</span>
            </strong>
            <p>{tx("F2 through F2048")}</p>
          </div>
          <div>
            <strong>
              {tx("One")}
              <span>{tx("workspace")}</span>
            </strong>
            <p>{tx("From workload to decision")}</p>
          </div>
          <div>
            <strong>
              {ARTICLES.length}
              <span>{tx("guides")}</span>
            </strong>
            <p>{tx("Engineering knowledge, shared")}</p>
          </div>
          <div>
            <strong>
              100%<span>{tx("transparent")}</span>
            </strong>
            <p>{tx("Explainable sizing models")}</p>
          </div>
        </section>
        <section className="home-section" aria-labelledby="toolkit-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">{tx("YOUR ENGINEERING TOOLKIT")}</div>
              <h2 id="toolkit-title">
                {tx("Every decision, better informed.")}
              </h2>
              <p>{tx("Purpose-built tools. One connected way of thinking.")}</p>
            </div>
            <Link className="text-link" to="/workspace">
              {tx("View workspace") + " "}
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="tool-grid">
            {tools.map((tool) => (
              <Link
                to={tool.href}
                className={`tool-card ${tool.tone}`}
                key={tool.title}
              >
                <div className="tool-card-top">
                  <span className="tool-icon">
                    <tool.icon size={22} strokeWidth={1.5} />
                  </span>
                  <span className="tool-number">{tool.number} /</span>
                </div>
                <span className="tool-category">
                  {tx(String(tool.category ?? ""))}
                </span>
                <h3>{tx(String(tool.title ?? ""))}</h3>
                <p>{tx(String(tool.description ?? ""))}</p>
                <span className="tool-card-link">
                  {tx(String(tool.link ?? ""))}
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="workflow-section">
          <div className="workflow-intro">
            <div className="eyebrow">{tx("FROM COMPLEXITY TO CLARITY")}</div>
            <h2>
              {tx("A clear path from")}
              <br />
              {tx("\u201Cwhat if\u201D to \u201Cwhat\u2019s next.\u201D")}
            </h2>
            <p>
              {tx(
                "Explore the possibilities before making the commitment. Build a plan your whole team can understand.",
              )}
            </p>
            <Link to="/wizard" className="text-link">
              {tx("Start your assessment") + " "}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="workflow-steps">
            {[
              {
                title: "Define your workload",
                text: "Bring your pipelines, Spark jobs, and reporting needs.",
                icon: Database,
                href: "/wizard",
              },
              {
                title: "Find the right fit",
                text: "Model capacity, compare costs, and test assumptions.",
                icon: GitCompare,
                href: "/workspace",
              },
              {
                title: "Move forward with a plan",
                text: "Design your architecture and share a decision report.",
                icon: CheckCircle2,
                href: "/architecture/planner",
              },
            ].map((step, i) => (
              <Link to={step.href} className="workflow-step" key={step.title}>
                <span className="workflow-step-icon">
                  <step.icon size={19} />
                </span>
                <div>
                  <small>
                    {tx("STEP 0")}
                    {i + 1}
                  </small>
                  <h3>{tx(String(step.title ?? ""))}</h3>
                  <p>{tx(step.text)}</p>
                </div>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
        <section className="home-section" aria-labelledby="guides-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                {tx("A LITTLE KNOWLEDGE. A BETTER ARCHITECTURE.")}
              </div>
              <h2 id="guides-title">{tx("Built for curious engineers.")}</h2>
              <p>
                {tx(
                  "Practical guidance to turn a good plan into a considered one.",
                )}
              </p>
            </div>
            <Link className="text-link" to="/docs">
              {tx("Explore the library") + " "}
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="guide-grid">
            {ARTICLES.slice(0, 3).map((guide, i) => (
              <Link
                to={`/docs/${guide.id}`}
                className="guide-card"
                key={guide.id}
              >
                <div className={`guide-art guide-art-${i}`} aria-hidden="true">
                  <span className="guide-orbit orbit-one" />
                  <span className="guide-orbit orbit-two" />
                  <span className="guide-art-icon">
                    {i === 0 ? (
                      <Layers size={35} strokeWidth={1} />
                    ) : i === 1 ? (
                      <Activity size={35} strokeWidth={1} />
                    ) : (
                      <Zap size={35} strokeWidth={1} />
                    )}
                  </span>
                  <span className="guide-art-label">
                    {tx("FABRIC FIELDNOTES") + " "}
                    <span>0{i + 1}</span>
                  </span>
                </div>
                <div className="guide-card-body">
                  <span className="guide-category">
                    {tx("ENGINEERING GUIDE") + " "}
                    <ArrowUpRight size={14} />
                  </span>
                  <h3>{tx(String(guide.title ?? ""))}</h3>
                  <p>{tx(String(guide.description ?? ""))}</p>
                  <span className="guide-read">
                    {tx("Read the guide") + " "}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="principles-section">
          <div className="principles-heading">
            <span className="principle-seal">
              <ShieldCheck size={25} strokeWidth={1.5} />
            </span>
            <div>
              <div className="eyebrow">{tx("TRUST IS IN THE DETAILS")}</div>
              <h2>{tx("Open by design. Clear by default.")}</h2>
            </div>
          </div>
          <div className="principles-grid">
            <div>
              <Code2 size={20} />
              <h3>{tx("No black boxes")}</h3>
              <p>
                {tx(
                  "Deterministic calculations with visible assumptions and documented methodology.",
                )}
              </p>
            </div>
            <div>
              <BookOpen size={20} />
              <h3>{tx("Grounded in the details")}</h3>
              <p>
                {tx(
                  "Pricing provenance, capacity specifications, and engineering context alongside your results.",
                )}
              </p>
            </div>
            <div>
              <Github size={20} />
              <h3>{tx("Built in the open")}</h3>
              <p>
                {tx(
                  "Independent, MIT licensed, and community driven. Created by Datta Sable for data teams.",
                )}
              </p>
            </div>
          </div>
          <div className="principles-footer">
            <span>
              {tx("Planning guidance you can inspect, question, and improve.")}
            </span>
            <Link to="/about" className="text-link">
              {tx("Our methodology") + " "}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
        <section className="faq-section">
          <div>
            <div className="eyebrow">
              {tx("GOOD QUESTIONS. CLEAR ANSWERS.")}
            </div>
            <h2>
              {tx("A few things")}
              <br />
              {tx("worth knowing.")}
            </h2>
            <Link to="/docs" className="text-link">
              {tx("Visit the documentation") + " "}
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                className={`faq-item ${activeFaq === i ? "open" : ""}`}
                key={faq.q}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={activeFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    {tx(String(faq.q ?? ""))}
                    <ChevronDown size={17} />
                  </button>
                </h3>
                <div id={`faq-answer-${i}`} hidden={activeFaq !== i}>
                  <p>{tx(String(faq.a ?? ""))}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="closing-cta">
          <div>
            <div className="eyebrow">
              <Sparkles size={13} />
              {tx("YOUR NEXT GREAT ARCHITECTURE STARTS HERE")}
            </div>
            <h2>
              {tx("Build your next decision")}
              <br />
              {tx("on a clearer foundation.")}
            </h2>
            <p>
              {tx("Your workloads. Your assumptions. A plan that makes sense.")}
            </p>
          </div>
          <div>
            <Link to="/workspace" className="premium-button primary">
              {tx("Let\u2019s get to work") + " "}
              <ArrowUpRight size={17} />
            </Link>
            <span>{tx("Free to explore. Yours to build on.")}</span>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
