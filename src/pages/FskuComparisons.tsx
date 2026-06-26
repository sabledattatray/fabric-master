import React from "react";
import { SEO } from "../components/SEO";
import { BookOpen, ArrowRight, GitCompare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export function FskuComparisons() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center custom-scrollbar bg-[#0d1117]">
      <SEO
        title={t("Microsoft Fabric F-SKU Comparisons")}
        description={t(
          "Compare Microsoft Fabric SKUs and their capacity limits.",
        )}
      />
      <div className="flex-1 w-full max-w-4xl p-6 md:p-10 flex flex-col mt-4">
        <div className="flex items-center gap-3 mb-6">
          <GitCompare className="w-8 h-8 text-[#58a6ff]" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">
            {t("F-SKU Comparisons")}
          </h1>
        </div>

        <p className="text-[#8b949e] text-lg mb-8">
          {t(
            "Understand the exact technical limits, throttling thresholds, and capabilities for each Microsoft Fabric Capacity tier (F2 - F2048).",
          )}
        </p>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8 flex items-start gap-4">
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] shrink-0">
            <BookOpen className="w-6 h-6 text-[#c9d1d9]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e6edf3] mb-1">
              {t("Documentation Matrix")}
            </h3>
            <p className="text-[#8b949e] text-sm">
              {t(
                "A full comparison of all F-SKUs is available in our Pricing Matrices section and official documentation. We list all CU constraints to prevent unpredictable throttling.",
              )}
            </p>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#e6edf3] mb-3">
            {t("View All SKU Details")}
          </h2>
          <p className="text-[#8b949e] max-w-lg mb-6">
            {t(
              "Navigate to our Pricing Matrices to see a side-by-side comparison of every SKU and their monthly commitments.",
            )}
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-6 py-3 bg-[#21262d] hover:bg-[#30363d] text-white font-medium rounded-xl border border-[#30363d] transition-colors"
          >
            {t("View Matrices")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
      <div className="w-full mt-auto max-w-5xl mx-auto">
        <Footer />
      </div>
    </div>
  );
}
