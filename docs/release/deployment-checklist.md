# Fabric Master v4.0 — Production Deployment Checklist

**Version:** 4.0.0  
**Target Environment:** Production (`https://fabric.dattasable.com/`)  
**Hosting Infrastructure:** Vercel Edge CDN  
**Repository:** `https://github.com/sabledattatray/fabric-master`  
**Governing Policy:** PRD Section 47 & Acceptance Criterion AC-030  

---

## 1. Pre-Deployment Verification Checklist (Mandatory Gates)

All checks in this section must pass locally in the release environment prior to requesting deployment approval.

- [x] **1.1 Clean Working Tree:** No unwanted unstaged files or scratch artifacts present.
  ```powershell
  git status -s
  ```
- [x] **1.2 Zero TypeScript Compilation Errors:**
  ```powershell
  npm run lint
  # Verified: tsc --noEmit exited with code 0
  ```
- [x] **1.3 Automated Readiness Test Suite (100% Pass):**
  ```powershell
  npm run test:readiness
  # Verified: 29/29 tests passing synchronously in ~560ms
  ```
- [x] **1.4 Static Site Prerendering & Production Build:**
  ```powershell
  npm run build
  # Verified: Vite rollup completed, 54/54 static routes prerendered into dist/*.html
  ```
- [x] **1.5 XML Sitemap Verification:**
  - `dist/sitemap.xml` and `public/sitemap.xml` generated with 39 indexable Category A URLs.
  - Experimental and utility routes correctly excluded from sitemap.
- [x] **1.6 Security Headers Audit:**
  - `vercel.json` contains CSP, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`.
- [x] **1.7 Zero Exposed Credentials:**
  - Automated scan confirmed zero hardcoded tenant secrets, API keys, or private keys.

---

## 2. Deployment Execution Steps

> [!IMPORTANT]
> Per PRD Section 2, Section 47, and Acceptance Criterion AC-030, deployment to production MUST NOT proceed without explicit written authorization from Product Owner Datta Sable.

1. **Commit Release Snapshot:**
   ```powershell
   git add .
   git commit -m "feat(v4.0): complete Fabric Master v4.0 release deliverables (Phases 7-10, Observability, AI Advisor v2, Reports, and Governance Docs)"
   ```
2. **Push to Remote Release Branch:**
   ```powershell
   git push origin main
   ```
3. **Trigger Vercel Production Deployment:**
   - Automatic GitHub integration deploys the verified commit to `https://fabric.dattasable.com/`.

---

## 3. Post-Deployment Smoke Verification

Immediately following deployment, verify live production behavior:

1. **Homepage & Navigation:**
   - Visit `https://fabric.dattasable.com/`. Verify dark slate design system, responsive navbar, and zero console errors.
2. **Unified Workspace:**
   - Visit `/workspace`. Confirm all 7 tabs load (Overview, Sizing, FinOps, Architecture, Compare, Migration, Observability).
3. **Capacity Calculation:**
   - Adjust workload inputs. Verify F64 snapping, 73.1% utilization, and $6,132 PAYG monthly calculation.
4. **Observability Studio:**
   - Visit `/observability`. Load sample telemetry profiles ("Medallion F64", "Morning Peak F32"). Confirm Recharts timeline and smoothing graph render cleanly.
5. **AI Advisor v2:**
   - Visit `/advisor`. Select scenario and verify 5 explanation task tabs, mathematical formulas, and audit export.
6. **Decision Report:**
   - Visit `/report`. Confirm 5-page layout, print-to-PDF preview, HTML download, and CSV export.
7. **HTTP Security Headers:**
   - Inspect response headers using browser DevTools or `curl -I https://fabric.dattasable.com/`. Confirm presence of HSTS, CSP, and X-Frame-Options.
8. **Static Route Resolution:**
   - Direct-request deep links: `/observability`, `/workspace`, `/report`, `/privacy`, `/trust`. Confirm 200 OK without 404 fallbacks.
