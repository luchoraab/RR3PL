document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const topLine = document.getElementById("topLine");
  const menuButton = document.getElementById("menuButton");
  const mainNav = document.getElementById("mainNav");

  const updateScroll = () => {
    if (header) header.classList.toggle("compact", window.scrollY > 16);

    if (topLine) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      topLine.style.width = `${progress}%`;
    }
  };

  updateScroll();
  window.addEventListener("scroll", updateScroll);

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav) mainNav.classList.remove("open");
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-enhanced");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    document.querySelectorAll(".solution-card,.section-title,.process-grid article,.group-copy,.quote-copy").forEach(el=>observer.observe(el));
  }

  const buildWhatsAppMessage = (title, fields) => {
    const lines = [title, ""];
    Object.entries(fields).forEach(([label, value]) => {
      const finalValue = value && String(value).trim() ? String(value).trim() : "No informado";
      lines.push(`- ${label}: ${finalValue}`);
    });
    return encodeURIComponent(lines.join("\n"));
  };

  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(quoteForm);
      const msg = buildWhatsAppMessage("Hola RR 3PL, quiero solicitar una propuesta de servicios logísticos:", {
        "Empresa / Nombre": data.get("empresa"),
        "Teléfono": data.get("telefono"),
        "Servicio": data.get("servicio"),
        "Volumen estimado": data.get("volumen"),
        "Detalle": data.get("detalle"),
      });
      window.open(`https://wa.me/543517059319?text=${msg}`, "_blank");
    });
  }

  const workForm = document.getElementById("workForm");
  if (workForm) {
    workForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(workForm);
      const msg = buildWhatsAppMessage("Hola RR 3PL, quiero postularme para trabajar como cadete:", {
        "Nombre y apellido": data.get("nombre"),
        "Teléfono": data.get("telefono"),
        "Email": data.get("email"),
        "Vehículo": data.get("vehiculo"),
        "Zona": data.get("zona"),
        "Disponibilidad": data.get("disponibilidad"),
        "Experiencia / comentarios": data.get("comentarios"),
      });
      window.open(`https://wa.me/543517059319?text=${msg}`, "_blank");
    });
  }
});
