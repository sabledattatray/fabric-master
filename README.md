<div align="center">
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Fabric Master Banner" width="100%" height="300" style="object-fit: cover; border-radius: 12px;"/>

  <br />
  <br />

  <h1>⚡ Fabric Master</h1>
  <p>
    <b>The Ultimate AI-driven Microsoft Fabric Capacity Assessment & FinOps Tool</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge&color=3fb950" alt="Status">
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&color=2f81f7" alt="Version">
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&color=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&color=ea4aaa" alt="License">
  </p>
</div>

<br />

## 🌐 Live Application

👉 [https://fabric.dattasable.com](https://fabric.dattasable.com)

Free Microsoft Fabric Capacity Calculator

- Capacity Planning
- SKU Comparison
- Pricing Estimator
- Growth Forecast
- PDF Reports

## 📖 Overview

**Fabric Master** is an enterprise-grade capacity calculator and optimization engine designed specifically for **Microsoft Fabric**. It takes the guesswork out of sizing your data workloads by utilizing intelligent algorithms to recommend the perfect F-SKU based on your unique Data Factory, Spark, and Power BI requirements.

Whether you're just starting your Fabric journey or trying to optimize an existing architecture, Fabric Master provides detailed FinOps insights, throttling risk analysis, and comprehensive executive reports to ensure you maximize performance while minimizing costs.

## ✨ Key Features

- 🧮 **Precision Capacity Calculator**: Accurately model your workload needs across Data Factory pipelines, Spark compute, and Power BI concurrent users.
- 💡 **AI-Driven Insights**: Get intelligent recommendations on Pay-As-You-Go vs. Reserved Instance pricing and throttling mitigation strategies.
- 📊 **Detailed Executive Reports**: Generate and export professional PDF summaries of your capacity health, growth forecasts, and cost-efficiency.
- 🌍 **Global Support**: Full internationalization (i18n) supporting English, Spanish, Japanese, Portuguese, Chinese, Russian, French, and German.
- 🚀 **Enterprise Ready**: Designed for scale with predictive analytics and architecture guidance.
- ⚡ **Serverless Backend**: Built-in Vercel-ready API for performing complex capacity evaluation formulas securely.

## 📸 Screenshots

<div align="center">
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Dashboard Overview" width="800" style="border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);" />
  <p><i>Intuitive Capacity Calculation Wizard & Dashboard</i></p>

  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" alt="FinOps Reports" width="800" style="border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);" />
  <p><i>Detailed Financial Summaries & SKU Optimization</i></p>
</div>

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Routing & State**: React Router, standard Context/Hooks
- **Internationalization**: `i18next`, `react-i18next`
- **Backend / API**: Node.js, Express (Dev), Vercel Serverless Functions (Prod)
- **Validation**: Zod
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fabric-master.git
   cd fabric-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *This starts both the Vite frontend and the Express development server concurrently.*

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Deployment (Vercel)

This project is pre-configured for seamless deployment to Vercel. It utilizes `vercel.json` to route `/api/*` requests to Vercel Serverless Functions while serving the React SPA.

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` to link and deploy your project.

## 📡 API Reference

### `POST /api/v1/capacity-evaluation`

Evaluates the required Microsoft Fabric Capacity (CU) and provides SKU recommendations based on workload inputs.

**Request Body:**
```json
{
  "dataFactoryInput": {
    "monthlyPipelines": 1000,
    "avgActivities": 5,
    "dataVolumeGb": 500
  },
  "sparkComputeInput": {
    "totalNodes": 10,
    "vCoresPerNode": 8,
    "dailyRuntimeHours": 4
  },
  "powerBiInput": {
    "peakConcurrentUsers": 50,
    "queryComplexityScale": 1.5
  }
}
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  Made with ❤️ by the Fabric Master Team.
</p>
