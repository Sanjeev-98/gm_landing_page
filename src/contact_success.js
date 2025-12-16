document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  // Create a lightweight status element appended after the form
  const status = document.createElement("div");
  status.setAttribute("aria-live", "polite");
  status.style.marginTop = "12px";
  status.style.fontSize = "14px";
  status.style.display = "none";
  form.after(status);

  form.addEventListener("submi", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
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

      // You can inspect the response if needed
      // const data = await res.json();

      status.textContent = "Thanks! We've received your request.";
      status.style.color = "#1B5E20"; // green
      status.style.display = "block";
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
