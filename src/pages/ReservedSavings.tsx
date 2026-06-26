import React from "react";
import { SEO } from "../components/SEO";
import { DollarSign, ArrowRight, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export function ReservedSavings() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center custom-scrollbar bg-[#0d1117]">
      <SEO
        title={t("Fabric Reserved Savings Estimator")}
        description={t(
          "Calculate potential savings by switching to Microsoft Fabric Reserved Instances.",
        )}
      />
      <div className="flex-1 w-full max-w-4xl p-6 md:p-10 flex flex-col mt-4">
        <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="w-8 h-8 text-[#3fb950]" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">
            {t("Reserved Savings Estimator")}
          </h1>
        </div>

        <p className="text-[#8b949e] text-lg mb-8">
          {t(
            "Explore how a 1-year commitment can significantly reduce your Microsoft Fabric expenditures.",
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <h3 className="font-semibold text-[#e6edf3] mb-2">
              {t("Pay-As-You-Go")}
            </h3>
            <p className="text-[#8b949e] text-sm">
              {t(
                "Maximum flexibility, but highest hourly rate. Best for variable, unpredictable workloads.",
              )}
            </p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 border-l-4 border-l-[#3fb950]">
            <h3 className="font-semibold text-[#e6edf3] mb-2">
              {t("Reserved Instance (1-Year)")}
            </h3>
            <p className="text-[#8b949e] text-sm">
              {t(
                "Commit to 1 year and save approximately 41% on your compute costs.",
              )}
            </p>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#e6edf3] mb-3">
            {t("Calculate Your Specific Savings")}
          </h2>
          <p className="text-[#8b949e] max-w-lg mb-6">
            {t(
              "Our Capacity Calculator automatically generates a detailed cost comparison and savings analysis based on your exact workload.",
            )}
          </p>
          <Link
            to="/wizard"
            className="inline-flex items-center px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-xl transition-colors"
          >
            {t("Run Assessment")}
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
