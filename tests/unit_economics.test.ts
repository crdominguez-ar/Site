import { describe, it, expect } from 'vitest';

/**
 * Unit Economics Calculator Formulas & Validation
 */
describe('Unit Economics & SaaS Metrics Engine', () => {
  it('correctly calculates Monthly Churn and Annualized Churn', () => {
    const startingCustomers = 100;
    const churnedCustomers = 3;
    const monthlyChurnRate = (churnedCustomers / startingCustomers) * 100; // 3%
    const annualizedChurn = (1 - Math.pow(1 - churnedCustomers / startingCustomers, 12)) * 100;

    expect(monthlyChurnRate).toBe(3.0);
    expect(Number(annualizedChurn.toFixed(1))).toBe(30.6);
  });

  it('correctly calculates Net Revenue Retention (NRR)', () => {
    const startingMrr = 10000;
    const expansionMrr = 1200;
    const contractionMrr = 300;
    const churnedMrr = 400;

    const endingMrr = startingMrr + expansionMrr - contractionMrr - churnedMrr; // 10500
    const nrrPercent = (endingMrr / startingMrr) * 100;

    expect(nrrPercent).toBe(105.0);
    expect(nrrPercent).toBeGreaterThanOrEqual(103.0); // Argentine & Global SaaS Capital Benchmark
  });

  it('correctly calculates Customer Acquisition Cost (CAC) including commercial salaries', () => {
    const marketingSpend = 3000;
    const salesSalaries = 2000;
    const softwareCommissions = 500;
    const totalAcquisitionCost = marketingSpend + salesSalaries + softwareCommissions;
    const newCustomersAcquired = 10;

    const cac = totalAcquisitionCost / newCustomersAcquired;

    expect(cac).toBe(550);
  });

  it('correctly calculates Customer Lifetime Value (LTV) and LTV/CAC ratio', () => {
    const arpu = 250; // USD/mes
    const grossMarginPercent = 80; // 80%
    const monthlyChurnDecimal = 0.025; // 2.5% churn

    // LTV = (ARPU * GrossMargin) / Churn
    const ltv = (arpu * (grossMarginPercent / 100)) / monthlyChurnDecimal;
    const cac = 1500;
    const ltvCacRatio = ltv / cac;

    expect(ltv).toBe(8000);
    expect(Number(ltvCacRatio.toFixed(2))).toBe(5.33);
    expect(ltvCacRatio).toBeGreaterThan(3.0); // Healthy standard >= 3.0x
  });

  it('correctly calculates CAC Payback period in months', () => {
    const cac = 1200;
    const arpu = 200;
    const grossMarginPercent = 75; // 75%
    const monthlyGrossProfitPerCustomer = arpu * (grossMarginPercent / 100); // 150

    const paybackMonths = cac / monthlyGrossProfitPerCustomer;

    expect(paybackMonths).toBe(8);
    expect(paybackMonths).toBeLessThanOrEqual(12); // Best-practice payback < 12 months
  });

  it('evaluates unit economics health score', () => {
    const evaluateHealth = (ltvCac: number, paybackMonths: number, nrr: number) => {
      let score = 50;
      if (ltvCac >= 3.0) score += 20;
      if (paybackMonths <= 12) score += 15;
      if (nrr >= 103) score += 15;
      return score;
    };

    expect(evaluateHealth(4.0, 8, 105)).toBe(100);
    expect(evaluateHealth(2.0, 18, 98)).toBe(50);
  });
});
