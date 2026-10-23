/* Grupo Vital — JavaScript nativo. Funciona com file:// e Live Server. */
(() => {
  "use strict";

  const rootURL = new URL("../../", document.currentScript.src);
  const config = window.VITAL_CONFIG;
  if (!config || !Array.isArray(config.units)) return;
  const units = config.units;
  const unitMap = new Map(units.map((unit) => [unit.slug, unit]));
  const current = unitMap.get(document.body.dataset.page);
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const assetURL = (path) => new URL(path, rootURL).href;
  const unitURL = (unit) => new URL(`${unit.slug}/index.html`, rootURL).href;
  const find = (selector, parent = document) => parent.querySelector(selector);
  const findAll = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  function element(tag, className, text) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text !== undefined) result.textContent = text;
    return result;
  }

  function setText(selector, value, parent = document) {
    const target = find(selector, parent);
    if (target) target.textContent = value;
  }

  // SVGs locais. Nenhum serviço externo ou biblioteca de ícones é necessário.
  function icon(name, size = 18) {
    const paths = {
      arrow: '<path d="M7 7h10v10M7 17 17 7"/>',
      check: '<path d="m20 6-11 11-5-5"/>',
      menu: '<path d="M4 5h16M4 12h16M4 19h16"/>',
      close: '<path d="m18 6-12 12M6 6l12 12"/>',
      instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
      message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [name, value] of Object.entries({
      width: size, height: size, viewBox: "0 0 24 24", fill: "none",
      stroke: "currentColor", "stroke-width": 1.7, "stroke-linecap": "round",
      "stroke-linejoin": "round", "aria-hidden": "true",
    })) svg.setAttribute(name, String(value));
    svg.innerHTML = paths[name] || paths.arrow;
    return svg;
  }

  function safeHTTPS(value) {
    try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; }
    catch { return null; }
  }

  function externalLink(label, url, className, iconName = "arrow") {
    const safe = safeHTTPS(url);
    if (!safe) return null;
    const link = element("a", className);
    link.href = safe;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(icon(iconName), document.createTextNode(label), icon("arrow", 16));
    return link;
  }

  // Configuração central: aplica dados sem injetar HTML fornecido pelo usuário.
  for (const image of findAll("img[data-photo], img[data-logo]")) {
    const logo = Boolean(image.dataset.logo);
    const unit = unitMap.get(image.dataset.logo || image.dataset.photo);
    if (!unit) continue;
    image.src = assetURL(logo ? unit.logo : unit.photo);
    image.alt = logo ? `Logotipo oficial ${unit.name}` : unit.photoAlt;
    if (!logo) image.style.objectPosition = unit.focalPoint;
  }

  for (const link of findAll("[data-unit-link]")) {
    const unit = unitMap.get(link.dataset.unitLink);
    if (!unit) continue;
    link.href = unitURL(unit);
    const title = find("h3", link);
    if (title) title.replaceChildren(document.createTextNode(unit.name), icon("arrow", 24));
    const category = find(".eyebrow", link);
    if (category && link.classList.contains("other-card")) category.textContent = unit.category;
    if (link.closest("#mobile-menu")) {
      link.replaceChildren(element("small", "", unit.number), document.createTextNode(unit.name), icon("arrow", 24));
    }
  }

  for (const link of findAll("[data-unit-social]")) {
    const unit = unitMap.get(link.dataset.unitSocial);
    if (!unit) continue;
    const url = safeHTTPS(unit.instagram);
    if (url) link.href = url;
    link.replaceChildren(document.createTextNode(unit.name), icon("arrow", 16), element("span", "sr-only", " no Instagram (abre em nova aba)"));
  }

  for (const card of findAll(".experience-card")) {
    const unit = unitMap.get(card.dataset.unit);
    if (!unit) continue;
    card.style.setProperty("--accent", unit.color);
    card.setAttribute("aria-label", `Explorar unidade ${unit.name}`);
    setText("h2", unit.name.toUpperCase(), card);
    setText(".card-category", unit.category, card);
    setText(".card-detail p", unit.description, card);
    setText(".card-top > span", `${unit.number} /`, card);
  }

  if (current) {
    find("main").style.setProperty("--accent", current.color);
    const heading = find("#unit-title");
    heading.replaceChildren(document.createTextNode(current.headline[0]), document.createElement("br"), element("span", "", current.headline[1]));
    setText(".unit-hero-content .eyebrow", `${current.name} · ${current.category}`);
    setText(".unit-hero-aside p", current.description);
    setText(".unit-hero-top > .eyebrow", `${current.number} / ${config.site.name}`);
    const scrollLink = find(".unit-scroll");
    scrollLink.replaceChildren(find("svg", scrollLink), document.createTextNode(`DESCUBRA ${current.slug === "ct-general" ? "O" : "A"} ${current.name.toUpperCase()}`));
    setText(".unit-about-copy .lead", current.introduction);
    const structure = find(".structure-list");
    structure.replaceChildren(...current.structure.map((text) => {
      const li = element("li"); li.append(icon("check", 17), document.createTextNode(text)); return li;
    }));
    find(".modalities-grid").replaceChildren(...current.modalities.map((item, index) => {
      const article = element("article", "modality");
      article.dataset.reveal = "";
      article.append(element("span", "eyebrow", `${String(index + 1).padStart(2, "0")} /`), icon("arrow", 24), element("h3", "", item.name), element("p", "", item.description));
      return article;
    }));
    setText(".visit-copy > p:not(.eyebrow):not(.contact-handle)", `Fale com a ${current.name} para consultar horários, conhecer as atividades e combinar uma visita ou aula experimental.`);
    setText(".contact-handle", `Converse com a unidade pelo Instagram: ${current.instagramHandle}`);
    const buttons = find(".contact-buttons");
    buttons.replaceChildren();
    const number = (current.whatsapp || "").replace(/\D/g, "");
    const hasWhatsApp = /^\d{10,15}$/.test(number);
    if (hasWhatsApp) buttons.append(externalLink("FALAR NO WHATSAPP", `https://wa.me/${number}?text=${encodeURIComponent(`Olá! Gostaria de conhecer a ${current.name}.`)}`, "button button-accent", "message"));
    const instagram = externalLink(hasWhatsApp ? "INSTAGRAM" : "COMBINAR UMA VISITA", current.instagram, `button ${hasWhatsApp ? "button-outline" : "button-accent"}`, "instagram");
    if (instagram) buttons.append(instagram);
    const details = findAll(".visit-details > div");
    function detail(index, values, fallback) {
      const section = details[index];
      const heading = find("h3", section);
      section.replaceChildren(heading);
      if (!values.length) { section.append(element("p", "", fallback)); return; }
      const dl = element("dl");
      for (const [label, value] of values) {
        const row = element("div"); row.append(element("dt", "", label), element("dd", "", value)); dl.append(row);
      }
      section.append(dl);
    }
    const hasActivities = Boolean(current.activitySchedule?.length);
    detail(0, current.hours.map((hour) => [hour.days, hour.time]), hasActivities
      ? "Confira a grade completa das atividades."
      : "Programação a confirmar. Consulte os horários diretamente com a unidade.");
    if (hasActivities) {
      if (!current.hours.length) find("h3", details[0]).textContent = "HORÁRIOS DAS ATIVIDADES";
      const scheduleLink = element("a", "activity-schedule-link", "VER PROGRAMAÇÃO");
      scheduleLink.href = "#horarios";
      scheduleLink.append(icon("arrow", 16));
      details[0].append(scheduleLink);
    }
    detail(1, [], current.address || "Endereço a confirmar. Peça as orientações de chegada pelo Instagram.");
    if (current.phone) {
      const phone = current.phone.replace(/[^+\d]/g, "");
      if (/^\+?\d{10,15}$/.test(phone)) {
        const link = element("a", "", current.phone); link.href = `tel:${phone}`; details[1].append(link);
      }
    }
    detail(2, current.plans.map((plan) => [plan.name, plan.price]), "Consulte planos, valores e disponibilidade de aula experimental com a equipe.");
  }

  // Galeria usa sempre arquivos reais locais; a ampliação mostra a composição inteira.
  const gallery = find(".gallery-grid");
  const dialog = find(".lightbox");
  if (gallery && dialog) {
    const photos = (current ? [current] : units).flatMap((unit) => [
      { src: unit.photo, alt: unit.photoAlt, name: unit.name, category: unit.category, focalPoint: unit.focalPoint },
      ...(current ? unit.gallery.map((photo) => ({ ...photo, name: unit.name, category: "Instalações reais", focalPoint: unit.focalPoint })) : []),
    ]);
    gallery.classList.toggle("gallery-single", photos.length === 1);
    gallery.replaceChildren(...photos.map((photo, index) => {
      const button = element("button", "gallery-item");
      button.type = "button";
      button.setAttribute("aria-label", `Ampliar foto de ${photo.name}`);
      const image = element("img", "absolute-photo");
      image.src = assetURL(photo.src); image.alt = photo.alt; image.loading = "lazy"; image.decoding = "async";
      image.style.objectFit = "cover"; image.style.objectPosition = photo.focalPoint;
      const caption = element("span", "gallery-caption");
      const label = element("span", "", photo.name);
      label.append(element("small", "", current ? "Instalações reais" : photo.category));
      caption.append(label, icon("arrow", 24));
      button.append(image, element("span", "gallery-index", String(index + 1).padStart(2, "0")), caption);
      button.addEventListener("click", () => {
        let frame = find(".lightbox-frame", dialog);
        if (!frame) { frame = element("div", "lightbox-frame"); dialog.append(frame); }
        const full = element("img", "lightbox-photo");
        full.src = assetURL(photo.src); full.alt = photo.alt;
        frame.replaceChildren(full, element("p", "", `${photo.name} — instalações reais`));
        dialog.setAttribute("aria-label", `Fotografia de ${photo.name}`);
        dialog.showModal();
        find(".lightbox-close", dialog).focus();
      });
      return button;
    }));
    find(".lightbox-close", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  }

  // Menu acessível: mantém foco no menu, fecha com Escape e não prende o scroll.
  const toggle = find(".menu-toggle");
  const menu = find("#mobile-menu");
  let menuOpen = false;
  let previousOverflow = "";
  function setMenu(open, restoreFocus = false) {
    menuOpen = open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    toggle.replaceChildren(icon(open ? "close" : "menu", 24));
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
    menu.setAttribute("aria-hidden", String(!open));
    if (open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (window.gsap && !motionPreference.matches) window.gsap.fromTo(findAll("a", menu), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, clearProps: "all" });
      requestAnimationFrame(() => find("a", menu).focus({ preventScroll: true }));
    } else {
      document.body.style.overflow = previousOverflow;
      if (restoreFocus) toggle.focus();
    }
  }
  toggle.addEventListener("click", () => setMenu(!menuOpen));
  for (const link of findAll("a", menu)) link.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (event) => {
    if (!menuOpen) return;
    if (event.key === "Escape") { setMenu(false, true); return; }
    if (event.key !== "Tab") return;
    const links = findAll("a", menu);
    const first = links[0], last = links[links.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) { event.preventDefault(); toggle.focus(); }
    else if (event.shiftKey && active === toggle) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && active === last) { event.preventDefault(); toggle.focus(); }
    else if (!event.shiftKey && active === toggle) { event.preventDefault(); first.focus(); }
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => { if (event.matches && menuOpen) setMenu(false); });

  // Metadados por página. URLs públicas só existem quando o domínio é real.
  document.title = document.body.dataset.page === "404" ? `Página não encontrada | ${config.site.name}` : current ? `${current.name} | ${config.site.name}` : `${config.site.name} | ${config.site.title}`;
  setText(".footer-wordmark", config.site.name.toUpperCase());
  setText(".footer-bottom > span:first-child", `© ${new Date().getFullYear()} ${config.site.name}`);
  const description = current ? current.description : config.site.description;
  for (const meta of findAll('meta[name="description"], meta[property="og:description"]')) meta.content = description;
  const publicURL = safeHTTPS(config.site.url);
  if (publicURL) {
    const url = new URL(current ? `${current.slug}/` : "", publicURL.endsWith("/") ? publicURL : publicURL + "/");
    const canonical = find('link[rel="canonical"]') || document.head.appendChild(element("link"));
    canonical.rel = "canonical"; canonical.href = url.href;
  }

  if (window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-enter]", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.11, ease: "power3.out", clearProps: "all" });
      findAll("[data-reveal]").forEach((target) => gsap.fromTo(target, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, ease: "power3.out", clearProps: "all",
        scrollTrigger: { trigger: target, start: "top 94%", once: true },
      }));
      findAll("[data-parallax]").forEach((target) => gsap.fromTo(target, { yPercent: -3 }, {
        yPercent: 3, ease: "none", scrollTrigger: { trigger: target.parentElement, start: "top bottom", end: "bottom top", scrub: 0.7 },
      }));
    });
  }
})();
