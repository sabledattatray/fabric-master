import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { SEO } from '../components/SEO';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';

export function Documentation() {
  const { t } = useTranslation();

  // Group articles by category
  const groupedArticles = ARTICLES.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, typeof ARTICLES>);

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <SEO 
        title={t("Documentation & Articles")} 
        description={t("Learn how to optimize your Microsoft Fabric workloads, understand capacity units, and manage your FinOps.")} 
        keywords="Microsoft Fabric, Documentation, Articles, FinOps, Capacity Planning"
      />

      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
        <div className="max-w-4xl w-full flex-1">
          <div className="border-b border-[#30363d] pb-6 mb-8">
            <h1 className="text-4xl font-semibold tracking-tight text-[#e6edf3]">{t('Documentation')}</h1>
            <p className="text-xl text-[#8b949e] mt-3 font-light">{t('Learn how to optimize your Microsoft Fabric workloads, understand capacity units, and manage your FinOps.')}</p>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedArticles).map(([category, articles]) => (
              <div key={category}>
                <div className="flex items-center mb-6 border-b border-[#30363d] pb-2">
                  <BookOpen className="w-5 h-5 mr-3 text-[#58a6ff]" />
                  <h2 className="text-2xl font-semibold text-[#e6edf3]">{t(category)}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <Link 
                      key={article.id} 
                      to={`/docs/${article.id}`}
                      className="block bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm hover:border-[#8b949e] transition-colors group"
                    >
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 mr-3 text-[#8b949e] group-hover:text-[#58a6ff] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold text-[#58a6ff] group-hover:underline mb-2 leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-[#8b949e] text-sm leading-relaxed">
                            {article.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full max-w-5xl mx-auto mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}
