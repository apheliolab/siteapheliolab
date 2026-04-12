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
  const defaultButtonText = submitButton ? submitButton.textContent : "";

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!leadForm.action) {
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

    let sent = false;

    try {
      await fetch(leadForm.action, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(new FormData(leadForm)),
        keepalive: true,
      });

      if (window.fbq) {
        window.fbq("track", "Lead");
      }

      leadForm.reset();
      sent = true;

      if (statusElement) {
        statusElement.className = "form-status success";
        statusElement.textContent = "Diagnóstico enviado. Redirecionando...";
      }

      window.setTimeout(() => {
        window.location.href = "/sucesso";
      }, 700);
    } catch (error) {
      if (statusElement) {
        statusElement.className = "form-status error";
        statusElement.textContent = "Não foi possível enviar agora. Tente novamente em alguns instantes.";
      }
    } finally {
      if (submitButton && !sent) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    }
  });
}
