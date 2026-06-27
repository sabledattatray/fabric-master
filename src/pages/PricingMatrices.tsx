import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Database, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  TrendingUp, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Calculator, 
  Percent, 
  Layers, 
  Award, 
  Sparkles, 
  BookOpen,
  ArrowRight,
  HelpCircle,
  Clock,
  Calendar
} from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { SEO } from '../components/SEO';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';

interface SkuData {
  name: string;
  cu: number;
  pricePerHourUSD: number;
}

const FABRIC_SKUS: SkuData[] = [
  { name: "F2", cu: 2, pricePerHourUSD: 0.36 },
  { name: "F4", cu: 4, pricePerHourUSD: 0.72 },
  { name: "F8", cu: 8, pricePerHourUSD: 1.44 },
  { name: "F16", cu: 16, pricePerHourUSD: 2.88 },
  { name: "F32", cu: 32, pricePerHourUSD: 5.76 },
  { name: "F64", cu: 64, pricePerHourUSD: 11.52 },
  { name: "F128", cu: 128, pricePerHourUSD: 23.04 },
  { name: "F256", cu: 256, pricePerHourUSD: 46.08 },
  { name: "F512", cu: 512, pricePerHourUSD: 92.16 },
  { name: "F1024", cu: 1024, pricePerHourUSD: 184.32 },
  { name: "F2048", cu: 2048, pricePerHourUSD: 368.64 },
];

const SKU_DETAILS: Record<string, { typicalUse: string; description: string; features: string[] }> = {
  F2: {
    typicalUse: "Learning, proof of concepts, development, and personal sandboxes",
    description: "Ideal for small development projects, prototyping ETL flows, or training sessions without production-level workload needs.",
    features: ["Max 2 Capacity Units", "No Copilot access", "Direct Lake limits apply", "Requires Power BI Pro for report distribution"]
  },
  F4: {
    typicalUse: "Small test environments and entry-level pipelines",
    description: "Perfect for lightweight data integrations, simple scheduled Data Factory pipelines, and low-concurrency workloads.",
    features: ["Max 4 Capacity Units", "Basic Data Factory support", "Ideal for non-critical testing", "Requires Power BI Pro for report distribution"]
  },
  F8: {
    typicalUse: "Small production workloads and scheduled data orchestration",
    description: "Supports simple production ingestion pipelines, lightweight Lakehouse analytics, and scheduling baseline jobs.",
    features: ["Max 8 Capacity Units", "Small scheduled queries", "Suitable for small local databases", "Requires Power BI Pro for report distribution"]
  },
  F16: {
    typicalUse: "Medium-sized testing, single-department prototype workloads",
    description: "Great for single-department reports, medium scheduled warehouses, and concurrent Data Factory ingestion runs.",
    features: ["Max 16 Capacity Units", "Intermediate concurrency", "Medium Lakehouse orchestration", "Requires Power BI Pro for report distribution"]
  },
  F32: {
    typicalUse: "Department-scale analytics, multi-user reporting, and moderate scheduled pipelines",
    description: "Handles active departmental analytics with multiple concurrent Power BI readers and moderate-sized Spark jobs.",
    features: ["Max 32 Capacity Units", "Departmental scale data warehouse", "Moderate Spark analytics pools", "Requires Power BI Pro for report distribution"]
  },
  F64: {
    typicalUse: "Production-grade enterprise BI, direct lake reporting, and mixed production workloads",
    description: "This is the critical entry-point SKU. It enables Power BI Copilot, Microsoft Fabric tenant-wide usage, and allows users to share reports without requiring individuals to have Power BI Pro licenses.",
    features: ["Max 64 Capacity Units", "Power BI Copilot & AI enabled", "Free report distribution to all consumers", "Full Direct Lake performance benefit"]
  },
  F128: {
    typicalUse: "Enterprise-wide BI, heavy scheduled ETL pipelines, and concurrent Spark jobs",
    description: "Designed for larger enterprises needing high concurrency, massive concurrent notebook executions, and larger Direct Lake datasets.",
    features: ["Max 128 Capacity Units", "Continuous machine learning pipelines", "Advanced enterprise telemetry", "Free report distribution"]
  },
  F256: {
    typicalUse: "Large enterprise deployments, real-time analytics stream ingestion, and high-frequency data engineering",
    description: "Engineered to ingest streaming data with low-latency dashboards, heavy real-time analytics, and high-velocity engineering pipelines.",
    features: ["Max 256 Capacity Units", "Real-Time Eventstream ingestion", "High concurrency Spark clusters", "Free report distribution"]
  },
  F512: {
    typicalUse: "Massive corporate data architectures, continuous high-concurrency analytical queries",
    description: "Built for massive global multi-tenant corporations requiring centralized master data management and heavy analytics loads.",
    features: ["Max 512 Capacity Units", "Enterprise-wide master data platform", "Extreme query performance", "Free report distribution"]
  },
  F1024: {
    typicalUse: "Global multi-region enterprise data platforms with continuous large-scale ML",
    description: "Optimized for extreme workloads, large-scale deep learning training, and highly complex enterprise semantic layers.",
    features: ["Max 1024 Capacity Units", "Massive model serving and training", "Multi-geography capability support", "Free report distribution"]
  },
  F2048: {
    typicalUse: "Ultra-scale data architectures for fortune 500 corporations with thousands of active pipelines",
    description: "The absolute pinnacle of Microsoft Fabric compute capacity, supporting thousands of concurrent active pipelines, real-time syncs, and large ML structures.",
    features: ["Max 2048 Capacity Units", "Maximum limits on all Fabric operations", "Sovereign-grade enterprise governance", "Free report distribution"]
  }
};

