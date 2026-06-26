import React, { createContext, useContext, useState } from 'react';
import { WorkloadCalculationInput } from '../types';

interface WizardContextType {
  data: WorkloadCalculationInput;
  updateData: (key: keyof WorkloadCalculationInput, value: any) => void;
}

const defaultData: WorkloadCalculationInput = {
  regionId: "eastus",
  currencyCode: "USD",
  dataFactoryInput: {
    monthlyPipelines: 10000,
    avgActivities: 10,
    dataVolumeGb: 500,
  },
  sparkComputeInput: {
    totalNodes: 4,
    vCoresPerNode: 8,
    dailyRuntimeHours: 4,
  },
  powerBiInput: {
    peakConcurrentUsers: 50,
    queryComplexityScale: 3,
  }
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WorkloadCalculationInput>(defaultData);

  const updateData = (key: keyof WorkloadCalculationInput, value: any) => {
    setData((prev) => {
      // If the existing value is an object (and not null), merge it. Otherwise, replace it.
      const isObject = prev[key] !== null && typeof prev[key] === 'object' && !Array.isArray(prev[key]);
      return {
        ...prev,
        [key]: isObject ? { ...prev[key], ...value } : value,
      };
    });
  };

  return (
    <WizardContext.Provider value={{ data, updateData }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
