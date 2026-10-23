/* Horários das atividades. Dados editáveis em config.js; sem chamadas externas. */
(() => {
  "use strict";

  const units = window.VITAL_CONFIG?.units || [];
  const days = [
    ["segunda", "Segunda-feira"], ["terca", "Terça-feira"],
    ["quarta", "Quarta-feira"], ["quinta", "Quinta-feira"],
    ["sexta", "Sexta-feira"], ["sabado", "Sábado"], ["domingo", "Domingo"],
  ];
  const periods = [["manha", "Manhã"], ["tarde", "Tarde"], ["noite", "Noite"]];
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  for (const section of document.querySelectorAll("[data-activity-schedule]")) {
    const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
    const panel = section.querySelector('[role="tabpanel"]');
    const daySelect = section.querySelector('[name="schedule-day"]');
    const periodSelect = section.querySelector('[name="schedule-period"]');
    const modalitySelect = section.querySelector('[name="schedule-modality"]');
    const modalityFilter = section.querySelector('[data-modality-filter]');
    const grid = section.querySelector(".schedule-grid");
    const filters = section.querySelector(".schedule-filters");
    const count = section.querySelector(".schedule-status");
    const note = section.querySelector(".schedule-note");
    const contact = section.querySelector(".schedule-contact");
    let selected = units.find((unit) => unit.slug === section.dataset.initialUnit) || units[0];

    function render() {
      if (!selected) return;
      section.style.setProperty("--accent", selected.color);
      const entries = selected.activitySchedule || [];
      const modalities = [["futevolei", "Futevôlei"], ["funcional", "Funcional"]]
        .filter(([key]) => entries.some((entry) => entry.modality === key));
      const selectedModality = modalitySelect.value;
      modalitySelect.replaceChildren(...[["todas", "Todas as modalidades"], ...modalities].map(([value, label]) => {
        const option = make("option", "", label); option.value = value; return option;
      }));
      modalitySelect.value = modalities.some(([key]) => key === selectedModality) ? selectedModality : "todas";
      modalityFilter.hidden = modalities.length < 2;
      const filtered = entries.filter((entry) =>
        (daySelect.value === "todos" || entry.day === daySelect.value)
        && (periodSelect.value === "todos" || entry.period === periodSelect.value)
        && (modalitySelect.value === "todas" || entry.modality === modalitySelect.value));
      const selectedTab = tabs.find((tab) => tab.dataset.scheduleUnit === selected.slug);
      for (const tab of tabs) {
        const active = tab === selectedTab;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      }
      panel.setAttribute("aria-labelledby", selectedTab.id);
      filters.hidden = !entries.length;
      note.textContent = selected.activityScheduleNote || "";
      note.hidden = !note.textContent;
      contact.replaceChildren(document.createTextNode(`Consultar ${selected.name}`));
      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      for (const [name, value] of Object.entries({ width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.7", "aria-hidden": "true" })) arrow.setAttribute(name, value);
      const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      arrowPath.setAttribute("d", "M7 7h10v10M7 17 17 7");
      arrow.append(arrowPath);
      contact.append(arrow);
      contact.href = `https://www.instagram.com/${selected.instagramHandle.replace(/^@/, "")}/`;
      try {
        const url = new URL(selected.instagram);
        if (url.protocol === "https:") contact.href = url.href;
      } catch { /* O destino padrão é o perfil informado na configuração. */ }
      grid.replaceChildren();

      if (!filtered.length) {
        const empty = make("div", "schedule-empty");
        empty.append(make("span", "eyebrow", selected.name), make("h3", "", entries.length ? "VAMOS ENCONTRAR SEU HORÁRIO?" : "PROGRAMAÇÃO A CONFIRMAR."));
        empty.append(make("p", "", entries.length
          ? "Não há horários informados para esta seleção. Veja outros dias ou consulte a unidade."
          : "Os horários das atividades desta unidade ainda não foram informados. Fale com a equipe para conhecer a programação."));
        if (entries.length) {
          const reset = make("button", "text-link", "VER TODOS OS HORÁRIOS");
          reset.type = "button";
          reset.addEventListener("click", () => {
            daySelect.value = "todos";
            periodSelect.value = "todos";
            modalitySelect.value = "todas";
            render();
            daySelect.focus();
          });
          empty.append(reset);
        }
        grid.append(empty);
      } else {
        for (const [day, label] of days) {
          const slots = filtered.filter((entry) => entry.day === day);
          if (!slots.length) continue;
          const card = make("section", "schedule-day");
          card.dataset.scheduleDay = day;
          const headingID = `${section.id}-${day}`;
          card.setAttribute("aria-labelledby", headingID);
          const header = make("div", "schedule-day-header");
          const number = make("span", "schedule-day-index", String(days.findIndex(([key]) => key === day) + 1).padStart(2, "0"));
          number.setAttribute("aria-hidden", "true");
          const heading = make("h3", "", label);
          heading.id = headingID;
          header.append(number, heading, make("span", "schedule-day-count", `${slots.length} ${slots.length === 1 ? "opção" : "opções"}`));
          card.append(header);
          for (const [period, periodLabel] of periods) {
            const rows = slots.filter((entry) => entry.period === period).sort((a, b) => a.start.localeCompare(b.start));
            if (!rows.length) continue;
            const group = make("div", "schedule-period");
            group.append(make("h4", "", periodLabel));
            const list = make("ul", "schedule-list");
            for (const row of rows) {
              const item = make("li", "schedule-slot");
              item.dataset.activity = row.activity;
              item.dataset.start = row.start;
              item.dataset.period = row.period;
              if (row.modality) item.dataset.modality = row.modality;
              if (row.kind) item.dataset.kind = row.kind;
              const times = make("span", "schedule-time");
              const start = make("time", "", row.start);
              start.dateTime = row.start;
              times.append(start);
              if (row.end) {
                item.dataset.end = row.end;
                const end = make("time", "", row.end);
                end.dateTime = row.end;
                times.append(make("span", "schedule-time-separator", "às"), end);
              }
              const activity = make("span", "schedule-activity");
              activity.append(make("span", "schedule-activity-name", row.activity));
              if (row.modality && modalities.length > 1) {
                activity.append(make("small", "schedule-modality-tag", row.modality === "funcional" ? "Funcional" : "Futevôlei"));
              }
              item.append(times, activity);
              list.append(item);
            }
            group.append(list);
            card.append(group);
          }
          grid.append(card);
        }
      }
      const dayCount = new Set(filtered.map((entry) => entry.day)).size;
      grid.dataset.dayCount = String(dayCount);
      count.textContent = entries.length
        ? `${selected.name} · ${filtered.length} ${filtered.length === 1 ? "horário" : "horários"} em ${dayCount} ${dayCount === 1 ? "dia" : "dias"}`
        : `${selected.name} · programação a confirmar`;
    }

    function activate(tab, focus = false) {
      selected = units.find((unit) => unit.slug === tab.dataset.scheduleUnit);
      daySelect.value = "todos";
      periodSelect.value = "todos";
      modalitySelect.value = "todas";
      render();
      if (focus) tab.focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
      });
    });
    daySelect.addEventListener("change", render);
    periodSelect.addEventListener("change", render);
    modalitySelect.addEventListener("change", render);
    render();
  }
})();
