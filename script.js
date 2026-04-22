const revealElements = document.querySelectorAll(".section-reveal");

const reveal = (element) => element.classList.add("is-visible");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  revealElements.forEach((element) => {
    const { top } = element.getBoundingClientRect();

    if (top < window.innerHeight * 0.92) {
      reveal(element);
    } else {
      revealObserver.observe(element);
    }
  });
} else {
  revealElements.forEach(reveal);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const leadForm = document.querySelector(".lead-form");

if (leadForm) {
  const submitButton = leadForm.querySelector('button[type="submit"]');
  const statusElement = leadForm.querySelector(".form-status");
  const whatsappInput = leadForm.querySelector('input[name="whatsapp_local"]');
  const whatsappFullInput = leadForm.querySelector('input[name="whatsapp"]');
  const countryCodeSelect = leadForm.querySelector("#country-code");
  const customSelect = leadForm.querySelector("[data-custom-select]");
  const customSelectButton = customSelect ? customSelect.querySelector(".custom-select-button") : null;
  const customSelectLabel = leadForm.querySelector("#necessidade-label");
  const customSelectInput = leadForm.querySelector("#necessidade-value");
  const customSelectOptions = customSelect ? customSelect.querySelectorAll("[data-value]") : [];
  const countrySelect = leadForm.querySelector("[data-country-select]");
  const countrySelectButton = countrySelect ? countrySelect.querySelector(".custom-select-button") : null;
  const countrySelectLabel = leadForm.querySelector("#country-code-label");
  const countrySelectOptions = countrySelect ? countrySelect.querySelectorAll("[data-value]") : [];
  const nicheSelect = leadForm.querySelector("[data-niche-select]");
  const nicheSelectButton = nicheSelect ? nicheSelect.querySelector(".custom-select-button") : null;
  const nicheSelectLabel = leadForm.querySelector("#nicho-label");
  const nicheSelectInput = leadForm.querySelector("#nicho-value");
  const nicheSelectOptions = nicheSelect ? nicheSelect.querySelectorAll("[data-value]") : [];
  const otherNicheField = leadForm.querySelector("#other-niche-field");
  const otherNicheInput = leadForm.querySelector("#nicho-outro");
  const defaultButtonText = submitButton ? submitButton.textContent : "";

  const formatWhatsappLocal = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length === 0) {
      return "";
    }

    if (digits.length <= 2) {
      return `(${digits}${digits.length === 2 ? ")" : ""}`;
    }

    return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  };

  if (whatsappInput) {
    whatsappInput.addEventListener("input", () => {
      whatsappInput.value = formatWhatsappLocal(whatsappInput.value);
    });
  }

  const closeSelect = (selectElement, selectButton) => {
    if (!selectElement || !selectButton) {
      return;
    }

    selectElement.classList.remove("is-open");
    selectElement.closest(".form-field")?.classList.remove("is-select-open");
    selectButton.setAttribute("aria-expanded", "false");
  };

  const setupCustomSelect = ({ selectElement, selectButton, selectLabel, selectInput, options, onChange }) => {
    if (!selectElement || !selectButton || !selectInput) {
      return;
    }

    selectButton.addEventListener("click", () => {
      const isOpen = selectElement.classList.toggle("is-open");
      selectElement.closest(".form-field")?.classList.toggle("is-select-open", isOpen);
      selectButton.setAttribute("aria-expanded", String(isOpen));
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value || "";
        const label = option.textContent.trim();

        selectInput.value = value;

        if (selectLabel) {
          selectLabel.textContent = label;
        }

        options.forEach((currentOption) => {
          currentOption.setAttribute("aria-selected", String(currentOption === option));
        });

        selectElement.classList.remove("is-invalid");
        closeSelect(selectElement, selectButton);

        if (onChange) {
          onChange(value);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!selectElement.contains(event.target)) {
        closeSelect(selectElement, selectButton);
      }
    });

    selectButton.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSelect(selectElement, selectButton);
      }
    });
  };

  setupCustomSelect({
    selectElement: customSelect,
    selectButton: customSelectButton,
    selectLabel: customSelectLabel,
    selectInput: customSelectInput,
    options: customSelectOptions,
  });

  setupCustomSelect({
    selectElement: countrySelect,
    selectButton: countrySelectButton,
    selectLabel: countrySelectLabel,
    selectInput: countryCodeSelect,
    options: countrySelectOptions,
  });

  setupCustomSelect({
    selectElement: nicheSelect,
    selectButton: nicheSelectButton,
    selectLabel: nicheSelectLabel,
    selectInput: nicheSelectInput,
    options: nicheSelectOptions,
    onChange: (value) => {
      const isOther = value === "Outro";

      if (otherNicheField) {
        otherNicheField.classList.toggle("is-visible", isOther);
      }

      if (otherNicheInput) {
        otherNicheInput.required = isOther;

        if (!isOther) {
          otherNicheInput.value = "";
        } else {
          otherNicheInput.focus();
        }
      }
    },
  });

  window.handleLeadSubmit = async (event) => {
    event.preventDefault();

    if (leadForm.dataset.submitting === "true") {
      return false;
    }

    if (!leadForm.action) {
      return false;
    }

    if (!leadForm.reportValidity()) {
      return false;
    }

    if (nicheSelectInput && !nicheSelectInput.value) {
      if (statusElement) {
        statusElement.className = "form-status error";
        statusElement.textContent = "Selecione seu nicho para continuar.";
      }

      if (nicheSelect) {
        nicheSelect.classList.add("is-invalid", "is-open");
      }

      if (nicheSelectButton) {
        nicheSelectButton.setAttribute("aria-expanded", "true");
        nicheSelectButton.focus();
      }

      return false;
    }

    if (nicheSelectInput && otherNicheInput && nicheSelectInput.value === "Outro") {
      const otherNicheValue = otherNicheInput.value.trim();

      if (!otherNicheValue) {
        if (statusElement) {
          statusElement.className = "form-status error";
          statusElement.textContent = "Descreva seu nicho para continuar.";
        }

        otherNicheInput.focus();
        return false;
      }

      nicheSelectInput.value = otherNicheValue;
    }

    if (customSelectInput && !customSelectInput.value) {
      if (statusElement) {
        statusElement.className = "form-status error";
        statusElement.textContent = "Selecione uma necessidade para continuar.";
      }

      if (customSelect) {
        customSelect.classList.add("is-invalid", "is-open");
      }

      if (customSelectButton) {
        customSelectButton.setAttribute("aria-expanded", "true");
        customSelectButton.focus();
      }

      return false;
    }

    leadForm.dataset.submitting = "true";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }

    if (statusElement) {
      statusElement.className = "form-status";
      statusElement.textContent = "Enviando seus dados com segurança...";
    }

    const countryCode = countryCodeSelect ? countryCodeSelect.value.replace(/\D/g, "") : "55";
    const localWhatsappDigits = whatsappInput ? whatsappInput.value.replace(/\D/g, "") : "";

    if (whatsappFullInput) {
      whatsappFullInput.value = `${countryCode}${localWhatsappDigits}`;
    }

    try {
      const formData = new FormData(leadForm);
      const leadContext = {
        nicho: String(formData.get("nicho") || "").trim(),
        necessidade: String(formData.get("necessidade") || "").trim(),
      };

      try {
        window.sessionStorage.setItem("aphelioLeadContext", JSON.stringify(leadContext));
      } catch (storageError) {
        // The success page still works without storage; it just opens WhatsApp with the base message.
      }

      await fetch(leadForm.action, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(formData),
      });

      if (window.fbq) {
        window.fbq("track", "Lead");
      }

      if (statusElement) {
        statusElement.className = "form-status success";
        statusElement.textContent = "Diagnóstico enviado. Redirecionando...";
      }

      window.setTimeout(() => {
        const successParams = new URLSearchParams();

        if (leadContext.nicho) {
          successParams.set("nicho", leadContext.nicho);
        }

        if (leadContext.necessidade) {
          successParams.set("necessidade", leadContext.necessidade);
        }

        leadForm.reset();
        window.location.assign(`sucesso.html?${successParams.toString()}`);
      }, 700);
    } catch (error) {
      if (statusElement) {
        statusElement.className = "form-status error";
        statusElement.textContent = "Não foi possível enviar agora. Tente novamente em alguns instantes.";
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }

      leadForm.dataset.submitting = "false";
    }

    return false;
  };
}
