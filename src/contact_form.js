document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  // Disable native browser validation to allow step-wise validation
  form.setAttribute("novalidate", "");

  // Create a lightweight status element appended after the form
  const status = document.createElement("div");
  status.setAttribute("aria-live", "polite");
  status.style.marginTop = "12px";
  status.style.fontSize = "14px";
  status.style.display = "none";
  form.after(status);

  // Elements (step grouping)
  const fullName = form.querySelector('[name="full_name"]');
  const email = form.querySelector('[name="email"]');
  const mobile = form.querySelector('[name="mobile"]');
  const company = form.querySelector('[name="company_name"]');

  const jobTitleWrap = form.querySelector(
    '.combobox[data-name="job_title"]'
  )?.parentElement;
  const industryWrap = form.querySelector(
    '.combobox[data-name="industry"]'
  )?.parentElement;
  const assetsWrap = form.querySelector(
    '.combobox[data-name="assets"]'
  )?.parentElement;
  const geographyWrap = form.querySelector(
    '.combobox[data-name="geography"]'
  )?.parentElement;
  const consent = form.querySelector("#consent-updates");
  const consentWrap = consent ? consent.closest("div") : null;

  const wrapOf = (el) => (el ? el.closest("div") : null);
  const step1Wrappers = [
    wrapOf(fullName),
    wrapOf(email),
    wrapOf(mobile),
    wrapOf(company),
  ].filter(Boolean);
  const step2Wrappers = [
    jobTitleWrap,
    industryWrap,
    assetsWrap,
    geographyWrap,
    consentWrap,
  ].filter(Boolean);

  // Ensure mandatory for step 1 as requested
  if (fullName) fullName.required = true;
  if (email) email.required = true;
  if (mobile) mobile.required = true;

  // Make the button read "PROCEED"
  const submitBtn = form.querySelector('button[type="submit"]');
  const setBtn = (text) => {
    if (!submitBtn) return;
    // keep icon on the right
    const icon = submitBtn.querySelector(".material-icons");
    submitBtn.textContent = text + " ";
    if (icon) submitBtn.appendChild(icon);
  };

  let currentStep = 1;
  function showStep(step) {
    const hide = (els) => els.forEach((w) => (w.style.display = "none"));
    const show = (els) => els.forEach((w) => (w.style.display = ""));
    if (step === 1) {
      show(step1Wrappers);
      hide(step2Wrappers);
      setBtn("PROCEED");
    } else {
      hide(step1Wrappers);
      show(step2Wrappers);
      setBtn("PROCEED");
    }
  }

  // Initialize view to step 1
  showStep(1);

  // Helpers
  function validateStep1() {
    status.style.display = "none";
    status.textContent = "";
    if (fullName && !fullName.value.trim()) {
      fullName.reportValidity?.();
      fullName.focus();
      return false;
    }
    if (email && !email.checkValidity()) {
      email.reportValidity?.();
      email.focus();
      return false;
    }
    if (mobile && !mobile.value.trim()) {
      mobile.setCustomValidity?.("Please enter a mobile number");
      mobile.reportValidity?.();
      mobile.setCustomValidity?.("");
      mobile.focus();
      return false;
    }
    return true;
  }

  function validateStep2() {
    status.style.display = "none";
    status.textContent = "";
    // assets required (from markup)
    const assetsInput = form.querySelector(
      '.combobox[data-name="assets"] .combobox-input'
    );
    if (
      assetsInput &&
      assetsInput.hasAttribute("required") &&
      !assetsInput.value.trim()
    ) {
      assetsInput.reportValidity?.();
      assetsInput.focus();
      return false;
    }
    if (consent && consent.hasAttribute("required") && !consent.checked) {
      status.textContent = "Please agree to be contacted to proceed.";
      status.style.color = "#B71C1C";
      status.style.display = "block";
      consent.focus();
      return false;
    }
    return true;
  }

  // Submit handling: step 1 -> advance, step 2 -> API call
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (!validateStep1()) return;
      currentStep = 2;
      showStep(2);
      return; // do not post on step 1
    }

    if (!validateStep2()) return;

    const originalText = submitBtn ? submitBtn.innerHTML : "";

    // Ensure hidden values exist for comboboxes; fallback to visible input value
    form.querySelectorAll(".combobox").forEach((box) => {
      const textInput = box.querySelector(".combobox-input");
      const hidden = box.querySelector('input[type="hidden"]');
      if (hidden && (!hidden.value || hidden.value.trim() === "")) {
        if (textInput && textInput.value.trim() !== "") {
          hidden.value = textInput.value.trim();
        }
      }
    });

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    // Basic UX: disable button and show posting state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      submitBtn.innerHTML = "Submitting...";
    }

    // Reset status
    status.style.display = "none";
    status.textContent = "";

    try {
      const res = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      // Redirect to success page
      window.location.href = "contact_success.html";
    } catch (err) {
      status.textContent = "Sorry, something went wrong. Please try again.";
      status.style.color = "#B71C1C"; // red
      status.style.display = "block";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.innerHTML = originalText;
      }
    }
  });
});
