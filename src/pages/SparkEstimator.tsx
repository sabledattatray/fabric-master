import React from "react";
import { SEO } from "../components/SEO";
import { Zap, ArrowRight, Server } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export function SparkEstimator() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center custom-scrollbar bg-[#0d1117]">
      <SEO
        title={t("Fabric Spark CU Estimator")}
        description={t(
          "Estimate the Capacity Units required for your Apache Spark workloads in Microsoft Fabric.",
        )}
      />
      <div className="flex-1 w-full max-w-4xl p-6 md:p-10 flex flex-col mt-4">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-[#d29922]" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">
            {t("Spark CU Estimator")}
          </h1>
        </div>

        <p className="text-[#8b949e] text-lg mb-8">
          {t(
            "Spark workloads are often the largest consumer of Fabric Capacity Units. Proper sizing is critical.",
          )}
        </p>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8 flex items-start gap-4">
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] shrink-0">
            <Server className="w-6 h-6 text-[#c9d1d9]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e6edf3] mb-1">
              {t("How it works")}
            </h3>
            <p className="text-[#8b949e] text-sm">
              {t(
                "We calculate your Spark requirements based on the number of concurrent nodes, vCores per node, and daily execution hours. Fabric Spark maps 2 Spark vCores to 1 Capacity Unit (CU).",
              )}
            </p>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#e6edf3] mb-3">
            {t("Evaluate Spark Workloads")}
          </h2>
          <p className="text-[#8b949e] max-w-lg mb-6">
            {t(
              "Use the Spark step in our main capacity wizard to model your data engineering and data science workloads.",
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
