import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { Input } from '../ui/Input';
import { useTranslation } from 'react-i18next';

export function Step3PowerBI() {
  const { data, updateData } = useWizard();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-base text-[#8b949e]">{t('Estimate peak concurrent reporting and dashboard usage.')}</p>
      </div>
      
      <div className="grid gap-6">
        <Input
          label={t('Peak Concurrent Users')}
          type="number"
          value={data.powerBiInput.peakConcurrentUsers}
          onChange={(e) => updateData('powerBiInput', { peakConcurrentUsers: Number(e.target.value) })}
          helperText={t('Maximum number of users interacting with reports at the same time.')}
        />
        
        <div className="space-y-1.5 w-full">
          <label className="block text-sm font-semibold text-[#e6edf3]">{t('Query Complexity Scale (1-5)')}</label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={data.powerBiInput.queryComplexityScale}
            onChange={(e) => updateData('powerBiInput', { queryComplexityScale: Number(e.target.value) })}
            className="w-full h-2 bg-[#30363d] rounded-2xl appearance-none cursor-pointer accent-[#58a6ff]"
          />
          <div className="flex justify-between text-xs text-[#8b949e] px-1 mt-2">
            <span>{t('Simple (1)')}</span>
            <span>{t('Moderate (3)')}</span>
            <span>{t('Complex (5)')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
