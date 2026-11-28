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
      const finalValue = String(value ?? "").trim();
      if (finalValue) lines.push(`- ${label}: ${finalValue}`);
    });
    return lines;
  };

  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    window.RRConsultation?.bind(quoteForm, data => {
      const msg = buildWhatsAppMessage("Hola RR 3PL, quiero solicitar una propuesta de servicios logísticos:", {
        "Empresa / Nombre": data.get("empresa"),
        "Origen": data.get("origen"),
        "Destino": data.get("destino"),
        "Detalle": data.get("detalle"),
      });
      window.RRConsultation.whatsapp(msg);
    });
  }

  const workForm = document.getElementById("workForm");
  if (workForm) {
    window.RRConsultation?.bind(workForm, data => {
      const msg = buildWhatsAppMessage("Hola RR 3PL, quiero postularme para trabajar como cadete:", {
        "Nombre y apellido": data.get("nombre"),
        "Vehículo": data.get("vehiculo"),
        "Zona": data.get("zona"),
      });
      window.RRConsultation.whatsapp(msg);
    });
  }
});
