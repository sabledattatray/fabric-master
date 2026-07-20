import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: string;
  url?: string;
  image?: string;
  robots?: string;
  noindex?: boolean;
  schema?: Record<string, any> | Record<string, any>[];
  article?: boolean;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  type = 'website',
  url = 'https://fabric.dattasable.com',
  image = 'https://fabric.dattasable.com/og-image.jpg',
  robots,
  noindex = false,
  schema,
  article = false
}: SEOProps) {
  const { t, i18n } = useTranslation();

  const defaultTitle = t("Fabric Master | The Open Source Microsoft Fabric Engineering Platform");
  const translatedTitle = title ? t(title) : "";
  const siteTitle = title ? `${translatedTitle} | Fabric Master` : defaultTitle;
  
  const defaultDescription = t("Fabric Master by Datta Sable is the complete open-source platform for Microsoft Fabric capacity planning, FinOps, architecture design, pricing estimation, migration planning, and performance optimization.");
  const finalDescription = description ? t(description) : defaultDescription;
  
  const currentUrl = url !== 'https://fabric.dattasable.com' ? url : (typeof window !== 'undefined' ? window.location.href : url);
  const finalImage = image.startsWith('http') ? image : `https://fabric.dattasable.com${image.startsWith('/') ? '' : '/'}${image}`;

  // Keep document.title reactively updated on language or route change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = siteTitle;
      document.documentElement.lang = i18n.language;
    }
  }, [siteTitle, i18n.language]);

  // Robots directive calculation
  const finalRobots = noindex 
    ? 'noindex, follow' 
    : (robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fabric Master",
    "url": "https://fabric.dattasable.com",
    "logo": "https://fabric.dattasable.com/favicon.svg",
    "sameAs": [
      "https://github.com/sabledattatray/fabric-master",
      "https://dattasable.com",
      "https://www.linkedin.com/in/dattasable/"
    ],
    "founder": {
      "@type": "Person",
      "name": "Datta Sable",
      "jobTitle": "Data Platform Architect & Microsoft Fabric Engineer",
      "url": "https://dattasable.com"
    }
  };

  // Base Schemas
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fabric Master",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": finalDescription,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    },
    "author": {
      "@type": "Person",
      "name": "Datta Sable",
      "url": "https://dattasable.com"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Datta Sable",
    "jobTitle": ["Microsoft Fabric Engineer", "Data Platform Architect", "Open Source Developer"],
    "url": "https://dattasable.com",
    "sameAs": [
      "https://github.com/sabledattatray",
      "https://www.linkedin.com/in/dattasable/"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fabric Master",
    "url": "https://fabric.dattasable.com",
    "author": personSchema,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://fabric.dattasable.com/docs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t("Home"),
        "item": "https://fabric.dattasable.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": translatedTitle || t("Platform"),
        "item": currentUrl
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t("What is Microsoft Fabric Capacity?"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("Microsoft Fabric Capacity is the underlying compute power that runs all your workloads, from Data Factory pipelines to Power BI reports. You purchase a pool of compute resources rather than individual services.")
        }
      },
      {
        "@type": "Question",
        "name": t("How do I calculate Microsoft Fabric Cost?"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("You can calculate your Microsoft Fabric cost using the Fabric Master Capacity Calculator. It analyzes your data volume, user concurrency, and data engineering pipelines to recommend the most cost-effective F-SKU.")
        }
      },
      {
        "@type": "Question",
        "name": t("Which Microsoft Fabric SKU unlocks Power BI Free user report viewing?"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("Microsoft Fabric F64 (64 Capacity Units) is the minimum SKU that enables organizational users holding free Power BI licenses to view reports hosted in Fabric capacities.")
        }
      }
    ]
  };

  const schemasToRender: any[] = [websiteSchema, organizationSchema, softwareSchema, personSchema, breadcrumbSchema, faqSchema];
  if (schema) {
    if (Array.isArray(schema)) {
      schemasToRender.push(...schema);
    } else {
      schemasToRender.push(schema);
    }
  }

  const defaultKeywords = "Microsoft Fabric Capacity Calculator, Microsoft Fabric Pricing Calculator, Microsoft Fabric Cost Calculator, Microsoft Fabric Capacity Planning, Microsoft Fabric SKU Calculator, Fabric Capacity Estimator, Power BI Capacity Calculator, Fabric Reserved Capacity, Fabric Pricing, Fabric Cost Optimization, Microsoft Fabric Architecture, OneLake Planning, Fabric FinOps";
  const finalKeywords = keywords ? `${t(keywords)}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={finalRobots} />
      <meta name="author" content="Datta Sable" />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content="Fabric Master" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schemasToRender)}
      </script>
    </Helmet>
  );
}
