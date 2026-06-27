import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EvaluationResponse } from '../types';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, TrendingDown, Database, 
  Download, Check, X, Info, Zap, Star, FileText, Link as LinkIcon, Linkedin, Twitter,
  BarChart as BarChartIcon
} from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { SEO } from '../components/SEO';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Legend, PieChart, Pie } from 'recharts';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try state first, then fallback to localStorage
  const evaluation = (location.state?.evaluation || (() => {
    try {
      const saved = localStorage.getItem('fabric_master_last_evaluation');
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  })()) as EvaluationResponse | undefined;

  const inputData = (location.state?.inputData || (() => {
    try {
      const saved = localStorage.getItem('fabric_master_last_input_data');
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  })()) as any;

  const [isExporting, setIsExporting] = useState(false);
  const [showIframeModal, setShowIframeModal] = useState(false);
  const [reportDetails, setReportDetails] = useState({
    companyName: '',
    projectName: '',
    environment: '',
    consultantName: ''
  });
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
  const nextSkuName = nextSkuCu ? `F${nextSkuCu}` : 'a higher tier';

  // Estimate Upgrade Date
  let upgradeDate = "";
  if (m6 > cu) {
    const d = new Date(); d.setMonth(d.getMonth() + 6);
    upgradeDate = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } else if (y1 > cu) {
    const d = new Date(); d.setFullYear(d.getFullYear() + 1);
    upgradeDate = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } else if (y2 > cu) {
    const d = new Date(); d.setFullYear(d.getFullYear() + 2);
    upgradeDate = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } else {
    upgradeDate = "beyond 2 years";
  }

  const existingCu = inputData?.currentSkuCu as number | null | undefined;
  const existingSkuName = existingCu ? `F${existingCu}` : null;
  
  const riAnnualSavings = financialSummary.potentialSavingsMonthly * 12;

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const costComparisonData = [
    { name: 'PAYG', cost: financialSummary.payAsYouGoMonthlyEstimate, fill: '#8b949e' },
    { name: 'Reserved', cost: financialSummary.reservedInstanceMonthlyEstimate, fill: '#3fb950' }
  ];

  const growthData = [
    { name: 'Today', CU: baseCu },
    { name: '6 Months', CU: m6 },
    { name: '1 Year', CU: y1 },
    { name: '2 Years', CU: y2 },
  ];

  const handleExport = () => {
    const isIframe = typeof window !== 'undefined' && window.self !== window.top;
    
    if (isIframe) {
      setShowIframeModal(true);
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error("Print operation failed:", err);
        alert(t("Failed to open print dialog. Please make sure popups/modals are allowed or open the app in a new tab."));
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center print:h-auto print:min-h-0 print:overflow-visible">
      <SEO 
        title={`${t('Evaluation Results')} - ${targetSkuRecommendation.costOptimizedSkuName} | Microsoft Fabric Capacity Estimator`}
        description={t("Your AI-driven Microsoft Fabric capacity assessment. See detailed SKU recommendations, financial breakdowns, and throttling analysis.")}
        keywords="Microsoft Fabric Capacity Calculator, Microsoft Fabric Cost Calculator, Microsoft Fabric Cost Estimation Tool, Microsoft Fabric Enterprise Capacity Planning, Microsoft Fabric Capacity Recommendation"
      />
      <style>
        {`
          .print-header {
            display: none !important;
          }
          .print-footer {
            display: none !important;
          }
          .print-watermark {
            display: none !important;
          }
          @media print {
            @page {
              margin: 20mm 15mm 20mm 15mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: #ffffff !important;
              color: #111827 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            
            #root, html, body, .flex-1, .overflow-y-auto {
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #111827 !important;
            }

            .bg-\[\#0d1117\], .bg-\[\#161b22\], .bg-black, .bg-\[\#11161d\], .print-bg-light {
              background: #f8fafc !important;
              background-color: #f8fafc !important;
              border-color: #e2e8f0 !important;
              color: #374151 !important;
              box-shadow: none !important;
            }

            div.bg-\[\#0d1117\], div.bg-\[\#161b22\] {
              background-color: #ffffff !important;
              border: 1px solid #e2e8f0 !important;
              color: #374151 !important;
            }

            .border, .border-t, .border-b, .border-r, .border-l, 
            .border-\[\#30363d\], .divide-\[\#30363d\], .border-b-\[\#30363d\], .border-t-\[\#30363d\] {
              border-color: #e2e8f0 !important;
            }

            h1, h2, h3, h4, h5, h6, strong, b {
              color: #111827 !important;
              font-weight: 700 !important;
            }

            .text-white, .text-\[\#e6edf3\], .text-\[\#c9d1d9\], .text-\[\#f0f6fc\], .text-gray-100, .text-gray-200 {
              color: #1f2937 !important;
            }

            .text-\[\#8b949e\], .text-gray-400 {
              color: #4b5563 !important;
            }

            .text-\[\#58a6ff\], .text-blue-400, .text-blue-500 {
              color: #2563eb !important;
              font-weight: 600 !important;
            }

            .text-\[\#3fb950\], .text-green-500, .text-green-400 {
              color: #10b981 !important;
              font-weight: 600 !important;
            }

            .text-\[\#da3633\], .text-red-500, .text-red-400 {
              color: #ef4444 !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 1rem !important;
              margin-bottom: 1rem !important;
            }

            th, thead tr {
              background-color: #f1f5f9 !important;
              background: #f1f5f9 !important;
              color: #0f172a !important;
              font-weight: 600 !important;
              border-bottom: 2px solid #cbd5e1 !important;
            }

            td {
              border-bottom: 1px solid #e2e8f0 !important;
              color: #334155 !important;
            }

            .break-inside-avoid, .print\:break-inside-avoid, .grid, blockquote, pre, table, tr {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            .break-after-page, .break-before-page {
              page-break-after: always !important;
              break-after: page !important;
            }

            .print-header {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              font-size: 9px !important;
              font-weight: 500 !important;
              color: #64748b !important;
              border-bottom: 1px solid #e2e8f0 !important;
              padding-bottom: 4px !important;
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              z-index: 9999 !important;
            }
            .print-footer {
              position: fixed !important;
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              font-size: 9px !important;
              font-weight: 500 !important;
              color: #64748b !important;
              border-top: 1px solid #e2e8f0 !important;
              padding-top: 4px !important;
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              z-index: 9999 !important;
            }

            .print-watermark {
              position: fixed !important;
              top: 50% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) rotate(-45deg) !important;
              font-size: 7.5rem !important;
              font-weight: 800 !important;
              color: rgba(37, 99, 235, 0.035) !important;
              z-index: -1000 !important;
              pointer-events: none !important;
              white-space: nowrap !important;
              display: block !important;
              letter-spacing: 0.1em !important;
            }
          }
        `}
      </style>
      
      <div className="hidden print:block print-watermark">
        FABRIC MASTER
      </div>

      <div className="hidden print:flex print-header">
        <span>{t('Fabric Master | Microsoft Fabric Capacity Sizing Report')}</span>
        <span>{reportDetails.companyName ? `${reportDetails.companyName}` : ''}</span>
      </div>
      <div className="hidden print:flex print-footer">
        <span>fabric.dattasable.com | Prepared by {reportDetails.consultantName || 'Fabric Master'}</span>
        <span>{t('Confidential Executive Report')}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center bg-[#0d1117] print:p-0 print:overflow-visible print:bg-white w-full">
        <div className="max-w-7xl w-full space-y-8">
          
          {/* Cover Page for Print */}
          <div className="hidden print:flex flex-col justify-between h-[95vh] break-after-page w-full p-16 text-left relative print-text-dark border-l-[16px] border-[#2563EB] bg-white">
            <div>
              <p className="text-sm font-semibold tracking-widest text-[#2563EB] uppercase mb-4">Fabric Master Executive Report</p>
              <h1 className="text-5xl font-display font-extrabold text-[#111827] leading-tight mb-4">
                Microsoft Fabric<br/>Capacity Assessment
              </h1>
              <p className="text-lg text-[#4b5563] max-w-2xl font-light">
                Enterprise sizing recommendation, architectural alignment, and long-term financial projection for Power BI, Synapse Real-Time Analytics, and Data Engineering workloads.
              </p>
            </div>
            
            <div className="space-y-8 my-auto">
              {reportDetails.companyName && (
                <div className="border-l-2 border-[#2563EB] pl-4">
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1 font-semibold">{t('Prepared for')}</p>
                  <p className="text-3xl font-bold text-[#111827]">{reportDetails.companyName}</p>
                  {reportDetails.projectName && <p className="text-lg text-[#4b5563] mt-1">{reportDetails.projectName}</p>}
                  {reportDetails.environment && <p className="text-md text-[#4b5563] font-medium mt-0.5">{reportDetails.environment} {t('Environment')}</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 border-t border-[#e2e8f0] pt-8">
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1 font-semibold">{t('Prepared by')}</p>
                  <p className="text-lg font-bold text-[#111827]">{reportDetails.consultantName || 'Fabric Master'}</p>
                  <p className="text-xs text-[#6b7280]">fabric.dattasable.com</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1 font-semibold">{t('Assessment Date')}</p>
                  <p className="text-lg font-bold text-[#111827]">{today}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-6 text-xs text-[#9ca3af]">
              <span>Created by Datta Sable</span>
              <span className="text-[#2563EB] font-medium">https://fabric.dattasable.com</span>
            </div>
          </div>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden border-b border-[#30363d] pb-6 mb-8">
            <div>
              <div className="inline-flex items-center whitespace-nowrap px-2 py-1 bg-[#238636]/10 text-[#3fb950] text-[10px] font-bold uppercase rounded-md mb-3 border border-[#3fb950]/20">
                <CheckCircle2 className="w-3 h-3 mr-1 flex-shrink-0" /> {t('Capacity Assessment Complete')}
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">{t('Fabric Capacity Consultant')}</h1>
              <p className="text-xl text-[#8b949e] mt-3 font-light">{t('AI-driven analysis and decision support for your Microsoft Fabric investment.')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={async () => {
                const encodedData = btoa(JSON.stringify(inputData));
                const url = `${window.location.origin}/report?data=${encodedData}`;
                try {
                  await navigator.clipboard.writeText(url);
                  alert(t('Share link copied to clipboard!'));
                } catch (err) {
                  prompt(t('Copy this link to share:'), url);
                }
              }}>
                <LinkIcon className="w-4 h-4 mr-2 text-[#8b949e]" /> {t('Share')}
              </Button>
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
              
              {/* Board Recommendation */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border print:bg-light">
                <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3] print-text-dark print-border">{t('Board Recommendation')}</h3>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4">
                    <p className="text-[#c9d1d9] print-text-dark leading-relaxed">
                      {t('Based on projected workload growth over the next two years, Microsoft Fabric')} <strong>{targetSkuRecommendation.costOptimizedSkuName}</strong> {t('provides the optimal balance between performance, scalability, and operational cost.')}
                    </p>
                    <p className="text-[#c9d1d9] print-text-dark leading-relaxed">
                      {t('An upgrade to')} <strong>{nextSkuName}</strong> {t('is projected around')} <strong>{upgradeDate}</strong>.
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#30363d] print-border">
                      <p className="text-sm text-[#8b949e] uppercase font-semibold mb-1">{t('Estimated annual savings with Reserved Capacity')}:</p>
                      <p className="text-2xl font-bold font-mono text-[#3fb950]">${riAnnualSavings.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-64 bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-center flex flex-col items-center justify-center shrink-0 print:border-2 print-border">
                    <span className="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-[#d29922] fill-current" /> {t('Recommended')}
                    </span>
                    <div className="text-5xl font-bold font-mono text-[#e6edf3] print-text-dark tracking-tight">{targetSkuRecommendation.costOptimizedSkuName}</div>
                    <div className="text-sm font-mono text-[#8b949e] mt-2">{cu} <span className="font-sans">{t('Capacity Units')}</span></div>
                  </div>
                </div>
              </div>

              {/* Compare Existing Capacity */}
              {existingCu && (
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3] print-text-dark print-border">{t('Compare Existing Capacity')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col items-center justify-center">
                      <span className="text-xs text-[#8b949e] uppercase tracking-wider mb-1">{t('Current')}</span>
                      <span className="text-3xl font-bold font-mono text-[#e6edf3]">{existingSkuName}</span>
                    </div>
                    <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-xl p-4 flex flex-col items-center justify-center">
                      <span className="text-xs text-[#3fb950] uppercase tracking-wider mb-1 font-semibold">{t('Recommended')}</span>
                      <span className="text-3xl font-bold font-mono text-[#e6edf3]">{targetSkuRecommendation.costOptimizedSkuName}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#c9d1d9] mb-1">{t('Performance Improvement')}</h4>
                      <p className="text-sm text-[#8b949e] leading-relaxed">
                        {cu > existingCu 
                          ? `${t('Upgrading to')} ${targetSkuRecommendation.costOptimizedSkuName} ${t('provides')} ${((cu / existingCu) * 100 - 100).toFixed(0)}% ${t('more compute power, eliminating current bottleneck risks.')}`
                          : cu < existingCu 
                          ? `${t('Downsizing to')} ${targetSkuRecommendation.costOptimizedSkuName} ${t('will maintain required performance while reducing excess capacity by')} ${((existingCu - cu) / existingCu * 100).toFixed(0)}%.`
                          : t('Your current capacity perfectly matches our recommendation.')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#c9d1d9] mb-1">{t('Migration Notes')}</h4>
                      <p className="text-sm text-[#8b949e] leading-relaxed">
                        {cu !== existingCu 
                          ? t('Capacity scaling in Microsoft Fabric is seamless and requires no data migration or downtime. You can adjust your SKU directly from the Azure Portal.')
                          : t('No migration required.')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#c9d1d9] mb-1">{t('Upgrade Timeline')}</h4>
                      <p className="text-sm text-[#8b949e] leading-relaxed">
                        {cu > existingCu 
                          ? t('Immediate upgrade recommended to mitigate throttling risks.')
                          : cu < existingCu 
                          ? t('Immediate downscale recommended to optimize costs.')
                          : `${t('Maintain current capacity until')} ${upgradeDate}.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid for Utilization and Why */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
                
                {/* Capacity Utilization */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3] print-text-dark print-border">{t('Capacity Utilization')}</h3>
                  
                  <div className="space-y-2">
                    <div className="h-32 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Used', value: utilPct, fill: '#58a6ff' },
                              { name: 'Remaining', value: 100 - utilPct, fill: '#21262d' }
                            ]}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute bottom-0 left-0 w-full text-center flex flex-col items-center">
                        <span className="text-2xl font-bold text-[#c9d1d9] print-text-dark">{utilPct}%</span>
                        <span className="text-xs text-[#8b949e]">{t('Usage')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#30363d] print-border mt-6">
                      <div>
                        <div className="text-xs text-[#8b949e] uppercase font-semibold">{t('Base Req')}</div>
                        <div className="text-xl font-semibold text-[#c9d1d9] print-text-dark">{baseCu} <span className="text-sm font-normal text-[#8b949e]">{t('CU')}</span></div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8b949e] uppercase font-semibold">{t('Remaining')}</div>
                        <div className="text-xl font-semibold text-[#3fb950]">{remaining} <span className="text-sm font-normal text-[#8b949e]">{t('CU')}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why this SKU */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3] print-text-dark print-border">{t('Why')} {targetSkuRecommendation.costOptimizedSkuName}?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-[#c9d1d9] print-text-dark">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Estimated requirement:')} <strong>&nbsp;{baseCu} {t('CU')}</strong>
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9] print-text-dark">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Interactive report concurrency supported')}
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9] print-text-dark">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Spark workload bursts accommodated')}
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9] print-text-dark">
                      <div className="w-2 h-2 bg-[#58a6ff] rounded-full mr-3 shrink-0"></div>
                      {t('Data Factory pipelines scheduled')}
                    </li>
                    <li className="flex items-center text-sm text-[#c9d1d9] print-text-dark">
                      <div className="w-2 h-2 bg-[#3fb950] rounded-full mr-3 shrink-0"></div>
                      ~{Math.round(100 - utilPct)}% {t('growth buffer included')}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Alternative SKUs */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-sm overflow-hidden print:shadow-none print:border print-border">
                <div className="p-4 border-b border-[#30363d] print-border bg-[#161b22] print:bg-white">
                  <h3 className="text-sm font-semibold text-[#e6edf3] print-text-dark">{t('Alternative SKUs')}</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1117] print:bg-[#f6f8fa] text-[#8b949e] text-xs uppercase font-semibold border-b border-[#30363d] print-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t('SKU')}</th>
                      <th className="px-4 py-3 font-semibold">{t('Status')}</th>
                      <th className="px-4 py-3 font-semibold">{t('Reason')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d] print:divide-[#d0d7de]">
                    {prevSkuCu && (
                      <tr>
                        <td className="px-4 py-3 font-medium text-[#c9d1d9] print-text-dark">F{prevSkuCu}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#f85149]/10 text-[#f85149]">
                            <X className="w-3 h-3 mr-1" /> {t('Not Recommended')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#8b949e]">{t('High throttling risk, insufficient capacity')}</td>
                      </tr>
                    )}
                    <tr className="bg-[#161b22] print:bg-white">
                      <td className="px-4 py-3 font-semibold text-[#e6edf3] print-text-dark">{targetSkuRecommendation.costOptimizedSkuName}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#1f6feb]/10 text-[#0969da] print:bg-[#0969da]/10">
                          <Star className="w-3 h-3 mr-1 fill-current" /> {t('Recommended')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#c9d1d9] print-text-dark font-medium">{t('Best value for current workload')}</td>
                    </tr>
                    {nextSkuCu && (
                      <tr>
                        <td className="px-4 py-3 font-medium text-[#c9d1d9] print-text-dark">F{nextSkuCu}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#21262d] text-[#c9d1d9] print:bg-[#f6f8fa] print-text-dark">
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
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 flex items-center text-[#e6edf3] print-text-dark print-border">
                    <Zap className="w-5 h-5 mr-2 text-[#58a6ff]" /> {t('AI Insights')}
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-[#c9d1d9] print-text-dark leading-relaxed">
                      {t('Based on your workload profile:')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm text-[#c9d1d9] print-text-dark">
                        <CheckCircle2 className="w-4 h-4 text-[#3fb950] mr-2 shrink-0 mt-0.5" />
                        <span><strong>{t('Reserved Instance is highly recommended.')}</strong> {t('You could reduce costs by approximately 41% with a 1-year commitment.')}</span>
                      </li>
                      <li className="flex items-start text-sm text-[#c9d1d9] print-text-dark">
                        <Info className="w-4 h-4 text-[#58a6ff] mr-2 shrink-0 mt-0.5" />
                        <span>{t('Your Spark workload is moderate, leaving ample compute for concurrent Power BI rendering.')}</span>
                      </li>
                      <li className="flex items-start text-sm text-[#c9d1d9] print-text-dark">
                        <TrendingDown className="w-4 h-4 text-[#3fb950] mr-2 shrink-0 mt-0.5" />
                        <span>{t('Current capacity leaves room for approximately')} {Math.round(100 - utilPct)}% {t('data volume growth before requiring an upgrade.')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Growth Forecast */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border flex flex-col">
                  <h3 className="text-lg font-semibold border-b border-[#30363d] pb-2 mb-4 flex items-center text-[#e6edf3] print-text-dark print-border">
                    <TrendingDown className="w-5 h-5 mr-2 text-[#8b949e] rotate-180" /> {t('Growth Forecast')}
                  </h3>
                  
                  <div className="h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={growthData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8b949e' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8b949e' }} />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '6px' }}
                          itemStyle={{ color: '#58a6ff' }}
                        />
                        <Bar dataKey="CU" fill="#58a6ff" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-[#161b22] print:bg-[#f6f8fa] rounded-xl p-3 border border-[#30363d] print-border mt-auto">
                    <p className="text-sm text-[#c9d1d9] print-text-dark">
                      <strong>{t('Recommendation:')}</strong> {t('Upgrade to')} {nextSkuCu ? `F${nextSkuCu}` : t('a larger tier')} {t('around')} {new Date(Date.now() + 1000*60*60*24*365 * (nextSkuCu && nextSkuCu > y1 ? 1.5 : 0.8)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Methodology Section */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border print:break-inside-avoid">
                <h3 className="text-sm font-semibold border-b border-[#30363d] pb-2 mb-3 text-[#e6edf3] print-text-dark print-border">{t('Methodology')}</h3>
                <p className="text-sm text-[#8b949e] print-text-dark leading-relaxed">
                  Recommendations are based on workload estimates, concurrent usage, Spark utilization, Microsoft Fabric pricing guidelines, and projected growth curves. Financial estimates assume consistent usage over the billing period. Actual sizing and costs should be validated with production telemetry in Microsoft Fabric.
                </p>
                <div className="mt-4 flex items-center text-xs text-[#8b949e]">
                  <span>Fabric Master v1.2</span>
                  <span className="mx-2">•</span>
                  <span>Report Version: {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Print Final Page Contact/CTA */}
              <div className="hidden print:flex flex-col items-center justify-center break-before-page pt-20 text-center font-sans">
                <h2 className="text-3xl font-display font-bold mb-6 text-[#24292f]">Need a different scenario?</h2>
                <p className="text-xl text-[#57606a] mb-12">Run another capacity assessment live:</p>
                
                <div className="border-2 border-[#0969da] rounded-xl p-10 mb-12 max-w-lg mx-auto bg-[#f6f8fa]">
                  <h3 className="text-2xl font-bold text-[#0969da] mb-4">https://fabric.dattasable.com</h3>
                  <p className="text-[#57606a]">Free Microsoft Fabric Capacity Calculator & Cost Planner</p>
                </div>

                <div className="text-[#57606a]">
                  <p className="font-semibold text-lg mb-2">Created by Datta Sable</p>
                  <p>Microsoft Fabric Engineer & Data Platform Architect</p>
                </div>
              </div>

            </div>

            {/* Right Column - Sidebar (Span 4) */}
            <div className="lg:col-span-4 space-y-8 print:w-full print:mt-8">
              
              {/* Scores */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm space-y-6 print:shadow-none print:border print:break-inside-avoid">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#c9d1d9] print-text-dark">{t('Capacity Health')}</span>
                    <span className="text-sm font-semibold text-[#3fb950]">{healthScore}/100</span>
                  </div>
                  <div className="flex text-[#d29922] text-xs mb-2">
                    <Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" />
                  </div>
                  <p className="text-xs text-[#8b949e]">{t('Excellent headroom and stability.')}</p>
                </div>
                
                <div className="pt-4 border-t border-[#30363d] print-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#c9d1d9] print-text-dark">{t('Cost Efficiency')}</span>
                    <span className="text-sm font-semibold text-[#58a6ff]">{efficiencyScore}%</span>
                  </div>
                  <p className="text-xs text-[#8b949e]">{t('Spending is well-aligned with minimum required capacity.')}</p>
                </div>

                <div className="pt-4 border-t border-[#30363d] print-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#c9d1d9] print-text-dark">{t('Confidence Score')}</span>
                    <span className="text-sm font-semibold text-[#bc8cff]">{confidenceScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#21262d] print:bg-[#e1e4e8] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#bc8cff]" style={{ width: `${confidenceScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown with Chart */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border print:break-inside-avoid">
                <h3 className="text-sm font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3] print-text-dark print-border">{t('Pricing Breakdown')}</h3>
                
                <div className="h-32 mb-6 border-b border-[#30363d] pb-6 print-border">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costComparisonData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 12 }} width={70} />
                      <Tooltip 
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '6px' }}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar dataKey="cost" radius={[0, 4, 4, 0]} maxBarSize={20}>
                        {costComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8b949e]">{t('Hourly')}</span>
                    <span className="text-sm font-medium font-mono text-[#c9d1d9] print-text-dark">${financialSummary.payAsYouGoHourlyCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8b949e]">{t('Daily')}</span>
                    <span className="text-sm font-medium font-mono text-[#c9d1d9] print-text-dark">${dailyCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8b949e]">{t('Monthly')}</span>
                    <span className="text-lg font-semibold font-mono text-[#c9d1d9] print-text-dark">${financialSummary.payAsYouGoMonthlyEstimate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#30363d] print-border">
                    <span className="text-sm text-[#8b949e]">{t('Yearly (PAYG)')}</span>
                    <span className="text-sm font-medium font-mono text-[#c9d1d9] print-text-dark">${yearlyCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#30363d] print-border">
                    <span className="text-sm font-semibold text-[#58a6ff] print:text-[#0969da]">{t('Yearly (Reserved)')}</span>
                    <span className="text-lg font-semibold font-mono text-[#58a6ff] print:text-[#0969da]">${riYearlyCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Enterprise Readiness */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border print:break-inside-avoid">
                <h3 className="text-sm font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3] print-text-dark print-border">{t('Enterprise Assessment')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9] print-text-dark">{t('Concurrent Users')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9] print-text-dark">{t('Spark Jobs')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="text-[#30363d] print:text-[#d0d7de] w-3 h-3" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9] print-text-dark">{t('Warehouse')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#c9d1d9] print-text-dark">{t('Power BI')}</span>
                    <div className="flex text-[#d29922] text-[10px]"><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /></div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-[#161b22] print:bg-[#f6f8fa] rounded-xl border border-[#30363d] print-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8b949e] uppercase">{t('Overall')}</span>
                  <span className="text-xs font-semibold text-[#3fb950] flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('Production Ready')}</span>
                </div>
              </div>

              {/* Explain Every Metric */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:shadow-none print:border print:break-inside-avoid">
                <div className="flex items-center justify-between mb-4 border-b border-[#30363d] print-border pb-2">
                  <h3 className="text-sm font-semibold text-[#c9d1d9] print-text-dark">{t('Throttling Risk:')} {throttlingAnalysis.optimizedTierRiskPercentage}%</h3>
                  <AlertTriangle className={`w-4 h-4 ${throttlingAnalysis.optimizedTierRiskPercentage > 20 ? 'text-[#d29922]' : 'text-[#3fb950]'}`} />
                </div>
                <p className="text-xs font-semibold text-[#8b949e] uppercase mb-1">{t('What is this?')}</p>
                <p className="text-sm text-[#c9d1d9] print-text-dark mb-3">
                  {t('Microsoft Fabric may delay workloads when capacity becomes saturated.')}
                </p>
                <p className="text-sm text-[#c9d1d9] print-text-dark bg-[#161b22] print:bg-white p-3 rounded-xl border border-[#30363d] print-border">
                  {throttlingAnalysis.optimizedTierRiskPercentage > 20 
                    ? t("Your workload has some peak burst risks, consider smoothing jobs or using the Safe SKU during high load periods.")
                    : t("Your workload has sufficient headroom, so throttling is extremely unlikely.")}
                </p>
              </div>

              {/* Report Settings (Hidden in Print) */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm print:hidden">
                <h3 className="text-sm font-semibold border-b border-[#30363d] pb-2 mb-4 text-[#e6edf3]">{t('Report Customization')}</h3>
                <p className="text-xs text-[#8b949e] mb-4">{t('Add details to personalize the exported PDF report.')}</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">{t('Company Name')}</label>
                    <input 
                      type="text" 
                      placeholder={t('e.g. Contoso Ltd.')} 
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-1.5 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                      value={reportDetails.companyName}
                      onChange={(e) => setReportDetails({...reportDetails, companyName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">{t('Project Name')}</label>
                    <input 
                      type="text" 
                      placeholder={t('e.g. Data Estate Migration')} 
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-1.5 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                      value={reportDetails.projectName}
                      onChange={(e) => setReportDetails({...reportDetails, projectName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#c9d1d9] mb-1">{t('Environment')}</label>
                      <input 
                        type="text" 
                        placeholder={t('e.g. Production')} 
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-1.5 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                        value={reportDetails.environment}
                        onChange={(e) => setReportDetails({...reportDetails, environment: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#c9d1d9] mb-1">{t('Consultant Name')}</label>
                      <input 
                        type="text" 
                        placeholder={t('Your name')} 
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-1.5 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                        value={reportDetails.consultantName}
                        onChange={(e) => setReportDetails({...reportDetails, consultantName: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Share & Export Report Cover */}
              <div className="bg-[#161b22] text-[#c9d1d9] rounded-xl p-6 shadow-sm relative overflow-hidden border border-[#30363d] print:hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#1f6feb] opacity-10 rounded-full blur-2xl transition-opacity"></div>
                <h3 className="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> {t('Share & Export')}
                </h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <div className="text-lg font-semibold leading-tight text-[#e6edf3]">{t('Microsoft Fabric Capacity Assessment Report')}</div>
                    <div className="text-xs text-[#8b949e] mt-1">{t('Generated')} {today}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#30363d]">
                    <div>
                      <div className="text-xs text-[#8b949e] uppercase">{t('Recommended')}</div>
                      <div className="font-semibold font-mono text-[#c9d1d9]">{targetSkuRecommendation.costOptimizedSkuName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8b949e] uppercase">{t('Est. Cost')}</div>
                      <div className="font-semibold font-mono text-[#c9d1d9]">${financialSummary.payAsYouGoMonthlyEstimate.toLocaleString()}/mo</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={handleExport}>
                      <Download className="w-4 h-4" /> {t('Download PDF')}
                    </Button>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button variant="outline" className="w-full text-xs flex justify-center py-2" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert(t("Link copied to clipboard!"));
                      }}>
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="w-full text-xs flex justify-center py-2 text-[#0a66c2]" onClick={() => {
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                      }}>
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="w-full text-xs flex justify-center py-2" onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out my Microsoft Fabric Capacity Plan on Fabric Master!")}`, '_blank');
                      }}>
                        <Twitter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showIframeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowIframeModal(false)}
              className="absolute top-4 right-4 text-[#8b949e] hover:text-[#e6edf3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-[#1f6feb]/10 text-[#58a6ff] rounded-full">
                <FileText className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-[#e6edf3] tracking-tight">
                {t('Export Sizing Report')}
              </h3>
              
              <p className="text-sm text-[#8b949e] leading-relaxed">
                {t("Browser security policies prevent PDF generation inside embedded preview frames. To generate your polished executive-ready capacity assessment, please open the application in a new tab.")}
              </p>

              <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-left space-y-2">
                <p className="text-xs font-semibold text-[#58a6ff] uppercase tracking-wider">{t('Why this is better')}:</p>
                <ul className="text-xs text-[#c9d1d9] space-y-1.5 list-disc pl-4 font-normal leading-relaxed">
                  <li>{t('High-fidelity Microsoft-style PDF layout')}</li>
                  <li>{t('Durable data preservation via auto-saved state')}</li>
                  <li>{t('Formatted clean margins, watermark, & footers')}</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowIframeModal(false)}
                  className="w-full sm:order-1"
                >
                  {t('Cancel')}
                </Button>
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 duration-200 bg-[#1f6feb] text-white hover:bg-[#388bfd] h-10 px-4 text-sm sm:order-2"
                  onClick={() => setShowIframeModal(false)}
                >
                  {t('Open in New Tab')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
