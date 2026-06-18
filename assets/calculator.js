(function () {
  const forms = document.querySelectorAll("[data-era-calculator]");
  const toInnings = (whole, outs) => {
    const w = Number.parseFloat(whole || "0");
    const o = Number.parseInt(outs || "0", 10);
    return Math.max(0, w) + Math.min(Math.max(o, 0), 2) / 3;
  };
  const format = (value) => {
    if (!Number.isFinite(value)) return "--";
    return value.toFixed(2);
  };
  const read = (form, name) => form.querySelector(`[name="${name}"]`);
  const rangeLabel = (input) => {
    const value = Number.parseFloat(input.value || "0");
    if (input.name === "outs" || input.name === "runOuts") {
      return `${value} ${value === 1 ? "out" : "outs"}`;
    }
    if (input.name === "targetEra" || input.name === "inningEra") {
      return value.toFixed(2);
    }
    if (input.name === "gameLength") {
      return Number.isInteger(value) ? String(value) : value.toFixed(1);
    }
    return String(Math.round(value));
  };

  forms.forEach((form) => {
    const modeInputs = form.querySelectorAll('input[name="mode"]');
    const rangeInputs = form.querySelectorAll('input[type="range"]');
    const result = form.closest(".tool-shell")?.querySelector("[data-result]");
    const formula = form.closest(".tool-shell")?.querySelector("[data-formula]");
    const note = form.closest(".tool-shell")?.querySelector("[data-note]");
    const groups = form.querySelectorAll("[data-mode-fields]");

    rangeInputs.forEach((input) => {
      if (input.parentElement?.classList.contains("range-control")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "range-control";
      input.before(wrapper);
      wrapper.append(input);
      const bubble = document.createElement("span");
      bubble.className = "range-bubble";
      bubble.setAttribute("aria-hidden", "true");
      wrapper.append(bubble);
    });

    function updateRangeOutputs() {
      rangeInputs.forEach((input) => {
        const min = Number.parseFloat(input.min || "0");
        const max = Number.parseFloat(input.max || "100");
        const value = Number.parseFloat(input.value || "0");
        const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
        const bubble = input.parentElement?.querySelector(".range-bubble");
        input.parentElement?.style.setProperty("--range-percent", `${percent}%`);
        if (bubble) bubble.textContent = rangeLabel(input);
        const output = form.querySelector(`output[for="${input.id}"]`);
        if (output) output.textContent = rangeLabel(input);
      });
    }

    function setMode() {
      const mode = form.querySelector('input[name="mode"]:checked')?.value || "era";
      groups.forEach((group) => {
        group.hidden = group.dataset.modeFields !== mode;
      });
      calculate();
    }

    function calculate() {
      const mode = form.querySelector('input[name="mode"]:checked')?.value || "era";
      const gameLength = Number.parseFloat(read(form, "gameLength")?.value || "9");
      let output = "--";
      let formulaText = "ERA = (Earned Runs x Game Innings) / Innings Pitched";
      let noteText = "Enter earned runs and innings pitched to calculate ERA.";

      if (mode === "era") {
        const earnedRuns = Number.parseFloat(read(form, "earnedRuns")?.value || "0");
        const innings = toInnings(read(form, "innings")?.value, read(form, "outs")?.value);
        output = innings > 0 ? format((earnedRuns * gameLength) / innings) : "--";
        formulaText = `${earnedRuns} x ${gameLength} / ${format(innings)} innings`;
        noteText = innings > 0 ? "ERA is normalized to your selected game length." : "Innings pitched must be greater than zero.";
      }

      if (mode === "runs") {
        const targetEra = Number.parseFloat(read(form, "targetEra")?.value || "0");
        const innings = toInnings(read(form, "runInnings")?.value, read(form, "runOuts")?.value);
        output = innings > 0 ? format((targetEra * innings) / gameLength) : "--";
        formulaText = `Earned Runs = ERA x Innings Pitched / ${gameLength}`;
        noteText = "This reverse calculation estimates earned runs allowed for a target ERA.";
      }

      if (mode === "innings") {
        const targetEra = Number.parseFloat(read(form, "inningEra")?.value || "0");
        const earnedRuns = Number.parseFloat(read(form, "inningRuns")?.value || "0");
        output = targetEra > 0 ? format((earnedRuns * gameLength) / targetEra) : "--";
        formulaText = `Innings Pitched = Earned Runs x ${gameLength} / ERA`;
        noteText = "The answer is decimal innings; .33 is one out and .67 is two outs.";
      }

      if (result) result.textContent = output;
      if (formula) formula.textContent = formulaText;
      if (note) note.textContent = noteText;
    }

    form.addEventListener("input", () => {
      updateRangeOutputs();
      calculate();
    });
    modeInputs.forEach((input) => input.addEventListener("change", setMode));
    form.addEventListener("reset", () => window.setTimeout(() => {
      updateRangeOutputs();
      setMode();
    }, 0));
    updateRangeOutputs();
    setMode();
  });
}());
