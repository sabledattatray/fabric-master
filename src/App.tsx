/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { WizardProvider } from './context/WizardContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Wizard } from './pages/Wizard';
import { Dashboard } from './pages/Dashboard';
import { PricingMatrices } from './pages/PricingMatrices';
import { Documentation } from './pages/Documentation';
import { ArticlePage } from './pages/ArticlePage';

export default function App() {
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
            </Routes>
          </Layout>
        </Router>
      </WizardProvider>
    </HelmetProvider>
  );
}
