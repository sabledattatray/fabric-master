import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: string;
  url?: string;
  image?: string;
  schema?: Record<string, any> | Record<string, any>[];
  article?: boolean;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  type = 'website',
  url = 'https://fabric.dattasable.com',
  image = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  schema,
  article = false
}: SEOProps) {
  const defaultTitle = "Fabric Master by Datta Sable | Microsoft Fabric Capacity & Pricing Calculator";
  const siteTitle = title ? `${title} | Fabric Master` : defaultTitle;
  
  const defaultDescription = "Fabric Master by Datta Sable is the ultimate Microsoft Fabric toolkit featuring capacity planning, pricing calculators, SKU comparison, reserved capacity savings, Spark estimators, and Power BI capacity planning.";
  const finalDescription = description || defaultDescription;
  
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
      "https://github.com/dattasable",
      "https://www.linkedin.com/in/dattasable/"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fabric Master",
    "url": "https://fabric.dattasable.com",
    "author": personSchema
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Microsoft Fabric Capacity?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Microsoft Fabric Capacity is the underlying compute power that runs all your workloads, from Data Factory pipelines to Power BI reports. You purchase a pool of compute resources rather than individual services."
        }
      },
      {
        "@type": "Question",
        "name": "How do I calculate Microsoft Fabric Cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can calculate your Microsoft Fabric cost using the Fabric Master Capacity Calculator. It analyzes your data volume, user concurrency, and data engineering pipelines to recommend the most cost-effective F-SKU."
        }
      }
    ]
  };

  const currentUrl = url !== 'https://fabric.dattasable.com' ? url : (typeof window !== 'undefined' ? window.location.href : url);
  
  const schemasToRender = [websiteSchema, softwareSchema, personSchema, faqSchema];
  if (schema) {
    if (Array.isArray(schema)) {
      schemasToRender.push(...schema);
    } else {
      schemasToRender.push(schema);
    }
  }

  const defaultKeywords = "Microsoft Fabric Capacity Calculator, Microsoft Fabric Pricing Calculator, Microsoft Fabric Cost Calculator, Microsoft Fabric Capacity Planning, Microsoft Fabric SKU Calculator, Fabric Capacity Estimator, Power BI Capacity Calculator, Fabric Reserved Capacity, Fabric Pricing, Fabric Cost Optimization";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Fabric Master" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schemasToRender)}
      </script>
    </Helmet>
  );
}
