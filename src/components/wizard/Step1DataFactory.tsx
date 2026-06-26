import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { Input } from '../ui/Input';

export function Step1DataFactory() {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-base text-[#8b949e]">Estimate the data movement and orchestration volume.</p>
      </div>
      
      <div className="grid gap-6">
        <Input
          label="Monthly Pipelines"
          type="number"
          value={data.dataFactoryInput.monthlyPipelines}
          onChange={(e) => updateData('dataFactoryInput', { monthlyPipelines: Number(e.target.value) })}
          helperText="Expected number of pipeline runs per month."
        />
        
        <Input
          label="Average Activities per Pipeline"
          type="number"
          value={data.dataFactoryInput.avgActivities}
          onChange={(e) => updateData('dataFactoryInput', { avgActivities: Number(e.target.value) })}
          helperText="Average number of activities executed per run."
        />
        
        <Input
          label="Data Volume (GB)"
          type="number"
          value={data.dataFactoryInput.dataVolumeGb}
          onChange={(e) => updateData('dataFactoryInput', { dataVolumeGb: Number(e.target.value) })}
          helperText="Total data moved/processed per month in GB."
        />
      </div>
    </div>
  );
}
