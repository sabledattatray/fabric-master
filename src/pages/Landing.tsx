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
  const [selectedSku, setSelectedSku] = useState("f64");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const sku = FABRIC_SKU_DATA.find((item) => item.slug === selectedSku)!;
  const demand = Number((sku.cu * 0.67).toFixed(1));
  const savings = (sku.monthlyPayg - sku.monthlyReserved) * 12;

  return (
    <div className="landing-page">
      <SEO
        title="Fabric Master — Microsoft Fabric Engineering Intelligence"
        description="A considered approach to Microsoft Fabric. Plan capacity, understand costs, and design your data architecture in one independent engineering workspace."
        keywords="Microsoft Fabric, capacity planning, FinOps, OneLake, architecture, Fabric Master"
        url="https://fabric.dattasable.com/"
      />
      <div className="release-strip">
        <span className="release-pill">WHAT’S NEW</span>
        <span>One workspace. Every Fabric decision.</span>
        <Link to="/workspace">
          Explore v4.0 <ArrowRight size={13} />
        </Link>
      </div>
      <div className="landing-container">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              THE INDEPENDENT FABRIC WORKBENCH
            </div>
            <h1 id="hero-title">
              Great architecture.
              <br />
              Clear decisions.
              <br />
              <span>Built with confidence.</span>
            </h1>
            <p className="hero-description">
              Bring clarity to your Microsoft Fabric estate. Plan the right
              capacity, understand every cost, and design what comes next.
            </p>
            <div className="hero-actions">
              <Link to="/workspace" className="premium-button primary">
                Open workspace <ArrowUpRight size={17} />
              </Link>
              <Link to="/wizard" className="premium-button secondary">
                Explore the tools <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-reassurance">
              <span>
                <Check size={13} />
                Free & open source
              </span>
              <span>
                <Check size={13} />
                No sign-up required
              </span>
            </div>
          </div>
          <div className="capacity-preview">
            <div className="preview-topline">
              <span>
                <span className="preview-icon">
                  <Activity size={15} />
                </span>
                Capacity overview
              </span>
              <span className="demo-label">
                <span />
                LIVE PREVIEW
              </span>
            </div>
            <div className="preview-meta">
              <span>Illustrative workload</span>
              <span>US East · USD</span>
            </div>
            <div className="preview-value">
              <div>
                <strong>
                  {demand}
                  <span> / {sku.cu} CU</span>
                </strong>
                <small>Estimated compute utilization</small>
              </div>
              <span className="health-pill">
                <span className="status-dot" />
                Healthy
              </span>
            </div>
            <div
              className="capacity-chart"
              role="img"
              aria-label={`Illustrative utilization chart: baseline demand ${demand} of ${sku.cu} capacity units. Synthetic demonstration data.`}
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
              <span>Explore capacity</span>
              <span>67% utilized</span>
            </div>
            <div className="sku-segments" aria-label="Preview capacity tier">
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
                <span>Pay-as-you-go / mo</span>
                <strong>{money(sku.monthlyPayg)}</strong>
              </div>
              <div>
                <span>Reserved / mo</span>
                <strong>
                  {money(sku.monthlyReserved)}
                  <small>~41% less</small>
                </strong>
              </div>
            </div>
            <div className="preview-footnote">
              <ShieldCheck size={13} />
              <span>Synthetic demo · planning estimates only</span>
              <Link to="/wizard" aria-label="Model your own capacity">
                <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="savings-float">
              <span className="savings-icon">
                <TrendingDown size={18} />
              </span>
              <div>
                <small>Potential annual savings</small>
                <strong>
                  {money(savings)}
                  <span>with reservation</span>
                </strong>
              </div>
            </div>
          </div>
        </section>
        <section className="platform-proof" aria-label="Platform at a glance">
          <div>
            <strong>
              11<span>tiers</span>
            </strong>
            <p>F2 through F2048</p>
          </div>
          <div>
            <strong>
              One<span>workspace</span>
            </strong>
            <p>From workload to decision</p>
          </div>
          <div>
            <strong>
              {ARTICLES.length}
              <span>guides</span>
            </strong>
            <p>Engineering knowledge, shared</p>
          </div>
          <div>
            <strong>
              100%<span>transparent</span>
            </strong>
            <p>Explainable sizing models</p>
          </div>
        </section>
        <section className="home-section" aria-labelledby="toolkit-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">YOUR ENGINEERING TOOLKIT</div>
              <h2 id="toolkit-title">Every decision, better informed.</h2>
              <p>Purpose-built tools. One connected way of thinking.</p>
            </div>
            <Link className="text-link" to="/workspace">
              View workspace <ArrowUpRight size={16} />
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
                <span className="tool-category">{tool.category}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <span className="tool-card-link">
                  {tool.link}
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="workflow-section">
          <div className="workflow-intro">
            <div className="eyebrow">FROM COMPLEXITY TO CLARITY</div>
            <h2>
              A clear path from
              <br />
              “what if” to “what’s next.”
            </h2>
            <p>
              Explore the possibilities before making the commitment. Build a
              plan your whole team can understand.
            </p>
            <Link to="/wizard" className="text-link">
              Start your assessment <ArrowRight size={16} />
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
                  <small>STEP 0{i + 1}</small>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
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
                A LITTLE KNOWLEDGE. A BETTER ARCHITECTURE.
              </div>
              <h2 id="guides-title">Built for curious engineers.</h2>
              <p>
                Practical guidance to turn a good plan into a considered one.
              </p>
            </div>
            <Link className="text-link" to="/docs">
              Explore the library <ArrowUpRight size={16} />
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
                    FABRIC FIELDNOTES <span>0{i + 1}</span>
                  </span>
                </div>
                <div className="guide-card-body">
                  <span className="guide-category">
                    ENGINEERING GUIDE <ArrowUpRight size={14} />
                  </span>
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <span className="guide-read">
                    Read the guide <ArrowRight size={14} />
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
              <div className="eyebrow">TRUST IS IN THE DETAILS</div>
              <h2>Open by design. Clear by default.</h2>
            </div>
          </div>
          <div className="principles-grid">
            <div>
              <Code2 size={20} />
              <h3>No black boxes</h3>
              <p>
                Deterministic calculations with visible assumptions and
                documented methodology.
              </p>
            </div>
            <div>
              <BookOpen size={20} />
              <h3>Grounded in the details</h3>
              <p>
                Pricing provenance, capacity specifications, and engineering
                context alongside your results.
              </p>
            </div>
            <div>
              <Github size={20} />
              <h3>Built in the open</h3>
              <p>
                Independent, MIT licensed, and community driven. Created by
                Datta Sable for data teams.
              </p>
            </div>
          </div>
          <div className="principles-footer">
            <span>
              Planning guidance you can inspect, question, and improve.
            </span>
            <Link to="/about" className="text-link">
              Our methodology <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
        <section className="faq-section">
          <div>
            <div className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</div>
            <h2>
              A few things
              <br />
              worth knowing.
            </h2>
            <Link to="/docs" className="text-link">
              Visit the documentation <ArrowUpRight size={15} />
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
                    {faq.q}
                    <ChevronDown size={17} />
                  </button>
                </h3>
                <div id={`faq-answer-${i}`} hidden={activeFaq !== i}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="closing-cta">
          <div>
            <div className="eyebrow">
              <Sparkles size={13} />
              YOUR NEXT GREAT ARCHITECTURE STARTS HERE
            </div>
            <h2>
              Build your next decision
              <br />
              on a clearer foundation.
            </h2>
            <p>Your workloads. Your assumptions. A plan that makes sense.</p>
          </div>
          <div>
            <Link to="/workspace" className="premium-button primary">
              Let’s get to work <ArrowUpRight size={17} />
            </Link>
            <span>Free to explore. Yours to build on.</span>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
