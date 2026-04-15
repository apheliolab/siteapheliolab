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
    { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
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
        leadForm.reset();
        window.location.href = "/sucesso";
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
