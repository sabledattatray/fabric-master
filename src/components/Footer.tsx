import React from 'react';
import { ThumbsUp, ThumbsDown, GitPullRequest, Users, MessageSquare, ChevronUp, Heart, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#0d1117] border-t border-[#30363d] pt-12 pb-16 px-6 relative mt-auto print:hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-8 border-b border-[#30363d] pb-4">{t('Resources & Support')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Did you find what you needed? */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">{t('Was this toolkit helpful?')}</h3>
            <div className="flex space-x-3 mb-4">
              <button className="flex items-center px-4 py-1.5 rounded-xl bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors text-sm font-medium text-[#c9d1d9]">
                <ThumbsUp className="w-4 h-4 mr-2" /> {t('Yes')}
              </button>
              <button className="flex items-center px-4 py-1.5 rounded-xl bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors text-sm font-medium text-[#c9d1d9]">
                <ThumbsDown className="w-4 h-4 mr-2" /> {t('No')}
              </button>
            </div>
            <Link to="/about" className="text-sm text-[#58a6ff] hover:underline">{t('About the Author')}</Link>
          </div>

          {/* Help us make these docs great! */}
          <div>
            <h3 className="text-base font-semibold text-white mb-2">{t('Open Source Project')}</h3>
            <p className="text-sm text-[#8b949e] mb-4">
              {t('Fabric Master is open source and community-driven. Have an improvement? Submit a pull request.')}
            </p>
            <a href="https://github.com/sabledattatray/fabric-master" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-1.5 rounded-xl bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors text-sm font-medium text-[#c9d1d9] mb-4">
              <GitPullRequest className="w-4 h-4 mr-2" /> {t('Contribute on GitHub')}
            </a>
            <br/>
            <Link to="/docs" className="text-sm text-[#58a6ff] hover:underline">{t('Microsoft Fabric Resources')}</Link>
          </div>

          {/* Still need help? */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">{t('Connect')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://github.com/sabledattatray/fabric-master" target="_blank" rel="noopener noreferrer" className="flex items-center text-[#58a6ff] hover:underline">
                  <Github className="w-4 h-4 mr-2" /> {t('Star on GitHub')}
                </a>
              </li>
              <li>
                <a href="https://dattasable.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-[#58a6ff] hover:underline">
                  <MessageSquare className="w-4 h-4 mr-2" /> {t('Contact Datta Sable')}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between text-xs text-[#8b949e] pt-8 border-t border-[#30363d]/50">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
            <span className="font-semibold">{t('Legal')}</span>
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
              <span>© {new Date().getFullYear()} Fabric Master</span>
              <a href="#" className="text-[#58a6ff] hover:underline">{t('Terms')}</a>
              <a href="#" className="text-[#58a6ff] hover:underline">{t('Privacy')}</a>
              <Link to="/docs" className="text-[#58a6ff] hover:underline">{t('Documentation')}</Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-1 flex items-center">{t('Built with')} <Heart className="w-3 h-3 mx-1 text-red-500 fill-current" /> {t('by')}</span>
            <a 
              href="https://dattasable.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#c9d1d9] font-medium hover:text-[#58a6ff] transition-colors"
            >
              Datta Sable
            </a>
          </div>
        </div>
        
        <button 
          className="absolute right-6 bottom-6 p-2 rounded-full bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d] transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
}
