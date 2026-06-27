/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WizardProvider } from "./context/WizardContext";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Wizard } from "./pages/Wizard";
import { Dashboard } from "./pages/Dashboard";
import { PricingMatrices } from "./pages/PricingMatrices";
import { Documentation } from "./pages/Documentation";
import { ArticlePage } from "./pages/ArticlePage";
import { About } from "./pages/About";
import { CostCalculator } from "./pages/CostCalculator";
import { ReservedSavings } from "./pages/ReservedSavings";
import { SparkEstimator } from "./pages/SparkEstimator";
import { PowerBICapacity } from "./pages/PowerBICapacity";
import { FskuComparisons } from "./pages/FskuComparisons";
import { Report } from "./pages/Report";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <HelmetProvider>
      <WizardProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/wizard" element={<Wizard />} />
              <Route path="/results" element={<Dashboard />} />
              <Route path="/pricing" element={<PricingMatrices />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/docs/:articleId" element={<ArticlePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/cost-calculator" element={<CostCalculator />} />
              <Route path="/reserved-savings" element={<ReservedSavings />} />
              <Route path="/spark-estimator" element={<SparkEstimator />} />
              <Route path="/power-bi-capacity" element={<PowerBICapacity />} />
              <Route path="/fsku-comparisons" element={<FskuComparisons />} />
              <Route path="/report" element={<Report />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </Layout>
        </Router>
      </WizardProvider>
    </HelmetProvider>
  );
}
