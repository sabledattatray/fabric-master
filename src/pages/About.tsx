import React from 'react';
import { Database, GitPullRequest, Code, Coffee, Github, Linkedin, MessageSquare } from 'lucide-react';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center w-full bg-[#0d1117] custom-scrollbar">
      <SEO 
        title={t('About Datta Sable - Creator of Fabric Master')} 
        description={t('Learn about Datta Sable, the Microsoft Fabric Engineer and Data Platform Architect behind the Fabric Master open-source toolkit.')}
        keywords="Datta Sable, Microsoft Fabric Engineer, Data Platform Architect, Fabric Master Creator, Open Source Developer"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20">
        
        <div className="mb-12 text-center">
          <img 
            src="/images/author.webp" 
            alt="Datta Sable" 
            className="w-32 h-32 rounded-full border-4 border-[#30363d] mx-auto mb-6 bg-[#161b22] object-cover shadow-xl"
          />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Datta Sable</h1>
          <p className="text-xl text-[#8b949e] font-light flex items-center justify-center space-x-3 flex-wrap gap-y-2">
             <span>Microsoft Fabric Engineer</span>
             <span className="w-1.5 h-1.5 bg-[#30363d] rounded-full hidden sm:block"></span>
             <span>Data Platform Architect</span>
             <span className="w-1.5 h-1.5 bg-[#30363d] rounded-full hidden sm:block"></span>
             <span>Open Source Developer</span>
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-16">
          <a href="https://dattasable.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#21262d] border border-[#30363d] rounded-md text-[#c9d1d9] hover:bg-[#30363d] hover:text-white transition-colors flex items-center font-medium text-sm">
             <Code className="w-4 h-4 mr-2" /> Website
          </a>
          <a href="https://github.com/sabledattatray" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#21262d] border border-[#30363d] rounded-md text-[#c9d1d9] hover:bg-[#30363d] hover:text-white transition-colors flex items-center font-medium text-sm">
             <Github className="w-4 h-4 mr-2" /> GitHub
          </a>
          <a href="https://linkedin.com/in/dattasable" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#2f81f7] text-white rounded-md hover:bg-[#1f6feb] transition-colors flex items-center font-medium text-sm">
             <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
          </a>
        </div>

        <div className="space-y-12 text-[#c9d1d9] text-lg leading-relaxed">
           <section>
             <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#30363d] pb-2 flex items-center">
               <Database className="w-6 h-6 mr-3 text-[#58a6ff]" /> My Mission
             </h2>
             <p className="mb-4">
               The transition to Microsoft Fabric is one of the most significant shifts in the data landscape. However, capacity planning and cost estimation remain complex challenges for many organizations.
             </p>
             <p>
               I built <strong>Fabric Master</strong> to democratize access to enterprise-grade capacity planning. My mission is to provide data teams with the predictive analytics and cost optimization tools they need to succeed on Microsoft's OneLake ecosystem—completely free and open source.
             </p>
           </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#30363d] pb-2 flex items-center">
                <Code className="w-6 h-6 mr-3 text-[#3fb950]" /> Experience & Architecture Guides
              </h2>
              <p className="mb-4">
                As a Data Platform Architect and Microsoft Fabric Engineer, I specialize in designing massive-scale data estates, optimizing compute performance (CUs), and leading migrations from legacy systems (like Azure Synapse) into the Fabric paradigm.
              </p>
              <p className="mb-6">
                My work focuses on ensuring high availability, strict cost governance, and unparalleled performance for analytical workloads.
              </p>

              {/* Contextual Links to dattasable.com Blog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <a 
                  href="https://dattasable.com/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#a371f7] transition-all group"
                >
                  <div className="font-semibold text-sm text-[#a371f7] flex items-center justify-between">
                    <span>DP-600 vs DP-700 vs DP-800 Guide</span>
                    <Code className="w-4 h-4 text-[#a371f7]" />
                  </div>
                  <div className="text-xs text-[#8b949e] mt-1.5">
                    Which Fabric certification is right for you? DP-600, DP-700 & DP-800 breakdown.
                  </div>
                </a>

                <a 
                  href="https://dattasable.com/blog/microsoft-fabric-architecture-explained-2026" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-all group"
                >
                  <div className="font-semibold text-sm text-[#58a6ff] flex items-center justify-between">
                    <span>Fabric Architecture Explained</span>
                    <Database className="w-4 h-4 text-[#58a6ff]" />
                  </div>
                  <div className="text-xs text-[#8b949e] mt-1.5">
                    Deep dive into OneLake, Medallion storage, Direct Lake & Capacity Units.
                  </div>
                </a>
              </div>
            </section>

           <section>
             <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#30363d] pb-2 flex items-center">
               <GitPullRequest className="w-6 h-6 mr-3 text-[#d29922]" /> Open Source Commitment
             </h2>
             <p className="mb-4">
               I believe in building in public. Fabric Master is proudly open-source under the MIT License. The community is welcome to audit the calculation models, suggest improvements, and contribute new features.
             </p>
             <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 mt-6">
                <h3 className="font-semibold text-white mb-2 flex items-center">
                  <Coffee className="w-5 h-5 mr-2 text-[#8b949e]" /> Support the project
                </h3>
                <p className="text-sm text-[#8b949e] mb-4">
                  If Fabric Master saved your team money or simplified your capacity planning, consider giving it a star on GitHub.
                </p>
                <a href="https://github.com/sabledattatray/fabric-master" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#58a6ff] hover:underline font-medium">
                  Star on GitHub &rarr;
                </a>
             </div>
           </section>
        </div>

      </main>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
