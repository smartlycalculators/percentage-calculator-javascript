const form = document.querySelector("#calculator-form");
const typeSelect = document.querySelector("#calculation-type");
const firstInput = document.querySelector("#first-value");
const secondInput = document.querySelector("#second-value");
const firstLabel = document.querySelector("#first-label");
const secondLabel = document.querySelector("#second-label");
const resultPanel = document.querySelector("#result-panel");
const resultValue = document.querySelector("#result-value");
const resultExplanation = document.querySelector("#result-explanation");

const modes = {
  "part-of-total": {
    firstLabel: "Part",
    secondLabel: "Total",
    firstPlaceholder: "25",
    secondPlaceholder: "100",
  },
  "percent-of-number": {
    firstLabel: "Percentage",
    secondLabel: "Number",
    firstPlaceholder: "15",
    secondPlaceholder: "240",
  },
  "percentage-change": {
    firstLabel: "Old value",
    secondLabel: "New value",
    firstPlaceholder: "80",
    secondPlaceholder: "100",
  },
};

function numberFormatter(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 4,
  }).format(value);
}

function calculate(mode, first, second) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return { ok: false, message: "Enter a valid number in both fields." };
  }

  if (mode === "part-of-total") {
    if (second === 0) {
      return { ok: false, message: "The total cannot be zero." };
    }
    const answer = (first / second) * 100;
    return {
      ok: true,
      answer: `${numberFormatter(answer)}%`,
      explanation: `${numberFormatter(first)} is ${numberFormatter(answer)}% of ${numberFormatter(second)}.`,
    };
  }

  if (mode === "percent-of-number") {
    const answer = (first / 100) * second;
    return {
      ok: true,
      answer: numberFormatter(answer),
      explanation: `${numberFormatter(first)}% of ${numberFormatter(second)} is ${numberFormatter(answer)}.`,
    };
  }

  if (first === 0) {
    return { ok: false, message: "The old value cannot be zero." };
  }

  const answer = ((second - first) / first) * 100;
  const direction = answer > 0 ? "increase" : answer < 0 ? "decrease" : "change";
  return {
    ok: true,
    answer: `${numberFormatter(Math.abs(answer))}% ${direction}`,
    explanation: `The value changed from ${numberFormatter(first)} to ${numberFormatter(second)}.`,
  };
}

function updateMode() {
  const mode = modes[typeSelect.value];
  firstLabel.textContent = mode.firstLabel;
  secondLabel.textContent = mode.secondLabel;
  firstInput.placeholder = mode.firstPlaceholder;
  secondInput.placeholder = mode.secondPlaceholder;
  resultPanel.hidden = true;
}

function showResult(result) {
  resultPanel.hidden = false;
  resultPanel.classList.toggle("error", !result.ok);

  if (!result.ok) {
    resultValue.textContent = "Check your input";
    resultExplanation.textContent = result.message;
    return;
  }

  resultValue.textContent = result.answer;
  resultExplanation.textContent = result.explanation;
}

typeSelect.addEventListener("change", updateMode);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const first = Number(firstInput.value);
  const second = Number(secondInput.value);
  showResult(calculate(typeSelect.value, first, second));
});

form.addEventListener("reset", () => {
  window.setTimeout(updateMode, 0);
});

updateMode();
