import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { SEO } from '../components/SEO';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';

export function ArticlePage() {
  const { articleId } = useParams();
  const { t } = useTranslation();
  
  const article = useMemo(() => {
    return ARTICLES.find(a => a.id === articleId);
  }, [articleId]);

  const articleSchema = useMemo(() => {
    if (!article) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": t(article.title),
      "description": t(article.description),
      "author": {
        "@type": "Organization",
        "name": "Fabric Master Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Fabric Master",
        "logo": {
          "@type": "ImageObject",
          "url": "https://fabric-master.vercel.app/favicon.svg"
        }
      },
      "datePublished": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://fabric-master.vercel.app/docs/${articleId}`
      }
    };
  }, [article, t, articleId]);

  if (!article) {
    return <Navigate to="/docs" replace />;
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center">
      <SEO 
        title={t(article.title)} 
        description={t(article.description)} 
        keywords={`Microsoft Fabric, ${article.category}, Capacity, Fabric Master, ${t(article.title)}`}
        type="article"
        article={true}
        url={`https://fabric-master.vercel.app/docs/${articleId}`}
        schema={articleSchema}
      />
      <div className="w-full max-w-4xl p-6 md:p-10 flex-1">
        <Link to="/docs" className="inline-flex items-center text-sm text-[#8b949e] hover:text-[#58a6ff] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('Back to Documentation')}
        </Link>
        
        <div className="mb-10 pb-8 border-b border-[#30363d]">
          <div className="text-sm text-[#58a6ff] font-medium mb-2">{t(article.category)}</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">{t(article.title)}</h1>
          <p className="text-xl text-[#8b949e] leading-relaxed">{t(article.description)}</p>
        </div>
        
        <div className="prose prose-invert prose-blue max-w-none">
          <div className="markdown-body text-[#c9d1d9] leading-relaxed space-y-6">
            <Markdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-[#30363d] pb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-white mt-8 mb-4" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-base" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-base" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
              }}
            >
              {article.content}
            </Markdown>
          </div>
        </div>
      </div>
      <div className="w-full max-w-5xl mx-auto mt-12">
        <Footer />
      </div>
    </div>
  );
}
