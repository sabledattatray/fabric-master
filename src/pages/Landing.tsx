import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Database,
  Globe,
  Search,
  ThumbsUp,
  ThumbsDown,
  GitPullRequest,
  Users,
  MessageSquare,
  ChevronUp,
  FileText,
  BookOpen,
  Star,
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { ARTICLES } from "../data/articles";
import { SEO } from "../components/SEO";
import { useTranslation } from "react-i18next";

export function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Group articles by category
  const groupedArticles = ARTICLES.reduce(
    (acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = [];
      }
      acc[article.category].push(article);
      return acc;
    },
    {} as Record<string, typeof ARTICLES>,
  );

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#0d1117] block">
      <SEO
        title={t("Microsoft Fabric Capacity Calculator & Cost Planning")}
        description={t(
          "Enterprise-grade Microsoft Fabric Capacity Planning Toolkit, SKU Recommendation Engine, and Pricing Estimator. Calculate your Fabric CU requirements, optimize costs, and forecast capacity growth.",
        )}
        keywords="Microsoft Fabric Capacity Calculator, Microsoft Fabric Calculator, Microsoft Fabric SKU Calculator, Microsoft Fabric Pricing Calculator, Microsoft Fabric Capacity Planning, Microsoft Fabric Cost Calculator, Microsoft Fabric Capacity Estimator, Fabric Capacity Calculator, Power BI Premium Replacement, Fabric Pricing Calculator"
      />

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center px-4 border-b border-[#30363d] min-h-[calc(100vh-4rem)] overflow-hidden bg-[#161B22]">
        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 max-w-4xl w-full pt-16 pb-16 md:pt-24 md:pb-24 font-hero flex-1 justify-center">
          <div className="space-y-4 md:space-y-6 text-center">
            <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-display font-bold tracking-tight text-white drop-shadow-lg leading-tight px-2">
              {t("The Open-Source Microsoft Fabric Toolkit")}
            </h1>
            <p className="text-sm sm:text-lg md:text-[16px] text-[#c9d1d9] font-normal max-w-2xl mx-auto drop-shadow-sm px-4">
              {t(
                "Plan capacity, estimate pricing, compare Fabric SKUs, calculate reserved savings, forecast growth, and optimize Microsoft Fabric deployments.",
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4 mt-2 sm:mt-4 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={() => navigate("/wizard")}
              className="px-6 md:px-8 py-3.5 bg-[#2EA043] hover:bg-[#2c974b] text-white font-medium rounded-xl shadow-sm transition-colors w-full sm:w-auto text-[15px] md:text-[16px] whitespace-normal sm:whitespace-nowrap h-auto min-h-[48px]"
            >
              {t("Launch Capacity Calculator")}
            </button>
            <button
              onClick={() => navigate("/docs")}
              className="px-6 md:px-8 py-3.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] font-medium rounded-xl shadow-sm transition-colors w-full sm:w-auto text-[15px] md:text-[16px] whitespace-normal sm:whitespace-nowrap h-auto min-h-[48px]"
            >
              {t("View Documentation")}
            </button>
            <a
              href="https://github.com/sabledattatray/fabric-master"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 md:px-8 py-3.5 bg-transparent hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] font-medium rounded-xl shadow-sm transition-colors w-full sm:w-auto text-[15px] md:text-[16px] flex items-center justify-center gap-2 whitespace-normal sm:whitespace-nowrap h-auto min-h-[48px]"
            >
              <Github className="w-5 h-5 shrink-0" /> {t("GitHub")}
            </a>
          </div>

          {/* Personal Branding Mini-Section */}
          <div className="mt-6 md:mt-8 flex flex-col items-center justify-center space-y-2 border border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm rounded-md px-4 md:px-6 py-3 w-full sm:w-auto text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-[#8b949e]">
              <span>{t("Created by")}</span>
              <a
                href="https://dattasable.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:text-[#58a6ff] transition-colors flex items-center"
              >
                Datta Sable
              </a>
            </div>
            <div className="flex items-center justify-center space-x-2 md:space-x-3 text-[10px] md:text-xs text-[#8b949e] font-mono flex-wrap">
              <span>{t("Microsoft Fabric Engineer")}</span>
              <span className="hidden md:inline-block w-1 h-1 bg-[#30363d] rounded-full"></span>
              <span className="md:hidden opacity-50">•</span>
              <span>{t("Data Platform Architect")}</span>
              <span className="hidden md:inline-block w-1 h-1 bg-[#30363d] rounded-full"></span>
              <span className="md:hidden opacity-50">•</span>
              <span>{t("Open Source Developer")}</span>
            </div>
          </div>

          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left w-full max-w-4xl">
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d] p-6 rounded-2xl">
              <Database className="w-8 h-8 text-[#58a6ff] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("Capacity Calculator")}
              </h3>
              <p className="text-[#8b949e] text-sm">
                {t("Calculate your Microsoft Fabric capacity requirements.")}
              </p>
            </div>
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d] p-6 rounded-2xl">
              <Globe className="w-8 h-8 text-[#3fb950] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("Fabric Cost Optimizer")}
              </h3>
              <p className="text-[#8b949e] text-sm">
                {t(
                  "Compare reserved vs pay-as-you-go pricing for Microsoft Fabric.",
                )}
              </p>
            </div>
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d] p-6 rounded-2xl">
              <Search className="w-8 h-8 text-[#d29922] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("Power BI Capacity")}
              </h3>
              <p className="text-[#8b949e] text-sm">
                {t("Estimate Power BI Premium and Fabric Capacity needs.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Optimized Content Section */}
      <section className="w-full border-b border-[#30363d] bg-[#0D1117] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-6">
              The Definitive{" "}
              <span className="text-[#58a6ff]">
                Microsoft Fabric Capacity Calculator
              </span>
            </h2>
            <p className="text-[#8b949e] text-lg leading-relaxed mb-6">
              Whether you're migrating from Synapse Analytics, upgrading from
              Power BI Premium, or building a new data estate on OneLake,
              understanding your{" "}
              <strong className="text-[#c9d1d9] font-medium">
                Microsoft Fabric Pricing
              </strong>{" "}
              is critical. Fabric Master helps you avoid over-provisioning and
              accurately estimate costs.
            </p>
            <ul className="space-y-4 text-[#c9d1d9]">
              <li className="flex items-start">
                <Database className="w-5 h-5 text-[#3fb950] mr-3 mt-1 shrink-0" />
                <span>
                  <strong>Microsoft Fabric Cost Calculator:</strong> Predict
                  your monthly and annual spend with precision.
                </span>
              </li>
              <li className="flex items-start">
                <Search className="w-5 h-5 text-[#3fb950] mr-3 mt-1 shrink-0" />
                <span>
                  <strong>Microsoft Fabric SKU Comparison:</strong> Compare F2,
                  F64, F128 and more to find your perfect fit.
                </span>
              </li>
              <li className="flex items-start">
                <Globe className="w-5 h-5 text-[#3fb950] mr-3 mt-1 shrink-0" />
                <span>
                  <strong>Fabric Reserved Capacity Savings:</strong> Discover
                  how 1-year reservations impact your ROI.
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Database className="w-32 h-32 text-[#58a6ff]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Fabric Spark Capacity Estimator
            </h3>
            <p className="text-[#8b949e] mb-6">
              Spark compute is one of the highest consumers of Capacity Units
              (CUs). Calculate your exact CU requirements based on executor
              count, node sizes, and concurrency.
            </p>
            <button
              onClick={() => navigate("/wizard")}
              className="text-[#58a6ff] hover:text-white font-medium flex items-center transition-colors"
            >
              Start Estimating <Globe className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid (Documentation / Blog) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-white">
            Fabric Master Documentation & Guides
          </h2>
          <Link
            to="/docs"
            className="text-[#58a6ff] hover:underline text-sm font-medium"
          >
            View all resources &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Object.entries(groupedArticles).map(([category, articles]) => (
            <div key={category}>
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-[#8b949e]" />
                {t(category)}
              </h2>
              <ul className="space-y-3 text-sm">
                {articles.map((article) => (
                  <li key={article.id}>
                    <Link
                      to={`/docs/${article.id}`}
                      className="text-[#58a6ff] hover:underline flex items-start"
                    >
                      <FileText className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-70" />
                      <span>{t(article.title)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      {/* Trust Badges */}
      <section className="w-full border-t border-[#30363d] bg-[#0D1117] py-12 px-6 text-center">
        <h2 className="text-[#8b949e] font-semibold uppercase tracking-wider text-sm mb-6">
          Trusted By The Open Source Community
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-70">
          <div className="flex items-center space-x-2 text-[#c9d1d9] font-medium">
            <Github className="w-6 h-6" /> <span>Open Source</span>
          </div>
          <div className="flex items-center space-x-2 text-[#c9d1d9] font-medium">
            <Star className="w-6 h-6 text-[#d29922]" />{" "}
            <span>GitHub Stars</span>
          </div>
          <div className="flex items-center space-x-2 text-[#c9d1d9] font-medium">
            <GitPullRequest className="w-6 h-6 text-[#3fb950]" />{" "}
            <span>MIT License</span>
          </div>
          <div className="flex items-center space-x-2 text-[#c9d1d9] font-medium">
            <Users className="w-6 h-6 text-[#58a6ff]" />{" "}
            <span>Community Driven</span>
          </div>
        </div>
      </section>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
