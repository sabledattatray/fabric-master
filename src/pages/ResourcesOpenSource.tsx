import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Github, ExternalLink, ShieldCheck } from "lucide-react";
import { upstreamProjects } from "../data/upstreamProjects";

export function ResourcesOpenSource() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>{t("Open Source & Community")} | {t("Fabric Master")}</title>
        <meta name="description" content={t("Fabric Master builds upon ideas, standards, documentation, and open-source resources from the broader Microsoft Fabric ecosystem.")} />
        <link rel="canonical" href="https://fabric.dattasable.com/resources/open-source" />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Github className="w-8 h-8 text-[#c9d1d9]" />
          {t("Open Source & Community Projects")}
        </h1>
        <p className="text-[#8b949e] max-w-3xl">
          {t("Fabric Master builds upon ideas, standards, documentation, APIs and open-source resources from the broader Microsoft Fabric and cloud engineering ecosystem.")}
        </p>
      </div>

      <div className="bg-[#d29922]/10 border border-[#d29922]/30 rounded-xl p-4 mb-8 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#d29922] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-[#d29922]">{t("Independent Project Disclaimer")}</h3>
          <p className="text-sm text-[#c9d1d9] mt-1">
            {t("Fabric Master is an independent open-source project created by Datta Sable. It is not affiliated with, endorsed by, or sponsored by Microsoft Corporation. All Microsoft product names, logos, and brands are property of their respective owners.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {upstreamProjects.map((project) => (
          <div key={project.name} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff]/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  {project.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                  <span className="text-[#8b949e]">
                    <span className="font-medium text-[#c9d1d9]">{t("Owner")}:</span> {project.source}
                  </span>
                  <span className="text-[#8b949e]">
                    <span className="font-medium text-[#c9d1d9]">{t("License")}:</span> {project.license}
                  </span>
                </div>
              </div>
              <a 
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#58a6ff] hover:underline text-sm font-medium shrink-0"
              >
                {t("View Repository")} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#30363d] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-[#8b949e] mb-1">{t("Purpose")}</h3>
                <p className="text-sm text-[#c9d1d9]">{project.purpose}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#8b949e] mb-1">{t("Fabric Master Relationship")}</h3>
                <p className="text-sm text-[#c9d1d9]">{project.fabricMasterRelationship}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