const FAQ_ITEMS = [
  {
    question: "What is Microsoft Fabric pricing?",
    answer: "Microsoft Fabric pricing is calculated based on Capacity Units (CUs) per second. The baseline Pay-As-You-Go rate is $0.18 per CU per hour ($0.18 x 730 hours = $131.40 per CU per month). Users can buy capacity as Pay-As-You-Go (hourly billing, can pause to save costs) or commit to 1-Year Reserved Capacity for a ~41% discount."
  },
  {
    question: "What is the cheapest Fabric SKU?",
    answer: "The cheapest Fabric SKU is F2, which provides 2 Capacity Units (CUs) for $0.36/hour (approximately $262.80/month under Pay-As-You-Go, or $155.05/month under a 1-year Reserved Capacity commitment). It is ideal for training and development."
  },
  {
    question: "How much does F64 cost?",
    answer: "Under Pay-As-You-Go, F64 costs $11.52 per hour (approx. $8,409.60/month). With a 1-year Reserved Capacity agreement, the cost drops to approx. $4,961.66/month (saving $3,447.94 monthly or $41,375.28 annually)."
  },
  {
    question: "Is Reserved Capacity worth it?",
    answer: "Yes, if you plan to run your Microsoft Fabric capacity continuously for at least a few months, Reserved Capacity is highly beneficial. It offers a flat 41% discount, which pays off if the capacity is active for more than 59% of the year compared to Pay-As-You-Go."
  },
  {
    question: "How often does Microsoft update pricing?",
    answer: "Microsoft Fabric prices are based on official Azure lists. While list prices for CUs are highly stable (pegged at $0.18/CU/hour in major US regions), regional currencies or promotional discounts can vary periodically. This table is updated to reflect current June 2026 guidelines."
  },
  {
    question: "Does pricing vary by Azure region?",
    answer: "Yes, Microsoft Fabric capacity pricing can vary slightly depending on the selected Azure datacenter region, local taxes, and active enterprise discounts. The figures shown represent the standard US East baseline ($0.18 per CU/hour)."
  }
];

