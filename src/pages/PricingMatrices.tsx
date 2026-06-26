import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';

import { SEO } from '../components/SEO';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';

const FABRIC_SKUS = [
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

export function PricingMatrices() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center">
      <SEO 
        title={t("Microsoft Fabric Pricing Calculator & SKU Cost Guide")} 
        description={t("Compare Microsoft Fabric SKU pricing estimates (Pay-As-You-Go vs Reserved Instance). Find out how much Microsoft Fabric costs for F2, F64, and Enterprise.")} 
        keywords="Microsoft Fabric Pricing Calculator, Microsoft Fabric Cost, Microsoft Fabric Capacity Units, Microsoft Fabric CU, Microsoft Fabric F64 pricing, Microsoft Fabric Reserved Instance, Microsoft Fabric PAYG"
      />
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center w-full">
        <div className="max-w-4xl w-full flex-1">
          <div className="border-b border-[#30363d] pb-6 mb-8">
            <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3]">{t('Pricing Matrices')}</h1>
            <p className="text-xl text-[#8b949e] mt-3 font-light">{t('Current Microsoft Fabric SKU pricing estimates (Pay-As-You-Go vs Reserved).')}</p>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-md shadow-sm overflow-hidden mb-12">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#161b22] text-[#8b949e] text-xs uppercase font-semibold border-b border-[#30363d]">
                <tr>
                  <th className="px-4 py-3">{t('SKU')}</th>
                  <th className="px-4 py-3">{t('Total CU')}</th>
                  <th className="px-4 py-3">Hourly (PAYG)</th>
                  <th className="px-4 py-3">Monthly (PAYG)</th>
                  <th className="px-4 py-3">Monthly (1Y Reserved)*</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {FABRIC_SKUS.map((sku) => (
                  <tr key={sku.name} className="hover:bg-[#161b22] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#e6edf3]">{sku.name}</td>
                    <td className="px-4 py-3 text-[#c9d1d9]">{sku.cu} CU</td>
                    <td className="px-4 py-3 text-[#c9d1d9]">${sku.pricePerHourUSD.toFixed(3)}</td>
                    <td className="px-4 py-3 text-[#c9d1d9]">${(sku.pricePerHourUSD * 730).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-[#3fb950] font-medium">${(sku.pricePerHourUSD * 0.59 * 730).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-[#161b22] border-t border-[#30363d] text-xs text-[#8b949e]">
              * Reserved Instance savings are estimated at 41% off Pay-As-You-Go rates for a 1-year commitment. Prices may vary by Azure region.
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-5xl mx-auto mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}
