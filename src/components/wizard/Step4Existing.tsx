import React from 'react';
import { useWizard } from '../../context/WizardContext';

export function Step4Existing() {
  const { data, updateData } = useWizard();

  const skus = [
    { name: 'None (New Deployment)', cu: null },
    { name: 'F2 (2 CU)', cu: 2 },
    { name: 'F4 (4 CU)', cu: 4 },
    { name: 'F8 (8 CU)', cu: 8 },
    { name: 'F16 (16 CU)', cu: 16 },
    { name: 'F32 (32 CU)', cu: 32 },
    { name: 'F64 (64 CU)', cu: 64 },
    { name: 'F128 (128 CU)', cu: 128 },
    { name: 'F256 (256 CU)', cu: 256 },
    { name: 'F512 (512 CU)', cu: 512 },
    { name: 'F1024 (1024 CU)', cu: 1024 },
    { name: 'F2048 (2048 CU)', cu: 2048 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-base text-[#8b949e]">Optionally provide your current Microsoft Fabric SKU to compare with our recommendation.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="space-y-1.5 w-full">
          <label className="block text-sm font-semibold text-[#e6edf3]">Current SKU (Optional)</label>
          <select
            value={data.currentSkuCu === null || data.currentSkuCu === undefined ? '' : data.currentSkuCu.toString()}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value);
              updateData('currentSkuCu', val);
            }}
            className="flex h-10 w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
          >
            {skus.map(sku => (
              <option key={sku.name} value={sku.cu === null ? '' : sku.cu}>
                {sku.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