export function PricingMatrices() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Search & sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'cu' | 'hourly' | 'monthlyPayg' | 'monthlyReserved' | 'savings'>('cu');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Cost period display: 'hourly' | 'monthly' | 'annual'
  const [costPeriod, setCostPeriod] = useState<'hourly' | 'monthly' | 'annual'>('monthly');

  // Selected SKU profile for detail pane
  const [selectedSkuName, setSelectedSkuName] = useState<string | null>('F64');

  // Clipboard copy confirmation feedback
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Monthly Budget Finder state
  const [budgetInput, setBudgetInput] = useState<number>(5000);
  const [budgetLocalStr, setBudgetLocalStr] = useState<string>("5000");

  React.useEffect(() => {
    setBudgetLocalStr((prev) => {
      if (Number(prev) === budgetInput) return prev;
      return budgetInput.toString();
    });
  }, [budgetInput]);

  const [budgetType, setBudgetType] = useState<'PAYG' | 'Reserved'>('PAYG');

  // Dynamic calculations for selected SKU
  const activeSku = useMemo(() => {
    return FABRIC_SKUS.find(sku => sku.name === selectedSkuName) || FABRIC_SKUS[5]; // Default to F64
  }, [selectedSkuName]);

  // Handle SKU copy action
  const handleCopyRow = (sku: SkuData, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row selection trigger
    const hourlyPAYG = sku.pricePerHourUSD;
    const monthlyPAYG = hourlyPAYG * 730;
    const annualPAYG = monthlyPAYG * 12;
    const monthlyReserved = hourlyPAYG * 0.59 * 730;
    const annualReserved = monthlyReserved * 12;
    const monthlySavings = monthlyPAYG - monthlyReserved;
    const annualSavings = annualPAYG - annualReserved;

    const textToCopy = `Microsoft Fabric ${sku.name} | ${sku.cu} CU\n` +
      `- Hourly PAYG: $${hourlyPAYG.toFixed(3)}\n` +
      `- Monthly PAYG: $${monthlyPAYG.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n` +
      `- Monthly Reserved: $${monthlyReserved.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n` +
      `- Monthly Savings: $${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n` +
      `- Annual PAYG: $${annualPAYG.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n` +
      `- Annual Reserved: $${annualReserved.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n` +
      `- Annual Savings: $${annualSavings.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n` +
      `Source: fabric.dattasable.com`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSku(sku.name);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  // Sort helper
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Process data with filter & sort
  const processedSkus = useMemo(() => {
    let result = [...FABRIC_SKUS];

    // Filter by search
    if (searchQuery.trim() !== '') {
      result = result.filter(sku => 
        sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.cu.toString().includes(searchQuery)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortField === 'name') {
        // Natural sort for names
        const numA = parseInt(a.name.substring(1), 10);
        const numB = parseInt(b.name.substring(1), 10);
        valA = numA;
        valB = numB;
      } else if (sortField === 'cu') {
        valA = a.cu;
        valB = b.cu;
      } else if (sortField === 'hourly') {
        valA = a.pricePerHourUSD;
        valB = b.pricePerHourUSD;
      } else if (sortField === 'monthlyPayg') {
        valA = a.pricePerHourUSD * 730;
        valB = b.pricePerHourUSD * 730;
      } else if (sortField === 'monthlyReserved') {
        valA = a.pricePerHourUSD * 0.59 * 730;
        valB = b.pricePerHourUSD * 0.59 * 730;
      } else if (sortField === 'savings') {
        valA = (a.pricePerHourUSD * 730) - (a.pricePerHourUSD * 0.59 * 730);
        valB = (b.pricePerHourUSD * 730) - (b.pricePerHourUSD * 0.59 * 730);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchQuery, sortField, sortOrder]);

  // Budget Finder logic: find highest SKU that fits
  const budgetFinderResults = useMemo(() => {
    const list = [...FABRIC_SKUS].reverse(); // start from highest
    
    // Find PAYG match
    const paygMatch = list.find(sku => (sku.pricePerHourUSD * 730) <= budgetInput);
    // Find Reserved match
    const reservedMatch = list.find(sku => (sku.pricePerHourUSD * 0.59 * 730) <= budgetInput);

    return {
      payg: paygMatch ? {
        sku: paygMatch.name,
        cost: paygMatch.pricePerHourUSD * 730,
        remaining: budgetInput - (paygMatch.pricePerHourUSD * 730),
        cu: paygMatch.cu
      } : null,
      reserved: reservedMatch ? {
        sku: reservedMatch.name,
        cost: reservedMatch.pricePerHourUSD * 0.59 * 730,
        remaining: budgetInput - (reservedMatch.pricePerHourUSD * 0.59 * 730),
        cu: reservedMatch.cu
      } : null
    };
  }, [budgetInput]);

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center bg-[#0d1117] text-[#c9d1d9] custom-scrollbar">
      <SEO 
        title={t("Microsoft Fabric Pricing Calculator & SKU Cost Guide")} 
        description={t("Compare current Microsoft Fabric pricing across every F-SKU. Instantly estimate Pay-As-You-Go costs, Reserved Capacity savings, and monthly infrastructure expenses.")} 
        keywords="Microsoft Fabric Pricing Calculator, Microsoft Fabric Cost, Microsoft Fabric Capacity Units, Microsoft Fabric CU, Microsoft Fabric F64 pricing, Microsoft Fabric Reserved Instance, Microsoft Fabric PAYG"
      />
      
      <div className="flex-1 w-full p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Hero Section */}
        <div className="border-b border-[#30363d] pb-6 mt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#58a6ff] font-mono text-sm uppercase tracking-wider mb-2">
                <Database className="w-4 h-4" />
                <span>Microsoft Fabric SKU matrices</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[#e6edf3]">
                {t('Microsoft Fabric SKU Pricing Guide')}
              </h1>
              <p className="text-md md:text-lg text-[#8b949e] mt-3 max-w-4xl font-light leading-relaxed">
                {t('Compare current Microsoft Fabric pricing across every F-SKU. Instantly estimate Pay-As-You-Go costs, Reserved Capacity savings, and monthly infrastructure expenses for your Microsoft Fabric deployment.')}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#161b22] border border-[#30363d] rounded-full text-xs font-mono text-[#8b949e]">
                <Clock className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span>Last Updated: June 2026</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#161b22] border border-[#30363d] rounded-full text-xs font-mono text-[#8b949e]">
                <Info className="w-3.5 h-3.5 text-[#3fb950]" />
                <span>Source: US East list rates</span>
              </span>
            </div>
          </div>
        </div>

        {/* Top Summary/Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase tracking-wider">{t('Lowest Entry SKU')}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white font-mono">F2</span>
              <span className="text-xs text-[#8b949e] font-mono">($0.36/hr)</span>
            </div>
            <span className="text-xs text-[#58a6ff] mt-2 block hover:underline">
              <Link to="/fsku-comparisons">{t('Compare F2 capabilities')}</Link>
            </span>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase tracking-wider">{t('Highest Scale SKU')}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white font-mono">F2048</span>
              <span className="text-xs text-[#8b949e] font-mono">(2,048 CU)</span>
            </div>
            <span className="text-xs text-[#8b949e] mt-2 block">{t('For high-scale global deployments')}</span>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase tracking-wider">{t('Reserved Savings')}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#3fb950] font-mono">Up to 41%</span>
              <span className="text-xs text-[#8b949e]">{t('with 1-Yr')}</span>
            </div>
            <span className="text-xs text-[#58a6ff] mt-2 block hover:underline">
              <Link to="/reserved-savings">{t('Calculate ROI savings')}</Link>
            </span>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase tracking-wider">{t('SKUs Compared')}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white font-mono">11 SKUs</span>
              <span className="text-xs text-[#8b949e]">F2 {t('to')} F2048</span>
            </div>
            <span className="text-xs text-[#8b949e] mt-2 block">{t('Complete active Fabric list')}</span>
          </div>
        </div>

        {/* Interactive Monthly Budget Finder */}
        <div className="bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#1f6feb] opacity-5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffc107]" />
                <h3 className="text-lg font-bold text-white">{t('Monthly Budget Finder')}</h3>
              </div>
              <p className="text-sm text-[#8b949e]">
                {t('Not sure which Fabric capacity matches your financial resources? Input your monthly budget, and we\'ll find the optimal tier instantly.')}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8b949e]">
                  <span>{t('Monthly Budget Limit')}</span>
                  <span className="text-white font-mono font-semibold">${budgetInput.toLocaleString()}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input 
                    type="range" 
                    min="200" 
                    max="150000" 
                    step="100"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(Number(e.target.value))}
                    className="flex-1 accent-[#58a6ff] cursor-pointer bg-[#30363d] rounded-lg h-2"
                  />
                  <div className="relative rounded-md shadow-sm w-36 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-[#8b949e] sm:text-xs">$</span>
                    </div>
                    <input
                      type="number"
                      value={budgetLocalStr}
                      onChange={(e) => {
                        let valStr = e.target.value;
                        if (/^0\d+/.test(valStr)) {
                          valStr = valStr.replace(/^0+/, '');
                        }
                        setBudgetLocalStr(valStr);
                        setBudgetInput(Math.max(0, Number(valStr)));
                      }}
                      onBlur={() => {
                        if (budgetLocalStr === "" || isNaN(Number(budgetLocalStr))) {
                          setBudgetLocalStr(budgetInput.toString());
                        }
                      }}
                      className="bg-[#21262d] border border-[#30363d] text-white font-mono text-sm rounded-lg focus:outline-none focus:border-[#58a6ff] block w-full pl-7 pr-3 py-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[450px] shrink-0 bg-[#0d1117] border border-[#30363d] rounded-xl p-5 flex flex-col gap-4">
              <h4 className="text-xs font-mono text-[#8b949e] uppercase tracking-widest">{t('Estimated Capacity Match')}</h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* PAYG Finder block */}
                <div className={`p-3 rounded-lg border ${budgetFinderResults.payg ? 'bg-[#161b22]/50 border-[#30363d]' : 'bg-transparent border-[#30363d]/40 opacity-50'}`}>
                  <span className="text-[10px] text-[#8b949e] font-semibold tracking-wider block mb-1">PAY-AS-YOU-GO</span>
                  {budgetFinderResults.payg ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white font-mono">{budgetFinderResults.payg.sku}</span>
                        <span className="text-xs text-[#8b949e]">({budgetFinderResults.payg.cu} CU)</span>
                      </div>
                      <div className="text-xs text-[#c9d1d9] mt-1 font-mono">${budgetFinderResults.payg.cost.toLocaleString(undefined, {maximumFractionDigits:0})}/mo</div>
                      <div className="text-[10px] text-[#3fb950] font-mono mt-1">+${budgetFinderResults.payg.remaining.toLocaleString(undefined, {maximumFractionDigits:0})} left</div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#8b949e] py-2">{t('Budget below min tier')}</div>
                  )}
                </div>

                {/* Reserved Finder block */}
                <div className={`p-3 rounded-lg border ${budgetFinderResults.reserved ? 'bg-[#161b22] border-[#3fb950]/40' : 'bg-transparent border-[#30363d]/40 opacity-50'}`}>
                  <span className="text-[10px] text-[#3fb950] font-semibold tracking-wider block mb-1 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    RESERVED (1Y)
                  </span>
                  {budgetFinderResults.reserved ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#3fb950] font-mono">{budgetFinderResults.reserved.sku}</span>
                        <span className="text-xs text-[#8b949e]">({budgetFinderResults.reserved.cu} CU)</span>
                      </div>
                      <div className="text-xs text-[#c9d1d9] mt-1 font-mono">${budgetFinderResults.reserved.cost.toLocaleString(undefined, {maximumFractionDigits:0})}/mo</div>
                      <div className="text-[10px] text-[#3fb950] font-mono mt-1">+${budgetFinderResults.reserved.remaining.toLocaleString(undefined, {maximumFractionDigits:0})} left</div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#8b949e] py-2">{t('Budget below min tier')}</div>
                  )}
                </div>
              </div>

              {budgetFinderResults.reserved && budgetFinderResults.payg && budgetFinderResults.reserved.cu > budgetFinderResults.payg.cu && (
                <div className="bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-lg p-2.5 text-xs text-[#58a6ff] flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">{t('Budget Tip:')}</strong>{' '}
                    {t('Reserved pricing unlocks the')} <strong className="text-white">{budgetFinderResults.reserved.sku}</strong> {t('tier!')}{' '}
                    {t('This offers double the power compared to')} {budgetFinderResults.payg.sku} {t('with same budget limitations.')}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Pricing Layout: Interactive Table + Selected SKU Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Table Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Search and Period Toggles */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8b949e]" />
                <input
                  type="text"
                  placeholder={t('Search SKU or CU count (e.g. F64, 32)...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#58a6ff] w-full"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#0d1117] p-1 border border-[#30363d] rounded-lg text-xs font-medium self-start md:self-auto">
                <button
                  onClick={() => setCostPeriod('hourly')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${costPeriod === 'hourly' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                >
                  {t('Hourly Rates')}
                </button>
                <button
                  onClick={() => setCostPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${costPeriod === 'monthly' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                >
                  {t('Monthly')}
                </button>
                <button
                  onClick={() => setCostPeriod('annual')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${costPeriod === 'annual' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                >
                  {t('Annual Budget')}
                </button>
              </div>
            </div>

            {/* SKU Cost Table */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#11161d] text-[#8b949e] text-xs uppercase font-semibold border-b border-[#30363d]">
                    <tr>
                      <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-1">
                          <span>{t('SKU')}</span>
                          <ArrowUpDown className="w-3 h-3 text-[#58a6ff]" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => handleSort('cu')}>
                        <div className="flex items-center gap-1">
                          <span>{t('Compute (CUs)')}</span>
                          <ArrowUpDown className="w-3 h-3 text-[#58a6ff]" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => handleSort(costPeriod === 'hourly' ? 'hourly' : costPeriod === 'annual' ? 'monthlyPayg' : 'monthlyPayg')}>
                        <div className="flex items-center gap-1">
                          <span>
                            {costPeriod === 'hourly' && t('Hourly PAYG')}
                            {costPeriod === 'monthly' && t('Monthly PAYG')}
                            {costPeriod === 'annual' && t('Annual PAYG')}
                          </span>
                          <ArrowUpDown className="w-3 h-3 text-[#58a6ff]" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => handleSort(costPeriod === 'hourly' ? 'hourly' : costPeriod === 'annual' ? 'monthlyReserved' : 'monthlyReserved')}>
                        <div className="flex items-center gap-1">
                          <span>
                            {costPeriod === 'hourly' && t('Hourly Reserved')}
                            {costPeriod === 'monthly' && t('Reserved (1Y)')}
                            {costPeriod === 'annual' && t('Annual Reserved')}
                          </span>
                          <ArrowUpDown className="w-3 h-3 text-[#58a6ff]" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => handleSort('savings')}>
                        <div className="flex items-center gap-1">
                          <span>{t('Savings')}</span>
                          <ArrowUpDown className="w-3 h-3 text-[#58a6ff]" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center">{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d]/60">
                    {processedSkus.length > 0 ? (
                      processedSkus.map((sku) => {
                        const isSelected = selectedSkuName === sku.name;
                        
                        // Cost factor calculations
                        const hrPayg = sku.pricePerHourUSD;
                        const hrReserved = hrPayg * 0.59;
                        
                        const monthlyPayg = hrPayg * 730;
                        const monthlyReserved = hrReserved * 730;
                        
                        const annualPayg = monthlyPayg * 12;
                        const annualReserved = monthlyReserved * 12;

                        let displayPayg = 0;
                        let displayReserved = 0;
                        let displaySavings = 0;

                        if (costPeriod === 'hourly') {
                          displayPayg = hrPayg;
                          displayReserved = hrReserved;
                          displaySavings = hrPayg - hrReserved;
                        } else if (costPeriod === 'monthly') {
                          displayPayg = monthlyPayg;
                          displayReserved = monthlyReserved;
                          displaySavings = monthlyPayg - monthlyReserved;
                        } else {
                          displayPayg = annualPayg;
                          displayReserved = annualReserved;
                          displaySavings = annualPayg - annualReserved;
                        }

                        return (
                          <tr 
                            key={sku.name} 
                            onClick={() => setSelectedSkuName(sku.name)}
                            className={`group cursor-pointer transition-all ${isSelected ? 'bg-[#1f6feb]/15 border-l-2 border-l-[#58a6ff]' : 'hover:bg-[#161b22]/80'}`}
                          >
                            <td className="px-4 py-3 font-semibold text-white font-mono flex items-center gap-2">
                              <span>{sku.name}</span>
                              {sku.name === 'F64' && (
                                <span className="text-[10px] bg-[#238636] text-white px-2 py-0.5 rounded-full font-sans font-medium uppercase tracking-wide">
                                  {t('Enterprise Key Entry')}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-[#c9d1d9] font-mono">{sku.cu} CU</td>
                            <td className="px-4 py-3 text-[#c9d1d9] font-mono">
                              ${displayPayg.toLocaleString(undefined, { 
                                minimumFractionDigits: costPeriod === 'hourly' ? 3 : 2, 
                                maximumFractionDigits: costPeriod === 'hourly' ? 3 : 2 
                              })}
                            </td>
                            <td className="px-4 py-3 text-[#c9d1d9] font-mono">
                              ${displayReserved.toLocaleString(undefined, { 
                                minimumFractionDigits: costPeriod === 'hourly' ? 3 : 2, 
                                maximumFractionDigits: costPeriod === 'hourly' ? 3 : 2 
                              })}
                            </td>
                            <td className="px-4 py-3 text-[#3fb950] font-medium font-mono">
                              <span className="flex items-center gap-1">
                                <span>
                                  ${displaySavings.toLocaleString(undefined, { 
                                    minimumFractionDigits: costPeriod === 'hourly' ? 3 : 2, 
                                    maximumFractionDigits: costPeriod === 'hourly' ? 3 : 2 
                                  })}
                                </span>
                                <span className="text-[10px] text-[#8b949e] font-sans">({costPeriod === 'hourly' ? '41%' : t('Save 41%')})</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={(e) => handleCopyRow(sku, e)}
                                title={t('Copy row values')}
                                className="p-1.5 rounded-md hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors"
                              >
                                {copiedSku === sku.name ? (
                                  <Check className="w-4 h-4 text-[#3fb950]" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#8b949e]">
                          {t('No SKUs match your query.')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-[#11161d] border-t border-[#30363d] text-xs text-[#8b949e] flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span>
                  * {t('Reserved pricing yields flat 41% discount for standard continuous annual workloads.')}
                </span>
                <span className="text-[#58a6ff] hover:underline flex items-center gap-1">
                  <Link to="/reserved-savings" className="flex items-center gap-1">
                    {t('Reserved ROI tool')} <ArrowRight className="w-3 h-3" />
                  </Link>
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG Horizontal Visual Scale Chart */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#58a6ff]" />
                  <h3 className="text-sm font-bold text-white">{t('Capacity Scale Visual Comparison (Monthly Cost)')}</h3>
                </div>
                <span className="text-xs text-[#8b949e]">{t('Select a SKU bar to inspect details')}</span>
              </div>
              
              <div className="space-y-3">
                {FABRIC_SKUS.map((sku) => {
                  const maxCost = FABRIC_SKUS[FABRIC_SKUS.length - 1].pricePerHourUSD * 730;
                  const currentCost = sku.pricePerHourUSD * 730;
                  // Use logarithm scale for layout display so F2 is visible next to gigantic F2048
                  const percentage = Math.max(4, Math.min(100, (Math.log(currentCost) / Math.log(maxCost)) * 100));
                  const isSelected = selectedSkuName === sku.name;

                  return (
                    <div 
                      key={sku.name} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setSelectedSkuName(sku.name)}
                    >
                      <span className={`w-12 text-xs font-mono font-semibold transition-colors ${isSelected ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-white'}`}>
                        {sku.name}
                      </span>
                      <div className="flex-1 bg-[#0d1117] h-5 rounded-md overflow-hidden relative border border-[#30363d]/60">
                        <div 
                          style={{ width: `${percentage}%` }}
                          className={`h-full transition-all duration-300 ${isSelected ? 'bg-[#1f6feb] border-r-2 border-r-[#58a6ff]' : 'bg-[#21262d] group-hover:bg-[#30363d]'}`}
                        ></div>
                        <div className="absolute inset-y-0 left-2.5 flex items-center text-[10px] font-mono text-[#8b949e] group-hover:text-white transition-colors pointer-events-none">
                          {sku.cu} CU • ${currentCost.toLocaleString(undefined, {maximumFractionDigits:0})}/mo
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sidebar SKU Detail Profile Panel */}
          <div className="lg:col-span-4 bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col gap-6 sticky top-20">
            <div>
              <div className="text-xs text-[#8b949e] font-mono uppercase tracking-wider mb-1">{t('Selected SKU Profile')}</div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-display font-bold text-white font-mono">{activeSku.name}</h2>
                <span className="text-md text-[#8b949e] font-mono">({activeSku.cu} Capacity Units)</span>
              </div>
              <p className="text-xs text-[#8b949e] mt-1 font-mono">
                {t('Pay-As-You-Go:')} ${(activeSku.pricePerHourUSD).toFixed(2)}/hr • ${ (activeSku.pricePerHourUSD * 730).toLocaleString(undefined, {maximumFractionDigits:0}) }/mo
              </p>
            </div>

            {/* Use Case Profile Box */}
            {SKU_DETAILS[activeSku.name] && (
              <div className="space-y-4 border-t border-[#30363d] pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{t('Typical Workload Scope')}</h4>
                  <p className="text-sm text-white font-semibold mt-1.5 leading-relaxed">
                    {SKU_DETAILS[activeSku.name].typicalUse}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{t('Detailed Suitability')}</h4>
                  <p className="text-xs text-[#8b949e] mt-1.5 leading-relaxed">
                    {SKU_DETAILS[activeSku.name].description}
                  </p>
                </div>

                {/* SKU Key Limits/Benefits */}
                <div>
                  <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">{t('SKU Properties & Limitations')}</h4>
                  <ul className="space-y-1.5">
                    {SKU_DETAILS[activeSku.name].features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-[#c9d1d9] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Deep Links / Actions */}
            <div className="border-t border-[#30363d] pt-4 space-y-3">
              <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">{t('Interactive Estimators')}</h4>
              
              <button 
                onClick={() => navigate(`/cost-calculator?sku=${activeSku.name}`)}
                className="w-full py-2 px-3 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#58a6ff]" />
                  <span>{t('Calculate Full Cost Profile')}</span>
                </span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button 
                onClick={() => navigate(`/fsku-comparisons?sku=${activeSku.name}`)}
                className="w-full py-2 px-3 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ffc107]" />
                  <span>{t('Compare Against Other SKUs')}</span>
                </span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button 
                onClick={() => navigate('/wizard')}
                className="w-full py-2.5 px-3 bg-[#1f6feb] hover:bg-[#11161d] hover:text-white border border-transparent hover:border-[#30363d] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>{t('Estimate From Active Workload')}</span>
              </button>
            </div>
            
          </div>

        </div>

        {/* Detailed Context & Typical Deployments Grid */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <div className="border-b border-[#30363d] pb-4 mb-4">
            <h3 className="text-lg font-bold text-white">{t('Microsoft Fabric SKU Categorization Guide')}</h3>
            <p className="text-xs text-[#8b949e] mt-1">{t('Understand which SKU tier matches your project scope and operational needs.')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#58a6ff]">
                <span className="px-2 py-0.5 bg-[#58a6ff]/10 text-xs rounded-md">F2 - F16</span>
                <span>{t('Evaluation & Testing')}</span>
              </div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                {t('Great for learning, continuous integration environments, sandboxes, and department prototyping. Requires all report viewers to hold individual Power BI Pro licenses to consume custom reports.')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#3fb950]">
                <span className="px-2 py-0.5 bg-[#3fb950]/10 text-xs rounded-md">F32 - F64</span>
                <span>{t('Production BI & Ingestion')}</span>
              </div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                {t('Optimal for small to medium businesses or department-scale analytics. F64 is the critical "Entry Enterprise" tier where Power BI consumption does not require Pro licenses, and Power BI Copilot is enabled.')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#bc8cff]">
                <span className="px-2 py-0.5 bg-[#bc8cff]/10 text-xs rounded-md">F128 - F2048</span>
                <span>{t('Enterprise Scale')}</span>
              </div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                {t('Engineered for corporate-wide analytical architectures, concurrent machine learning pipelines, and heavy Apache Spark execution. Unlocks high-velocity engineering, and large ingestion stream bandwidth.')}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section (SEO Booster) */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <div className="flex items-center gap-2 border-b border-[#30363d] pb-4 mb-6">
            <HelpCircle className="w-5 h-5 text-[#ffc107]" />
            <h3 className="text-lg font-bold text-white">{t('Microsoft Fabric Pricing FAQ')}</h3>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117] transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#161b22] transition-colors"
                  >
                    <span className="font-semibold text-[#e6edf3] text-sm">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8b949e]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8b949e]" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 text-xs text-[#8b949e] border-t border-[#30363d] leading-relaxed bg-[#161b22]/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative Disclaimer */}
        <div className="bg-[#21262d]/40 border border-[#30363d] rounded-xl p-5 text-xs text-[#8b949e] leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 mt-0.5 text-[#ffc107] shrink-0" />
          <div>
            <strong className="text-white block mb-1">{t('Important Pricing Disclaimer')}</strong>
            {t('Pricing estimates are based on Microsoft Fabric list pricing of $0.18 per Capacity Unit (CU) per hour. Actual charges vary by Azure region, currency, local taxes, exchange rates, and active enterprise agreements (such as Microsoft Azure Consumption Commitment - MACC). Reserved Capacity savings are approximate and should be confirmed with your Microsoft Account Team during procurement.')}
          </div>
        </div>

        {/* Related Call to Actions */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4 text-center">
            {t('Need help choosing a SKU?')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => navigate('/wizard')}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col justify-between hover:border-[#58a6ff] cursor-pointer transition-all hover:translate-y-[-2px]"
            >
              <div>
                <h4 className="font-bold text-white text-sm">{t('Launch Capacity Calculator')}</h4>
                <p className="text-xs text-[#8b949e] mt-1">
                  {t('Sizing tool based on Data pipelines, Power BI users, and scheduled Warehouses.')}
                </p>
              </div>
              <span className="text-xs text-[#58a6ff] font-medium flex items-center gap-1 mt-4">
                {t('Size Workload')} <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div 
              onClick={() => navigate('/reserved-savings')}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col justify-between hover:border-[#3fb950] cursor-pointer transition-all hover:translate-y-[-2px]"
            >
              <div>
                <h4 className="font-bold text-white text-sm">{t('Estimate Reserved Savings')}</h4>
                <p className="text-xs text-[#8b949e] mt-1">
                  {t('Compare Pay-As-You-Go with active commitments and annual budget discounts.')}
                </p>
              </div>
              <span className="text-xs text-[#3fb950] font-medium flex items-center gap-1 mt-4">
                {t('Compare Savings')} <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div 
              onClick={() => navigate('/fsku-comparisons')}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col justify-between hover:border-[#ffc107] cursor-pointer transition-all hover:translate-y-[-2px]"
            >
              <div>
                <h4 className="font-bold text-white text-sm">{t('Compare F64 vs F128')}</h4>
                <p className="text-xs text-[#8b949e] mt-1">
                  {t('Detailed capability matching between critical Microsoft Fabric enterprise tiers.')}
                </p>
              </div>
              <span className="text-xs text-[#ffc107] font-medium flex items-center gap-1 mt-4">
                {t('View Comparison')} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Footer wrapper */}
        <div className="w-full mt-4">
          <Footer />
        </div>

      </div>
    </div>
  );
}
