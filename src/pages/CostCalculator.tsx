import React from "react";
import { SEO } from "../components/SEO";
import { DollarSign, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export function CostCalculator() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center custom-scrollbar bg-[#0d1117]">
      <SEO
        title={t("Fabric Cost Calculator")}
        description={t(
          "Estimate your Microsoft Fabric costs based on your capacity requirements.",
        )}
      />
      <div className="flex-1 w-full max-w-4xl p-6 md:p-10 flex flex-col mt-4">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-8 h-8 text-[#58a6ff]" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">
            {t("Cost Calculator")}
          </h1>
        </div>

        <p className="text-[#8b949e] text-lg mb-8">
          {t(
            "Our Cost Calculator helps you translate Fabric Capacity Units (CU) into monthly and annual financial estimates.",
          )}
        </p>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 text-center flex flex-col items-center">
          <DollarSign className="w-12 h-12 text-[#58a6ff] mb-4 opacity-80" />
          <h2 className="text-xl font-semibold text-[#e6edf3] mb-3">
            {t("Integrated with Capacity Calculator")}
          </h2>
          <p className="text-[#8b949e] max-w-lg mb-6">
            {t(
              "To provide accurate cost estimates, we first need to determine your required Capacity Units (CU). Use our full Capacity Calculator to size your workloads and instantly see your cost breakdown.",
            )}
          </p>
          <Link
            to="/wizard"
            className="inline-flex items-center px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-xl transition-colors"
          >
            {t("Start Capacity Assessment")}
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
