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
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20">
        
        <div className="mb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1f6feb]/10 text-[#58a6ff] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{t('Privacy Policy')}</h1>
          <p className="text-lg text-[#8b949e]">
            {t('Last updated: June 2026')}
          </p>
        </div>

        <div className="space-y-12 text-[#c9d1d9] text-base md:text-lg leading-relaxed">
          <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-[#58a6ff]" />
              {t('1. 100% Client-Side Architecture')}
            </h2>
            <p className="mb-4">
              {t('At Fabric Master, we prioritize your architectural privacy. All parameters, workload metrics, company names, and consultant notes you enter in our sizing wizard are processed strictly inside your local browser sandbox.')}
            </p>
            <p>
              {t('We do not run backend databases that collect your telemetry, and we never transmit your private enterprise infrastructure details to external servers.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <Database className="w-5 h-5 mr-3 text-[#3fb950]" />
              {t('2. Local Storage Persistence')}
            </h2>
            <p>
              {t('To preserve your progress and allow high-fidelity PDF report generation, the wizard data and capacity calculations are stored securely in your web browser\'s localStorage.')}
            </p>
            <p>
              {t('This data stays on your machine and can be cleared at any time by wiping your browser cache or resetting your app preferences.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <Eye className="w-5 h-5 mr-3 text-[#d29922]" />
              {t('3. Third-Party Analytics & Cookies')}
            </h2>
            <p>
              {t('We do not employ aggressive ad trackers. We may use simple, privacy-friendly analytics cookies or storage keys solely to understand general application usage patterns (e.g. popular SKU lookups) and ensure high-availability routing for our open-source tools.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <Lock className="w-5 h-5 mr-3 text-[#f85149]" />
              {t('4. Policy Changes')}
            </h2>
            <p>
              {t('We reserve the right to update this policy as the Microsoft Fabric API surfaces and our open-source sizing toolkit evolve. Any changes will be posted immediately on this page with an updated timestamp.')}
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
