import React from 'react';
import { Link } from 'react-router-dom';
import { ARTICLES } from '../data/articles';
import { SEO } from '../components/SEO';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';

export function Documentation() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-[#0d1117] custom-scrollbar">
      <SEO 
        title={t("Documentation & Articles")} 
        description={t("Learn how to optimize your Microsoft Fabric workloads, understand capacity units, and manage your FinOps.")} 
        keywords="Microsoft Fabric, Documentation, Articles, FinOps, Capacity Planning"
      />

      <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col items-center">
        <div className="max-w-7xl w-full flex-1">
          <div className="border-b border-[#30363d] pb-8 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#f0f6fc]">{t('Documentation')}</h1>
            <p className="text-lg md:text-xl text-[#8b949e] mt-4 max-w-3xl leading-relaxed">{t('Learn how to optimize your Microsoft Fabric workloads, understand capacity units, and manage your FinOps.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {ARTICLES.map((article) => (
              <Link 
                key={article.id} 
                to={`/docs/${article.id}`}
                className="group flex flex-col h-full bg-[#161b22] border border-[#30363d] rounded-md p-6 hover:border-[#8b949e] hover:bg-[#1c2128] transition-all duration-200"
              >
                <div className="mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                    {t(article.category)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors leading-snug mb-3">
                  {t(article.title)}
                </h3>
                <p className="text-[#8b949e] text-sm leading-relaxed flex-1 line-clamp-3">
                  {t(article.description)}
                </p>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto mt-20">
          <Footer />
        </div>
      </div>
    </div>
  );
}

