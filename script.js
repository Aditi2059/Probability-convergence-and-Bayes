// script.js
(function () {
  'use strict';

  /* =========================================================
     1) LLN / CLT DEMO
     Draw n samples from N(0,1), compute sample mean & scaled value.
     Shows that the mean stabilises (LLN) while √n(mean-μ) stays O(1) (CLT).
     ========================================================= */

  const nSlider     = document.getElementById('nSlider');
  const nValue      = document.getElementById('nValue');
  const meanDisplay = document.getElementById('meanDisplay');
  const zDisplay    = document.getElementById('zDisplay');
  const resampleBtn = document.getElementById('resampleBtn');

  // Standard normal via Box–Muller
  function randomNormal() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function updateSimulation() {
    const n = parseInt(nSlider.value, 10);
    nValue.textContent = n;

    let sum = 0;
    for (let i = 0; i < n; i++) sum += randomNormal();

    const sampleMean = sum / n;
    const scaled = Math.sqrt(n) * sampleMean; // μ = 0, σ = 1

    meanDisplay.textContent = sampleMean.toFixed(4);
    zDisplay.textContent    = scaled.toFixed(4);
  }

  if (nSlider && resampleBtn) {
    nSlider.addEventListener('input', updateSimulation);
    resampleBtn.addEventListener('click', updateSimulation);
    updateSimulation(); // initial draw
  }

  /* =========================================================
     2) BAYES DEMO — Beta–Binomial updating
     Prior ~ Beta(α, β); observe s successes, f failures
     Posterior ~ Beta(α + s, β + f)
     ========================================================= */

  const alphaSlider     = document.getElementById('alphaSlider');
  const betaSlider      = document.getElementById('betaSlider');
  const succSlider      = document.getElementById('succSlider');
  const failSlider      = document.getElementById('failSlider');
  const alphaVal        = document.getElementById('alphaVal');
  const betaVal         = document.getElementById('betaVal');
  const succVal         = document.getElementById('succVal');
  const failVal         = document.getElementById('failVal');
  const posteriorDisplay = document.getElementById('posteriorDisplay');
  const postMean        = document.getElementById('postMean');
  const postCI          = document.getElementById('postCI');
  const resetBayes      = document.getElementById('resetBayes');

  // Normal approximation to the Beta credible interval
  function normalApproxCI(mean, sd) {
    const lower = Math.max(0, mean - 1.96 * sd);
    const upper = Math.min(1, mean + 1.96 * sd);
    return { lower, upper };
  }

  function updatePosterior() {
    if (!alphaSlider) return;

    const a = parseFloat(alphaSlider.value);
    const b = parseFloat(betaSlider.value);
    const s = parseInt(succSlider.value, 10);
    const f = parseInt(failSlider.value, 10);

    // Live label updates
    alphaVal.textContent = a;
    betaVal.textContent  = b;
    succVal.textContent  = s;
    failVal.textContent  = f;

    const alphaPost = a + s;
    const betaPost  = b + f;

    posteriorDisplay.textContent = `Beta(${alphaPost.toFixed(1)}, ${betaPost.toFixed(1)})`;

    const mean     = alphaPost / (alphaPost + betaPost);
    const variance = (alphaPost * betaPost) /
                     (Math.pow(alphaPost + betaPost, 2) * (alphaPost + betaPost + 1));
    const sd = Math.sqrt(variance);
    const { lower, upper } = normalApproxCI(mean, sd);

    postMean.textContent = mean.toFixed(3);
    postCI.textContent   = `[${lower.toFixed(3)}, ${upper.toFixed(3)}]`;
  }

  if (alphaSlider) {
    [alphaSlider, betaSlider, succSlider, failSlider].forEach((el) =>
      el.addEventListener('input', updatePosterior)
    );

    resetBayes.addEventListener('click', () => {
      alphaSlider.value = 2;
      betaSlider.value  = 2;
      succSlider.value  = 7;
      failSlider.value  = 3;
      updatePosterior();
    });

    updatePosterior(); // initial state
  }
})();