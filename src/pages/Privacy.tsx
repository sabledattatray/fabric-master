import React from 'react';
import { Shield, Eye, Database, Lock } from 'lucide-react';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center w-full bg-[#0d1117] custom-scrollbar">
      <SEO 
        title={t('Privacy Policy - Fabric Master')} 
        description={t('Privacy policy and data protection guidelines for using the Fabric Master capacity planner.')}
        keywords="Privacy Policy, Data Protection, GDPR, Fabric Master, Capacity Security"
        noindex={true}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20">
        
        <div className="mb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1f6feb]/10 text-[#58a6ff] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{t('Privacy Policy')}</h1>
          <p className="text-lg text-[#8b949e]">
            {t('Last updated: 21 October 2026')}
          </p>
        </div>

        <div className="space-y-12 text-[#c9d1d9] text-base md:text-lg leading-relaxed">
          <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-[#58a6ff]" />
              {t('1. Browser processing and hosting')}
            </h2>
            <p className="mb-4">
              {t('At Fabric Master, we prioritize your architectural privacy. All parameters, workload metrics, company names, and consultant notes you enter in our sizing wizard are processed strictly inside your local browser sandbox.')}
            </p>
            <p>
              {t('The browser sizing flow and the public API have different transmission boundaries. API requests are sent to the hosting service, which also receives ordinary HTTP request details. External AI and support services have their own data handling. Do not submit confidential inputs to an external service without authorization.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <Database className="w-5 h-5 mr-3 text-[#3fb950]" />
              {t('2. Local Storage Persistence')}
            </h2>
            <p>
              {t('To preserve your progress and allow high-fidelity PDF report generation, the wizard data and capacity calculations are stored in your web browser\'s localStorage.')}
            </p>
            <p>
              {t('Local storage is not an encrypted vault. Other people with access to your browser profile may be able to read it. Clear site data in browser settings or reset app preferences to remove saved scenarios. Avoid confidential inputs on shared devices.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <Eye className="w-5 h-5 mr-3 text-[#d29922]" />
              {t('3. Third-Party Analytics & Cookies')}
            </h2>
            <p>
              {t('This release does not load advertising or optional analytics tags. Browser storage is used for app preferences and saved scenarios. Hosting services receive ordinary request data, including IP addresses, browser headers, and requested URLs, to deliver and protect the site. Links to Microsoft, GitHub, email, and other services take you to their own privacy practices.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <Lock className="w-5 h-5 mr-3 text-[#f85149]" />
              {t('4. Contact and policy changes')}
            </h2>
            <p>
              {t('Contact Datta Sable at info@dattasable.com for privacy questions or requests about information you have sent to us. Do not include confidential workload data in an initial support request. Policy changes will be posted here with an updated review date.')}
            </p>
          </section>
        </div>

      </main>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
