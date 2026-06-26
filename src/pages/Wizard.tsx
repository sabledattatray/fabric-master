import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step1DataFactory } from '../components/wizard/Step1DataFactory';
import { Step2Spark } from '../components/wizard/Step2Spark';
import { Step3PowerBI } from '../components/wizard/Step3PowerBI';
import { useWizard } from '../context/WizardContext';
import { Button } from '../components/ui/Button';
import { ArrowRight, ArrowLeft, Loader2, Database } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useWizard();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const STEPS = [
    { id: 'data-factory', title: t('Data Factory') },
    { id: 'spark', title: t('Spark') },
    { id: 'power-bi', title: t('Power BI') }
  ];

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/capacity-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        navigate('/results', { state: { evaluation: result } });
      } else {
        alert("Failed to calculate capacity: " + result.error);
      }
    } catch (err) {
      alert("Network error computing workloads.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex overflow-hidden">
      <SEO 
        title={t("Microsoft Fabric Capacity Calculator")} 
        description={t("Estimate your Microsoft Fabric capacity units (CU) and optimize pricing across Power BI, Data Factory, and Spark workloads.")}
        keywords="Microsoft Fabric Capacity Calculator, Microsoft Fabric Calculator, Microsoft Fabric Capacity Units Calculator, Fabric Capacity Sizing, Microsoft Fabric Workload Calculator, Fabric CU Calculator"
      />
      {/* Sidebar Navigator */}
      <aside className="w-64 border-r border-[#30363d] bg-[#0d1117] flex-col hidden md:flex overflow-y-auto custom-scrollbar shrink-0">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2 px-2">{t('Wizard Steps')}</h3>
            <ul className="space-y-1">
              {STEPS.map((step, index) => (
                <li key={step.id} className={`flex items-center ${index > currentStep ? 'opacity-50' : ''}`}>
                  <span className={`text-sm rounded-md px-2 py-1.5 w-full transition-colors ${index === currentStep ? 'font-semibold text-[#58a6ff] bg-[#1f6feb]/10' : (index < currentStep ? 'font-medium text-[#c9d1d9] hover:bg-[#21262d]' : 'text-[#8b949e]')}`}>
                    {index + 1}. {step.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-[#30363d]">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs text-[#8b949e]">{t('Progress')}</span>
            <span className="text-xs font-semibold text-[#c9d1d9]">{Math.round((currentStep / STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#30363d] rounded-full overflow-hidden mx-2" style={{ width: 'calc(100% - 16px)' }}>
            <div className="h-full bg-[#238636] transition-all duration-300" style={{ width: `${(currentStep / STEPS.length) * 100}%` }}></div>
          </div>
        </div>
      </aside>

      {/* Document Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col bg-[#0d1117] items-center">
          <div className="w-full max-w-3xl mt-4 flex-1">
            <h1 className="text-4xl font-display font-bold tracking-tight text-[#e6edf3] border-b border-[#30363d] pb-4 mb-8">
              {STEPS[currentStep].title}
            </h1>
            {/* Form Container */}
            <div className="space-y-8">
              {currentStep === 0 && <Step1DataFactory />}
              {currentStep === 1 && <Step2Spark />}
              {currentStep === 2 && <Step3PowerBI />}
              
              <div className="mt-12 flex items-center justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('Previous')}
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  variant={currentStep === STEPS.length - 1 ? 'primary' : 'secondary'}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {currentStep === STEPS.length - 1 ? t('Calculate') : t('Next')}
                  {!isSubmitting && currentStep < STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 w-full max-w-5xl mx-auto">
            <Footer />
          </div>
        </main>
    </div>
  );
}
