import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Database, Globe, Search, ThumbsUp, ThumbsDown, GitPullRequest, Users, MessageSquare, ChevronUp, FileText, BookOpen } from 'lucide-react';
import { Footer } from '../components/Footer';
import { ARTICLES } from '../data/articles';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function Landing() {
  const navigate = useNavigate();
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
    <div className="h-full overflow-y-auto flex flex-col items-center">
      <SEO 
        title={t('Microsoft Fabric Capacity Calculator & Cost Planning')} 
        description={t('Enterprise-grade Microsoft Fabric Capacity Planning Toolkit, SKU Recommendation Engine, and Pricing Estimator. Calculate your Fabric CU requirements, optimize costs, and forecast capacity growth.')}
        keywords="Microsoft Fabric Capacity Calculator, Microsoft Fabric Calculator, Microsoft Fabric SKU Calculator, Microsoft Fabric Pricing Calculator, Microsoft Fabric Capacity Planning, Microsoft Fabric Cost Calculator, Microsoft Fabric Capacity Estimator, Fabric Capacity Calculator, Power BI Premium Replacement, Fabric Pricing Calculator"
      />

      {/* Hero Section */}
      <section className="relative w-full h-auto min-h-[36rem] flex flex-col items-center justify-center text-center overflow-hidden border-b border-[#30363d] py-20">
        <div className="absolute inset-0 bg-black z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1117] opacity-90"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-4xl px-6">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white drop-shadow-lg">
              {t('Fabric Master')}
            </h1>
            <p className="text-xl md:text-2xl text-[#c9d1d9] font-light max-w-2xl mx-auto drop-shadow-sm">
              {t('Help for wherever you are on your Fabric Master journey.')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <button 
              onClick={() => navigate('/wizard')}
              className="px-8 py-3 bg-[#2f81f7] hover:bg-[#1f6feb] text-white font-semibold rounded-md shadow-sm transition-colors w-full sm:w-auto"
            >
              {t('Get started')}
            </button>
            <button 
              onClick={() => navigate('/docs')}
              className="px-8 py-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] font-semibold rounded-md shadow-sm transition-colors w-full sm:w-auto"
            >
              {t('Learn more')}
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-4xl">
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d] p-6 rounded-lg">
              <Database className="w-8 h-8 text-[#58a6ff] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('Capacity Calculator')}</h3>
              <p className="text-[#8b949e] text-sm">{t('Calculate your Microsoft Fabric capacity requirements.')}</p>
            </div>
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d] p-6 rounded-lg">
              <Search className="w-8 h-8 text-[#3fb950] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('Predictive Analytics')}</h3>
              <p className="text-[#8b949e] text-sm">{t('AI-driven analysis and decision support for your Microsoft Fabric investment.')}</p>
            </div>
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d] p-6 rounded-lg">
              <Globe className="w-8 h-8 text-[#d29922] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('Enterprise Edition')}</h3>
              <p className="text-[#8b949e] text-sm">{t('All the power of Fabric Master, designed for scale.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
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
                    <Link to={`/docs/${article.id}`} className="text-[#58a6ff] hover:underline flex items-start">
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
      
      <div className="w-full max-w-7xl mx-auto">
        <Footer />
      </div>
    </div>
  );
}
