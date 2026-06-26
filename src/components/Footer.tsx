import React from 'react';
import { ThumbsUp, ThumbsDown, GitPullRequest, Users, MessageSquare, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#0d1117] border-t border-[#30363d] pt-12 pb-16 px-6 relative mt-auto print:hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-8 border-b border-[#30363d] pb-4">{t('Help and support')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Did you find what you needed? */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">{t('Did you find what you needed?')}</h3>
            <div className="flex space-x-3 mb-4">
              <button className="flex items-center px-4 py-1.5 rounded-md bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors text-sm font-medium text-[#c9d1d9]">
                <ThumbsUp className="w-4 h-4 mr-2" /> {t('Yes')}
              </button>
              <button className="flex items-center px-4 py-1.5 rounded-md bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors text-sm font-medium text-[#c9d1d9]">
                <ThumbsDown className="w-4 h-4 mr-2" /> {t('No')}
              </button>
            </div>
            <a href="#" className="text-sm text-[#58a6ff] hover:underline">{t('Privacy policy')}</a>
          </div>

          {/* Help us make these docs great! */}
          <div>
            <h3 className="text-base font-semibold text-white mb-2">{t('Help us make these docs great!')}</h3>
            <p className="text-sm text-[#8b949e] mb-4">
              {t('All Fabric Master docs are open source. See something that\'s wrong or unclear? Submit a pull request.')}
            </p>
            <button className="flex items-center px-4 py-1.5 rounded-md bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors text-sm font-medium text-[#c9d1d9] mb-4">
              <GitPullRequest className="w-4 h-4 mr-2" /> {t('Make a contribution')}
            </button>
            <a href="#" className="text-sm text-[#58a6ff] hover:underline">{t('Learn how to contribute')}</a>
          </div>

          {/* Still need help? */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">{t('Still need help?')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="flex items-center text-[#58a6ff] hover:underline">
                  <Users className="w-4 h-4 mr-2" /> {t('Ask the Fabric Master community')}
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-[#58a6ff] hover:underline">
                  <MessageSquare className="w-4 h-4 mr-2" /> {t('Contact support')}
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
              <a href="#" className="text-[#58a6ff] hover:underline">{t('Status')}</a>
              <a href="#" className="text-[#58a6ff] hover:underline">{t('Pricing')}</a>
              <a href="#" className="text-[#58a6ff] hover:underline">{t('Expert services')}</a>
              <a href="#" className="text-[#58a6ff] hover:underline">{t('Blog')}</a>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-1">{t('Built by')}</span>
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
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
}
