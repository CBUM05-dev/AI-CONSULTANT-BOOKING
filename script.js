const form = document.getElementById("audit-form");
const formError = document.getElementById("form-error");
const heroCta = document.getElementById("hero-cta");
const submitButton = form.querySelector(".submit-button");

function trackEvent(name) {
  if (window.dataLayer) {
    window.dataLayer.push({ event: name });
  }
}

heroCta.addEventListener("click", (event) => {
  event.preventDefault();
  trackEvent("cta_click");

  form.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    form.elements.name.focus();
  }, 250);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.trim();

  if (!name || !phone) {
    formError.textContent = "Please enter your name and WhatsApp or phone number.";
    return;
  }

  formError.textContent = "";
  trackEvent("form_submit");
  submitButton.disabled = true;
  submitButton.textContent = "Opening WhatsApp...";

  const whatsappMessage = [
    "Hi, I just requested the AI audit.",
    "",
    `Name: ${name}`,
    `WhatsApp / Phone: ${phone}`,
    "",
    "Please show me where I am losing time or money."
  ].join("\n");

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
  window.location.href = whatsappUrl;
});
