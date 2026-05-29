const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const progress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 20;
  navbar.classList.toggle("scrolled", scrolled);

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${pct}%`;
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  });
});

function buildWhatsAppMessage(title, fields) {
  const lines = [title, ""];
  Object.entries(fields).forEach(([key, value]) => {
    const finalValue = value && value.trim() ? value.trim() : "No informado";
    lines.push(`• ${key}: ${finalValue}`);
  });
  return encodeURIComponent(lines.join("\n"));
}

document.getElementById("quoteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const msg = buildWhatsAppMessage("Hola RR 3PL, quiero solicitar una cotización de servicios logísticos:", {
    "Empresa / Nombre": data.get("empresa"),
    "Teléfono": data.get("telefono"),
    "Servicio": data.get("servicio"),
    "Volumen estimado": data.get("volumen"),
    "Detalle": data.get("detalle"),
  });
  window.open(`https://wa.me/543517706684?text=${msg}`, "_blank");
});

document.getElementById("workForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const msg = buildWhatsAppMessage("Hola RR 3PL, quiero postularme para trabajar como cadete:", {
    "Nombre y apellido": data.get("nombre"),
    "Teléfono": data.get("telefono"),
    "Email": data.get("email"),
    "Vehículo": data.get("vehiculo"),
    "Zona": data.get("zona"),
    "Disponibilidad": data.get("disponibilidad"),
    "Experiencia / comentarios": data.get("comentarios"),
  });
  window.open(`https://wa.me/543517706684?text=${msg}`, "_blank");
});
