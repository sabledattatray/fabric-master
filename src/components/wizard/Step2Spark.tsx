import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { Input } from '../ui/Input';
import { useTranslation } from 'react-i18next';

export function Step2Spark() {
  const { data, updateData } = useWizard();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-base text-[#8b949e]">{t('Determine your data engineering and science workload sizes.')}</p>
      </div>
      
      <div className="grid gap-6">
        <Input
          label={t('Total Nodes')}
          type="number"
          value={data.sparkComputeInput.totalNodes}
          onChange={(e) => updateData('sparkComputeInput', { totalNodes: Number(e.target.value) })}
          helperText={t('Total number of nodes running Spark jobs concurrently.')}
        />
        
        <div className="space-y-1.5 w-full">
          <label className="block text-sm font-semibold text-[#e6edf3]">{t('vCores per Node')}</label>
          <select
            className="flex h-8 w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 text-sm text-[#c9d1d9] focus:outline-none focus:bg-[#0d1117] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] shadow-inner"
            value={data.sparkComputeInput.vCoresPerNode}
            onChange={(e) => updateData('sparkComputeInput', { vCoresPerNode: Number(e.target.value) })}
          >
            {[2, 4, 8, 16, 32, 64].map((v) => (
              <option key={v} value={v}>{v} vCores</option>
            ))}
          </select>
          <p className="text-xs text-[#8b949e] mt-1">{t('Must align to standard cloud node configurations.')}</p>
        </div>
        
        <Input
          label={t('Daily Runtime (Hours)')}
          type="number"
          max={24}
          value={data.sparkComputeInput.dailyRuntimeHours}
          onChange={(e) => updateData('sparkComputeInput', { dailyRuntimeHours: Number(e.target.value) })}
          helperText={t('Average runtime for Spark clusters per day.')}
        />
      </div>
    </div>
  );
}
