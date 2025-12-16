(function () {
  function initCombobox(container) {
    const input = container.querySelector(".combobox-input");
    const list = container.querySelector(".combobox-list");
    // Create dropdown toggle (chevron)
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "combobox-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle options");
    toggleBtn.innerHTML = '<i class="material-icons">arrow_drop_down</i>';
    container.appendChild(toggleBtn);
    // Create clear button
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "combobox-clear";
    clearBtn.setAttribute("aria-label", "Clear input");
    clearBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    container.appendChild(clearBtn);
    const hidden =
      container.querySelector('input[type="hidden"]') ||
      (function () {
        const h = document.createElement("input");
        h.type = "hidden";
        h.name = container.getAttribute("data-name") || "combobox_value";
        container.appendChild(h);
        return h;
      })();

    const options = Array.from(list.querySelectorAll('[role="option"]'));
    let activeIndex = -1;

    function updateClearVisibility() {
      if (input.value && input.value.length) {
        container.classList.add("has-value");
      } else {
        container.classList.remove("has-value");
      }
    }

    function open() {
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      container.classList.add("is-open");
    }
    function close() {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      setActive(-1);
      container.classList.remove("is-open");
    }
    function setActive(index) {
      options.forEach((opt, i) => {
        opt.classList.toggle("is-active", i === index);
      });
      activeIndex = index;
      if (index >= 0) {
        const opt = options[index];
        input.setAttribute("aria-activedescendant", opt.id);
        const r = opt.getBoundingClientRect();
        const lr = list.getBoundingClientRect();
        if (r.top < lr.top) opt.scrollIntoView({ block: "nearest" });
        if (r.bottom > lr.bottom) opt.scrollIntoView({ block: "nearest" });
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    }
    function selectOption(opt) {
      const value = opt.getAttribute("data-value") || opt.textContent.trim();
      input.value = opt.textContent.trim();
      hidden.value = value;
      options.forEach((o) => o.setAttribute("aria-selected", "false"));
      opt.setAttribute("aria-selected", "true");
      updateClearVisibility();
      close();
    }

    function filter() {
      const q = input.value.trim().toLowerCase();
      let anyVisible = false;
      options.forEach((opt) => {
        const match = opt.textContent.toLowerCase().includes(q);
        opt.style.display = match ? "" : "none";
        if (match) anyVisible = true;
      });
      let empty = list.querySelector(".combobox-empty");
      if (!anyVisible) {
        if (!empty) {
          empty = document.createElement("div");
          empty.className = "combobox-empty";
          empty.textContent = "No matches";
          list.appendChild(empty);
        }
      } else if (empty) {
        empty.remove();
      }
      setActive(-1);
      open();
    }

    input.addEventListener("focus", () => {
      filter();
      updateClearVisibility();
    });
    input.addEventListener("input", () => {
      filter();
      updateClearVisibility();
    });

    input.addEventListener("keydown", (e) => {
      const visible = options.filter((o) => o.style.display !== "none");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (list.hidden) open();
        const idx =
          activeIndex < 0 ? -1 : visible.indexOf(options[activeIndex]);
        const next = Math.min(visible.length - 1, idx + 1);
        setActive(
          next >= 0
            ? options.indexOf(visible[next])
            : options.indexOf(visible[0] || options[0])
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const idx =
          activeIndex < 0
            ? visible.length
            : visible.indexOf(options[activeIndex]);
        const prev = Math.max(0, idx - 1);
        setActive(
          prev <= visible.length - 1 ? options.indexOf(visible[prev]) : -1
        );
      } else if (e.key === "Enter") {
        if (activeIndex >= 0) {
          e.preventDefault();
          selectOption(options[activeIndex]);
        } else {
          close();
        }
      } else if (e.key === "Escape") {
        close();
      }
    });

    clearBtn.addEventListener("mousedown", (e) => {
      // prevent input blur
      e.preventDefault();
    });
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = "";
      hidden.value = "";
      filter();
      updateClearVisibility();
      input.focus();
    });

    // Toggle button interactions
    toggleBtn.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (list.hidden) {
        // Show full list when opening via toggle
        options.forEach((opt) => {
          opt.style.display = "";
        });
        const empty = list.querySelector(".combobox-empty");
        if (empty) empty.remove();
        setActive(-1);
        open();
        input.focus();
      } else {
        close();
        input.focus();
      }
    });

    options.forEach((opt) => {
      if (!opt.id) {
        opt.id = "cb-opt-" + Math.random().toString(36).slice(2);
      }
      opt.addEventListener("mousedown", (e) => {
        // mousedown to run before blur
        e.preventDefault();
        selectOption(opt);
      });
      opt.addEventListener("mousemove", () => {
        setActive(options.indexOf(opt));
      });
    });

    // Close on outside click
    document.addEventListener("mousedown", (e) => {
      if (!container.contains(e.target)) close();
    });

    // init state
    updateClearVisibility();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".combobox").forEach(initCombobox);
  });
})();
