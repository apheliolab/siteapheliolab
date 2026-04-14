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
  const configWebhookUrl = window.APHELIO_CONFIG && window.APHELIO_CONFIG.webhookUrl;
  const whatsappRedirectUrl =
    (window.APHELIO_CONFIG && window.APHELIO_CONFIG.whatsappRedirectUrl) || "https://wa.me/5535999096959";
  const submitButton = leadForm.querySelector('button[type="submit"]');
  const statusElement = leadForm.querySelector(".form-status");
  const whatsappInput = leadForm.querySelector('input[name="whatsapp_local"]');
  const whatsappFullInput = leadForm.querySelector('input[name="whatsapp"]');
  const countryCodeSelect = leadForm.querySelector("#country-code");
  const successModal = document.querySelector("#success-modal");
  const whatsappCount = document.querySelector("#whatsapp-count");
  const whatsappNow = document.querySelector("#whatsapp-now");
  const defaultButtonText = submitButton ? submitButton.textContent : "";

  if (configWebhookUrl) {
    leadForm.action = configWebhookUrl;
  }

  if (whatsappNow) {
    whatsappNow.href = whatsappRedirectUrl;
  }

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

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!leadForm.action) {
      return;
    }

    if (!leadForm.reportValidity()) {
      return;
    }

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
      HTMLFormElement.prototype.submit.call(leadForm);

      if (window.fbq) {
        window.fbq("track", "Lead");
      }

      if (statusElement) {
        statusElement.className = "form-status success";
        statusElement.textContent = "Diagnóstico enviado.";
      }

      if (successModal) {
        successModal.classList.add("is-visible");
        successModal.setAttribute("aria-hidden", "false");
      }

      let seconds = 3;

      if (whatsappCount) {
        whatsappCount.textContent = seconds;
      }

      const countdown = window.setInterval(() => {
        seconds -= 1;

        if (whatsappCount) {
          whatsappCount.textContent = seconds;
        }

        if (seconds <= 0) {
          window.clearInterval(countdown);
          leadForm.reset();
          window.location.href = whatsappRedirectUrl;
        }
      }, 1000);
    } catch (error) {
      if (statusElement) {
        statusElement.className = "form-status error";
        statusElement.textContent = "Não foi possível enviar agora. Tente novamente em alguns instantes.";
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    }
  });
}
