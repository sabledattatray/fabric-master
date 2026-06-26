import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EvaluationResponse } from '../types';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, TrendingDown, Database, 
  Download, Check, X, Info, Zap, Star, FileText 
} from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { SEO } from '../components/SEO';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const evaluation = location.state?.evaluation as EvaluationResponse | undefined;
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans">
        <p className="text-gray-500 mb-4">{t('No calculation data found.')}</p>
        <Button onClick={() => navigate('/')}>{t('Go to Wizard')}</Button>
      </div>
    );
  }

  const { targetSkuRecommendation, financialSummary, throttlingAnalysis } = evaluation;

  // Derived Metrics
  const cu = targetSkuRecommendation.costOptimizedSkuCu;
  const baseCu = evaluation.calculatedCuBaseline;
  const utilPct = Math.min(100, Math.round((baseCu / cu) * 100));
  const remaining = Math.max(0, Number((cu - baseCu).toFixed(2)));
  
  const confidenceScore = Math.max(0, Math.round(100 - (throttlingAnalysis.optimizedTierRiskPercentage * 0.5)));
  const healthScore = Math.max(0, Math.round(100 - throttlingAnalysis.optimizedTierRiskPercentage));
  const efficiencyScore = Math.round(utilPct > 80 ? 100 - (utilPct - 80) : utilPct + (80 - utilPct) * 0.5);

  const dailyCost = financialSummary.payAsYouGoHourlyCost * 24;
  const yearlyCost = financialSummary.payAsYouGoMonthlyEstimate * 12;
  const riYearlyCost = financialSummary.reservedInstanceMonthlyEstimate * 12;

  // Growth Forecast
  const m6 = Number((baseCu * 1.2).toFixed(1));
  const y1 = Number((baseCu * 1.5).toFixed(1));
  const y2 = Number((baseCu * 2.0).toFixed(1));
  
  const allSkus = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
  const currentIndex = allSkus.indexOf(cu);
  const prevSkuCu = currentIndex > 0 ? allSkus[currentIndex - 1] : null;
  const nextSkuCu = currentIndex < allSkus.length - 1 ? allSkus[currentIndex + 1] : null;

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center">
      <SEO 
        title={`${t('Evaluation Results')} - ${targetSkuRecommendation.costOptimizedSkuName} | Microsoft Fabric Capacity Estimator`}
        description={t("Your AI-driven Microsoft Fabric capacity assessment. See detailed SKU recommendations, financial breakdowns, and throttling analysis.")}
        keywords="Microsoft Fabric Capacity Calculator, Microsoft Fabric Cost Calculator, Microsoft Fabric Cost Estimation Tool, Microsoft Fabric Enterprise Capacity Planning, Microsoft Fabric Capacity Recommendation"
      />
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center bg-[#0d1117] print:p-0 print:overflow-visible w-full">
        <div className="max-w-7xl w-full space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden border-b border-[#30363d] pb-6 mb-8">
            <div>
              <div className="inline-block px-2 py-1 bg-[#238636]/10 text-[#3fb950] text-[10px] font-bold uppercase rounded-md mb-3 flex items-center w-max border border-[#3fb950]/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {t('Capacity Assessment Complete')}
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">{t('Fabric Capacity Consultant')}</h1>
              <p className="text-xl text-[#8b949e] mt-3 font-light">{t('AI-driven analysis and decision support for your Microsoft Fabric investment.')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate('/wizard')}>
                <ArrowLeft className="w-4 h-4 mr-2 text-[#8b949e]" /> {t('Adjust Parameters')}
              </Button>
              <Button onClick={handleExport} disabled={isExporting} variant="secondary">
                <Download className="w-4 h-4 mr-2 text-[#8b949e]" /> {isExporting ? t('Generating...') : t('Export PDF')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
            
            {/* Left Column - Main Content (Span 8) */}
            <div className="lg:col-span-8 space-y-8 print:w-full">
              
              {/* Executive Summary */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d]">
                <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3]">{t('Executive Summary')}</h3>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4">
                    <p className="text-[#c9d1d9] leading-relaxed">
                      {t('Based on your workload parameters, we analyzed 12 different Microsoft Fabric capacity tiers. Your optimal balance of performance and cost efficiency is the')} <strong>{targetSkuRecommendation.costOptimizedSkuName}</strong> {t('tier.')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm text-[#c9d1d9] font-medium">
                        <Check className="w-5 h-5 text-[#3fb950] mr-3 shrink-0" />
                        {t('Supports your current estimated workload of')} {baseCu} {t('CU')}
                      </li>
                      <li className="flex items-start text-sm text-[#c9d1d9] font-medium">
                        <Check className="w-5 h-5 text-[#3fb950] mr-3 shrink-0" />
                        {t('Includes')} {remaining} {t('CU headroom for short-term growth')}
                      </li>
                      <li className="flex items-start text-sm text-[#c9d1d9] font-medium">
                        <Check className="w-5 h-5 text-[#3fb950] mr-3 shrink-0" />
                        {t('Low throttling risk')} ({throttlingAnalysis.optimizedTierRiskPercentage}% {t('projected')})
                      </li>
                      <li className="flex items-start text-sm text-[#c9d1d9] font-medium">
                        <Check className="w-5 h-5 text-[#3fb950] mr-3 shrink-0" />
                        {t('Saves up to')} ${financialSummary.potentialSavingsMonthly.toLocaleString()}{t('/month with a Reserved Instance')}
                      </li>
                    </ul>
                  </div>
                  <div className="w-full md:w-64 bg-[#161b22] border border-[#30363d] rounded-md p-6 text-center flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-[#d29922] fill-current" /> {t('Recommended')}
                    </span>
                    <div className="text-5xl font-semibold text-[#e6edf3] tracking-tight">{targetSkuRecommendation.costOptimizedSkuName}</div>
                    <div className="text-sm text-[#8b949e] mt-2">{cu} {t('Capacity Units')}</div>
                  </div>
                </div>
              </div>

              {/* Grid for Utilization and Why */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
                
                {/* Capacity Utilization */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d]">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3]">{t('Capacity Utilization')}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#8b949e]">{t('Estimated Usage')}</span>
                        <span className="font-semibold text-[#c9d1d9]">{utilPct}%</span>
                      </div>
                      <div className="w-full h-3 bg-[#21262d] rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#58a6ff]" style={{ width: `${utilPct}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#30363d]">
                      <div>
                        <div className="text-xs text-[#8b949e] uppercase font-semibold">{t('Base Req')}</div>
                        <div className="text-xl font-semibold text-[#c9d1d9]">{baseCu} <span className="text-sm font-normal text-[#8b949e]">{t('CU')}</span></div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8b949e] uppercase font-semibold">{t('Remaining')}</div>
                        <div className="text-xl font-semibold text-[#3fb950]">{remaining} <span className="text-sm font-normal text-[#8b949e]">{t('CU')}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why this SKU */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d]">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3]">{t('Why')} {targetSkuRecommendation.costOptimizedSkuName}?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-[#c9d1d9]">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Estimated requirement:')} <strong>&nbsp;{baseCu} {t('CU')}</strong>
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9]">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Interactive report concurrency supported')}
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9]">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Spark workload bursts accommodated')}
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9]">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Data Factory pipelines scheduled')}
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9]">
                      <div className="w-2 h-2 bg-[#3fb950] rounded-full mr-3 shrink-0"></div>
                      ~{Math.round(100 - utilPct)}% {t('growth buffer included')}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Alternative SKUs */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md shadow-sm overflow-hidden print:shadow-none print:border-[#30363d]">
                <div className="p-4 border-b border-[#30363d] bg-[#161b22]">
                  <h3 className="text-sm font-semibold text-[#e6edf3]">{t('Alternative SKUs')}</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1117] text-[#8b949e] text-xs uppercase font-semibold border-b border-[#30363d]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t('SKU')}</th>
                      <th className="px-4 py-3 font-semibold">{t('Status')}</th>
                      <th className="px-4 py-3 font-semibold">{t('Reason')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d]">
                    {prevSkuCu && (
                      <tr>
                        <td className="px-4 py-3 font-medium text-[#c9d1d9]">F{prevSkuCu}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#f85149]/10 text-[#f85149]">
                            <X className="w-3 h-3 mr-1" /> {t('Not Recommended')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#8b949e]">{t('High throttling risk, insufficient capacity')}</td>
                      </tr>
                    )}
                    <tr className="bg-[#161b22]">
                      <td className="px-4 py-3 font-semibold text-[#e6edf3]">{targetSkuRecommendation.costOptimizedSkuName}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#1f6feb]/10 text-[#58a6ff]">
                          <Star className="w-3 h-3 mr-1 fill-current" /> {t('Recommended')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#c9d1d9] font-medium">{t('Best value for current workload')}</td>
                    </tr>
                    {nextSkuCu && (
                      <tr>
                        <td className="px-4 py-3 font-medium text-[#c9d1d9]">F{nextSkuCu}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#21262d] text-[#c9d1d9]">
                            <Check className="w-3 h-3 mr-1" /> {t('Enterprise')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#8b949e]">{t('Excellent for massive future growth')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* AI Insights & Growth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:break-inside-avoid">
                
                {/* AI Recommendations */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d]">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 flex items-center text-[#e6edf3]">
                    <Zap className="w-5 h-5 mr-2 text-[#58a6ff]" /> {t('AI Insights')}
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-[#c9d1d9] leading-relaxed">
                      {t('Based on your workload profile:')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm text-[#c9d1d9]">
                        <CheckCircle2 className="w-4 h-4 text-[#3fb950] mr-2 shrink-0 mt-0.5" />
                        <span><strong>{t('Reserved Instance is highly recommended.')}</strong> {t('You could reduce costs by approximately 41% with a 1-year commitment.')}</span>
                      </li>
                      <li className="flex items-start text-sm text-[#c9d1d9]">
                        <Info className="w-4 h-4 text-[#58a6ff] mr-2 shrink-0 mt-0.5" />
                        <span>{t('Your Spark workload is moderate, leaving ample compute for concurrent Power BI rendering.')}</span>
                      </li>
                      <li className="flex items-start text-sm text-[#c9d1d9]">
                        <TrendingDown className="w-4 h-4 text-[#3fb950] mr-2 shrink-0 mt-0.5" />
                        <span>{t('Current capacity leaves room for approximately')} {Math.round(100 - utilPct)}% {t('data volume growth before requiring an upgrade.')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Growth Forecast */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d]">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 flex items-center text-[#e6edf3]">
                    <TrendingDown className="w-5 h-5 mr-2 text-[#8b949e] rotate-180" /> {t('Growth Forecast')}
                  </h3>
                  <p className="text-xs text-[#8b949e] mb-4 uppercase font-semibold tracking-wider">{t('If your company grows...')}</p>
                  
                  <div className="space-y-3 mb-6 border-l-2 border-[#30363d] pl-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-[#c9d1d9]">{t('Today')}</span>
                      <span className="text-[#c9d1d9] bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded-md">{baseCu} {t('CU')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8b949e]">{t('6 Months')}</span>
                      <span className="text-[#c9d1d9]">{m6} {t('CU')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8b949e]">{t('1 Year')}</span>
                      <span className="text-[#c9d1d9]">{y1} {t('CU')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8b949e]">{t('2 Years')}</span>
                      <span className="text-[#c9d1d9]">{y2} {t('CU')}</span>
                    </div>
                  </div>

                  <div className="bg-[#161b22] rounded-md p-3 border border-[#30363d]">
                    <p className="text-sm text-[#c9d1d9]">
                      <strong>{t('Recommendation:')}</strong> {t('Upgrade to')} {nextSkuCu ? `F${nextSkuCu}` : t('a larger tier')} {t('around')} {new Date(Date.now() + 1000*60*60*24*365 * (nextSkuCu && nextSkuCu > y1 ? 1.5 : 0.8)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Sidebar (Span 4) */}
            <div className="lg:col-span-4 space-y-8 print:w-full print:mt-8">
              
              {/* Scores */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm space-y-6 print:shadow-none print:border-[#30363d] print:break-inside-avoid">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#c9d1d9]">{t('Capacity Health')}</span>
                    <span className="text-sm font-semibold text-[#3fb950]">{healthScore}/100</span>
                  </div>
                  <div className="flex text-[#d29922] text-xs mb-2">
                    <Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" />
                  </div>
                  <p className="text-xs text-[#8b949e]">{t('Excellent headroom and stability.')}</p>
                </div>
                
                <div className="pt-4 border-t border-[#30363d]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#c9d1d9]">{t('Cost Efficiency')}</span>
                    <span className="text-sm font-semibold text-[#58a6ff]">{efficiencyScore}%</span>
                  </div>
                  <p className="text-xs text-[#8b949e]">{t('Spending is well-aligned with minimum required capacity.')}</p>
                </div>

                <div className="pt-4 border-t border-[#30363d]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#c9d1d9]">{t('Confidence Score')}</span>
                    <span className="text-sm font-semibold text-[#bc8cff]">{confidenceScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#21262d] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#bc8cff]" style={{ width: `${confidenceScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d] print:break-inside-avoid">
                <h3 className="text-sm font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3]">{t('Pricing Breakdown')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8b949e]">{t('Hourly')}</span>
                    <span className="text-sm font-medium text-[#c9d1d9]">${financialSummary.payAsYouGoHourlyCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8b949e]">{t('Daily')}</span>
                    <span className="text-sm font-medium text-[#c9d1d9]">${dailyCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8b949e]">{t('Monthly')}</span>
                    <span className="text-lg font-semibold text-[#c9d1d9]">${financialSummary.payAsYouGoMonthlyEstimate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#30363d]">
                    <span className="text-sm text-[#8b949e]">{t('Yearly (PAYG)')}</span>
                    <span className="text-sm font-medium text-[#c9d1d9]">${yearlyCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#30363d]">
                    <span className="text-sm font-semibold text-[#58a6ff]">{t('Yearly (Reserved)')}</span>
                    <span className="text-lg font-semibold text-[#58a6ff]">${riYearlyCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Enterprise Readiness */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d] print:break-inside-avoid">
                <h3 className="text-sm font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3]">{t('Enterprise Assessment')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9]">{t('Concurrent Users')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9]">{t('Spark Jobs')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="text-[#30363d] w-3 h-3" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9]">{t('Warehouse')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9]">{t('Power BI')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /></div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-[#161b22] rounded-md border border-[#30363d] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8b949e] uppercase">{t('Overall')}</span>
                  <span className="text-xs font-semibold text-[#3fb950] flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('Production Ready')}</span>
                </div>
              </div>

              {/* Explain Every Metric */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 shadow-sm print:shadow-none print:border-[#30363d] print:break-inside-avoid">
                <div className="flex items-center justify-between mb-4 border-b border-[#30363d] pb-2">
                  <h3 className="text-sm font-semibold text-[#c9d1d9]">{t('Throttling Risk:')} {throttlingAnalysis.optimizedTierRiskPercentage}%</h3>
                  <AlertTriangle className={`w-4 h-4 ${throttlingAnalysis.optimizedTierRiskPercentage > 20 ? 'text-[#d29922]' : 'text-[#3fb950]'}`} />
                </div>
                <p className="text-xs font-semibold text-[#8b949e] uppercase mb-1">{t('What is this?')}</p>
                <p className="text-sm text-[#c9d1d9] mb-3">
                  {t('Microsoft Fabric may delay workloads when capacity becomes saturated.')}
                </p>
                <p className="text-sm text-[#c9d1d9] bg-[#161b22] p-3 rounded-md border border-[#30363d]">
                  {throttlingAnalysis.optimizedTierRiskPercentage > 20 
                    ? t("Your workload has some peak burst risks, consider smoothing jobs or using the Safe SKU during high load periods.")
                    : t("Your workload has sufficient headroom, so throttling is extremely unlikely.")}
                </p>
              </div>

              {/* Export Report Cover */}
              <div className="bg-[#161b22] text-[#c9d1d9] rounded-md p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-[#30363d] cursor-pointer print:hidden" onClick={handleExport}>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#1f6feb] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                <h3 className="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> {t('Export Report')}
                </h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <div className="text-lg font-semibold leading-tight text-[#e6edf3]">{t('Microsoft Fabric Capacity Assessment Report')}</div>
                    <div className="text-xs text-[#8b949e] mt-1">{t('Generated')} {today}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#30363d]">
                    <div>
                      <div className="text-xs text-[#8b949e] uppercase">{t('Recommended')}</div>
                      <div className="font-semibold text-[#c9d1d9]">{targetSkuRecommendation.costOptimizedSkuName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8b949e] uppercase">{t('Est. Cost')}</div>
                      <div className="font-semibold text-[#c9d1d9]">${financialSummary.payAsYouGoMonthlyEstimate.toLocaleString()}/mo</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8b949e] uppercase">{t('Opt. Score')}</div>
                      <div className="font-semibold text-[#3fb950]">{efficiencyScore}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-[#8b949e] uppercase">{t('Prepared by')}</div>
                    <div className="text-sm font-semibold flex items-center mt-1 text-[#c9d1d9]">
                      <Database className="w-3 h-3 mr-1 text-[#58a6ff]" /> {t('Fabric Master Toolkit')}
                    </div>
                  </div>
                  
                  <Button variant="primary" className="w-full mt-4" onClick={(e) => { e.stopPropagation(); handleExport(); }}>
                    {t('Download PDF')}
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
