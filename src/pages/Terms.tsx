import React from 'react';
import { Shield, FileText, Scale, HelpCircle } from 'lucide-react';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function Terms() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center w-full bg-[#0d1117] custom-scrollbar">
      <SEO 
        title={t('Terms of Service - Fabric Master')} 
        description={t('Terms of Service and legal agreements for using the Fabric Master capacity planning and sizing report tools.')}
        keywords="Terms of Service, Terms and Conditions, Legal, Fabric Master, Capacity Planner Sizing"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20">
        
        <div className="mb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#238636]/10 text-[#3fb950] flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{t('Terms of Service')}</h1>
          <p className="text-lg text-[#8b949e]">
            {t('Last updated: June 2026')}
          </p>
        </div>

        <div className="space-y-12 text-[#c9d1d9] text-base md:text-lg leading-relaxed">
          <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-[#58a6ff]" />
              {t('1. Acceptance of Terms')}
            </h2>
            <p className="mb-4">
              {t('By accessing and using Fabric Master (located at fabric.dattasable.com), you acknowledge and agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our tools and calculations.')}
            </p>
            <p>
              {t('These terms apply to all visitors, users, and others who access or use the application.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <FileText className="w-5 h-5 mr-3 text-[#3fb950]" />
              {t('2. Use License & Tool Intent')}
            </h2>
            <p>
              {t('Fabric Master is an open-source, community-driven capacity assessment tool. The outputs, including SKU recommendations, Capacity Unit (CU) calculations, and financial forecasts, are provided purely as estimations.')}
            </p>
            <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl text-sm font-mono text-[#8b949e] border-l-4 border-[#3fb950]">
              <span className="text-[#3fb950] font-semibold block mb-1">{t('IMPORTANT DISCLAIMER')}:</span>
              {t('Actual Microsoft Fabric performance and billing charges may vary significantly depending on execution timing, resource consumption peaks, OneLake integration overhead, and custom workspace arrangements. Users should perform native proof-of-concept (PoC) tests in Azure before making final budget commitments.')}
            </div>
            <p>
              {t('Permission is granted to generate, download, and distribute the custom PDF reports for internal architectural evaluation and executive presentations.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <Scale className="w-5 h-5 mr-3 text-[#d29922]" />
              {t('3. Disclaimer of Liability')}
            </h2>
            <p>
              {t('The materials, calculators, and reports on Fabric Master are provided on an "as is" and "as available" basis. Fabric Master makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.')}
            </p>
            <p>
              {t('In no event shall Fabric Master or its creator, Datta Sable, be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the capacity assessments, even if advised of the possibility of such damage.')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center">
              <HelpCircle className="w-5 h-5 mr-3 text-[#f85149]" />
              {t('4. Open Source Contributions')}
            </h2>
            <p>
              {t('Fabric Master is proudly open-source and governed by the MIT License. Contributions, code commits, and bug reporting on GitHub are highly encouraged. When contributing, you grant the project a non-exclusive license to use and distribute your contributions.')}
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
