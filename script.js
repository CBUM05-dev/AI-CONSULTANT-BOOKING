const step1Form = document.getElementById("audit-form");
const step2Form = document.getElementById("audit-form-details");
const formError = document.getElementById("form-error");
const formError2 = document.getElementById("form-error-2");
const heroCta = document.getElementById("hero-cta");
const step2Submit = step2Form.querySelector(".submit-button");
const backButton = document.getElementById("back-to-step-1");
const stepIndicators = document.querySelectorAll(".form-step");
const formSection = document.querySelector(".form-section");

const state = {
  name: "",
  phone: "",
  activity: "",
  teamSize: "",
  painPoints: [],
  goal: "",
  headache: ""
};

function trackEvent(name) {
  if (window.dataLayer) {
    window.dataLayer.push({ event: name });
  }
}

function setStep(step) {
  stepIndicators.forEach((el) => {
    const n = Number(el.dataset.step);
    el.classList.toggle("is-active", n === step);
    el.classList.toggle("is-done", n < step);
  });
}

heroCta.addEventListener("click", (event) => {
  event.preventDefault();
  trackEvent("cta_click");
  formSection.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    const activeForm = step2Form.hidden ? step1Form : step2Form;
    const firstField = activeForm.querySelector("input, textarea");
    if (firstField) firstField.focus();
  }, 250);
});

step2Form.querySelectorAll(".chip-group").forEach((group) => {
  const mode = group.dataset.mode;
  const max = Number(group.dataset.max) || Infinity;

  group.querySelectorAll(".chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      const isPressed = chip.getAttribute("aria-pressed") === "true";
      if (mode === "single") {
        group.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        return;
      }
      if (!isPressed) {
        const selected = group.querySelectorAll('.chip[aria-pressed="true"]').length;
        if (selected >= max) return;
      }
      chip.setAttribute("aria-pressed", isPressed ? "false" : "true");
    });
  });
});

function readChipGroup(name) {
  const group = step2Form.querySelector(`.chip-group[data-name="${name}"]`);
  return [...group.querySelectorAll('.chip[aria-pressed="true"]')].map((c) => c.dataset.value);
}

step1Form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = step1Form.elements.name.value.trim();
  const phone = step1Form.elements.phone.value.trim();

  if (!name || !phone) {
    formError.textContent = "Please enter your name and WhatsApp or phone number.";
    return;
  }

  formError.textContent = "";
  state.name = name;
  state.phone = phone;
  trackEvent("form_step1_submit");

  step1Form.hidden = true;
  step2Form.hidden = false;
  setStep(2);
  formSection.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => step2Form.elements.activity.focus(), 250);
});

backButton.addEventListener("click", () => {
  step2Form.hidden = true;
  step1Form.hidden = false;
  setStep(1);
  formSection.scrollIntoView({ behavior: "smooth", block: "center" });
});

function maybeAutoAdvance() {
  if (step1Form.hidden) return;
  const name = step1Form.elements.name.value.trim();
  const phone = step1Form.elements.phone.value.trim();
  if (name && phone) {
    step1Form.requestSubmit();
  }
}

step1Form.elements.name.addEventListener("blur", maybeAutoAdvance);
step1Form.elements.phone.addEventListener("blur", maybeAutoAdvance);

step2Form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state.name || !state.phone) {
    step2Form.hidden = true;
    step1Form.hidden = false;
    setStep(1);
    formError.textContent = "Please enter your name and phone first.";
    formSection.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const activity = step2Form.elements.activity.value.trim();
  const teamSize = readChipGroup("teamSize")[0] || "";
  const painPoints = readChipGroup("painPoints");
  const goal = readChipGroup("goal")[0] || "";
  const headache = step2Form.elements.headache.value.trim();

  if (!activity || !teamSize || painPoints.length === 0 || !goal) {
    formError2.textContent = "Please complete all required questions.";
    return;
  }

  formError2.textContent = "";
  state.activity = activity;
  state.teamSize = teamSize;
  state.painPoints = painPoints;
  state.goal = goal;
  state.headache = headache;

  trackEvent("form_submit");
  step2Submit.disabled = true;
  step2Submit.textContent = "Opening WhatsApp...";

  const lines = [
    "Hi! I just requested my free AI audit.",
    "",
    "--- CONTACT ---",
    `Name: ${state.name}`,
    `Phone: ${state.phone}`,
    "",
    "--- BUSINESS ---",
    `Activity: ${state.activity}`,
    `Team size: ${state.teamSize}`,
    "",
    "--- WHERE TIME IS LOST ---",
    ...state.painPoints.map((p) => `- ${p}`),
    "",
    "--- MAIN GOAL ---",
    state.goal
  ];

  if (state.headache) {
    lines.push("", "--- BIGGEST HEADACHE ---", state.headache);
  }

  lines.push("", "Ready when you are.");

  const whatsappMessage = lines.join("\n");
  const whatsappUrl = `https://wa.me/212600087938?text=${encodeURIComponent(whatsappMessage)}`;
  window.location.href = whatsappUrl;
});
