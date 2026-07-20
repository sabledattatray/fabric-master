import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { calculateCapacity } from '../lib/calculator';
import { SEO } from '../components/SEO';

export function Report() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam));
        const result = calculateCapacity(decoded);
        if (result.success) {
          navigate('/results', { state: { evaluation: result, inputData: decoded }, replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (e) {
        console.error("Failed to parse report data", e);
        navigate('/', { replace: true });
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#e6edf3]">
      <SEO title="Loading Shared Report" noindex={true} />
      Loading report...
    </div>
  );
}
