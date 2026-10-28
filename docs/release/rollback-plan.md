# Fabric Master v4.0 — Zero-Downtime Rollback Plan

**Status:** Approved & Ready  
**Version:** 4.0.0  
**Target Environment:** Production (`https://fabric.dattasable.com/`)  
**Governing Policy:** PRD Section 47 & Acceptance Criterion AC-029  

---

## 1. Rollback Overview & Triggers

In the unlikely event of an unforeseen production regression, rendering issue, or critical functional failure post-deployment, this document defines the exact, deterministic procedure to restore production to a verified baseline state with zero downtime.

### Rollback Trigger Conditions
A rollback should be initiated immediately if:
1. **Critical Application Crash:** Unhandled JavaScript exceptions prevent the React SPA from mounting or rendering core workspace pages.
2. **Calculation Engine Defect:** Discrepancy detected in capacity calculations or pricing formulas resulting in inaccurate enterprise recommendations.
3. **Widespread Routing Failure:** HTTP 404/500 errors across prerendered documentation or tools on Vercel CDN.
4. **Security Vulnerability:** Identification of any unintended data leakage or security regression.

---

## 2. Instantaneous Rollback (Vercel Instant Rollback)

Because Fabric Master is hosted on Vercel Edge Network, previous production deployments are preserved indefinitely as immutable deployment snapshots. Instantaneous rollback does not require re-running builds or pushing code.

### Step-by-Step Vercel Instant Rollback (Estimated Time: < 30 seconds)
1. Log into the Vercel Dashboard: `https://vercel.com/sabledattatray/fabric-master`.
2. Navigate to **Deployments**.
3. Locate the last known good deployment (Commit `66a307f` or prior stable release).
4. Click the three dots menu `...` on the target deployment and select **Instant Rollback**.
5. Confirm the action in the prompt.
6. Traffic on `https://fabric.dattasable.com/` is instantaneously routed to the previous immutable deployment across all worldwide edge nodes with zero cache warming downtime.

---

## 3. Git-Based Reversal Procedure

If a persistent Git-level reversal is required:

### Step 1: Identify Last Stable Commit
```powershell
git log -n 5 --oneline
# Last verified baseline: 66a307f (feat: complete phases 0-6)
```

### Step 2: Create Reversion Branch or Revert Commit
```powershell
# Option A: Fast revert commit
git revert --no-edit HEAD
git push origin main

# Option B: Force pointer back (emergency only)
git checkout main
git reset --hard 66a307f
git push origin main --force
```

### Step 3: Trigger Verified Re-Build & Deployment
Vercel will detect the push on `main` and execute the build pipeline:
```powershell
npm run test:readiness
npm run build
```

---

## 4. Client-Side Data Schema Backward Compatibility

Fabric Master v4.0 uses client-side `localStorage` keys (`fabric_workspace_scenarios_v4`). If a rollback to v3.x or prior commit occurs:
1. **Isolation:** Version 4.0 scenarios are stored under versioned key `fabric_workspace_scenarios_v4`, which leaves legacy v3.x keys (`fabric_scenarios`, `fabric_calculator_state`) completely intact.
2. **Safe Fallbacks:** The scenario storage engine contains try-catch fallbacks and schema validation guards (`sanitizeScenarioData`). If unexpected fields are encountered, default values are supplied rather than throwing runtime unhandled exceptions.
3. **No Database State to Roll Back:** Because the application is 100% local-first without a centralized relational database, there are zero server migrations or schema rollbacks required.

---

## 5. Post-Rollback Verification Checklist

Following rollback execution:
- [ ] Direct HTTP GET `https://fabric.dattasable.com/` returns HTTP 200 with verified previous build ID.
- [ ] Inspect browser DevTools Console: 0 fatal exceptions.
- [ ] Test capacity calculator and pricing tables.
- [ ] Notify stakeholders and document root-cause analysis.
