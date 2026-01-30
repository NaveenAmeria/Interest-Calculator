function round2(x) {
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

function calcSimple({ P, rateAnnual, months }) {
  const years = months / 12;
  const I = (P * rateAnnual * years) / 100;
  return { interest: round2(I), total: round2(P + I) };
}

function calcCompound({ P, rateAnnual, months, frequency }) {
  const n = frequency === "MONTHLY" ? 12 : 1;
  const t = months / 12;
  const r = rateAnnual / 100;
  const A = P * Math.pow(1 + r / n, n * t);
  return { interest: round2(A - P), total: round2(A) };
}

function computeInterest({ principal, rateAnnual, durationMonths, frequency, interestType }) {
  const P = Number(principal);
  const months = Number(durationMonths);
  const r = Number(rateAnnual);
  if (!isFinite(P) || !isFinite(months) || !isFinite(r) || P < 0 || months < 0) {
    return { interest: 0, total: 0 };
  }
  if (interestType === "SIMPLE") return calcSimple({ P, rateAnnual: r, months });
  return calcCompound({ P, rateAnnual: r, months, frequency });
}

function computeOutstanding({ totalPayable, paymentsTotal }) {
  const out = Number(totalPayable) - Number(paymentsTotal || 0);
  return round2(Math.max(0, out));
}

module.exports = { computeInterest, computeOutstanding, round2 };
