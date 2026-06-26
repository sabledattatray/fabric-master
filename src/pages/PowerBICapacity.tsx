import React from "react";
import { SEO } from "../components/SEO";
import { BarChart3, ArrowRight, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export function PowerBICapacity() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center custom-scrollbar bg-[#0d1117]">
      <SEO
        title={t("Power BI Capacity Estimator")}
        description={t(
          "Estimate the Microsoft Fabric Capacity Units needed to support your Power BI users and reports.",
        )}
      />
      <div className="flex-1 w-full max-w-4xl p-6 md:p-10 flex flex-col mt-4">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-[#d29922]" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">
            {t("Power BI Capacity")}
          </h1>
        </div>

        <p className="text-[#8b949e] text-lg mb-8">
          {t(
            "Ensure fast report rendering and responsive dashboards for your organization without overspending.",
          )}
        </p>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8 flex items-start gap-4">
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] shrink-0">
            <Users className="w-6 h-6 text-[#c9d1d9]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e6edf3] mb-1">
              {t("Interactive Concurrency")}
            </h3>
            <p className="text-[#8b949e] text-sm">
              {t(
                "Power BI sizing is heavily dependent on peak concurrent usage (users actively clicking/filtering at the same exact time) and the underlying complexity of the semantic models (DAX queries).",
              )}
            </p>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#e6edf3] mb-3">
            {t("Calculate Power BI Requirements")}
          </h2>
          <p className="text-[#8b949e] max-w-lg mb-6">
            {t(
              "Use the Power BI step in our main capacity wizard to model concurrency and get a data-driven F-SKU recommendation.",
            )}
          </p>
          <Link
            to="/wizard"
            className="inline-flex items-center px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-xl transition-colors"
          >
            {t("Open Calculator")}
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
