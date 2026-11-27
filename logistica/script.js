document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const topLine = document.getElementById("topLine");

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
        "Origen": data.get("origen"),
        "Destino": data.get("destino"),
        "Detalle": data.get("detalle"),
      });
      window.location.assign(`https://wa.me/5493517059319?text=${msg}`);
    });
  }

  const workForm = document.getElementById("workForm");
  if (workForm) {
    workForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(workForm);
      const msg = buildWhatsAppMessage("Hola RR 3PL, quiero postularme para trabajar como cadete:", {
        "Nombre y apellido": data.get("nombre"),
        "Vehículo": data.get("vehiculo"),
        "Zona": data.get("zona"),
      });
      window.location.assign(`https://wa.me/5493517059319?text=${msg}`);
    });
  }
});
