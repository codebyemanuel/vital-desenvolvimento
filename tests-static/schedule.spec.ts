import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("grade completa da Força Vital preserva os 29 horários da foto", async ({ page }) => {
  await page.goto("/index.html#horarios");
  const schedule = page.locator("#horarios");
  await expect(schedule.getByRole("tab", { name: "Força Vital", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(schedule.locator(".schedule-slot")).toHaveCount(29);
  const expected: Record<string, string[]> = {
    segunda: ["07:00|Spinning", "07:30|G Local", "08:00|Alongamento", "18:00|Treinamento funcional", "19:00|Fit Dance", "19:00|Spinning", "20:00|Boxe"],
    terca: ["07:00|Treinamento funcional", "08:00|Ritmos / Zumba", "09:00|GAP", "18:00|Alongamento / Pilates no solo", "20:00|Glúteo"],
    quarta: ["07:00|Spinning", "07:30|G Local", "08:00|Alongamento", "18:00|Treinamento funcional", "19:00|Fit Dance", "19:00|Spinning", "20:00|Boxe", "21:00|Forró"],
    quinta: ["07:00|Treinamento funcional", "08:00|Ritmos / Zumba", "09:00|GAP", "18:00|Alongamento / Pilates no solo", "20:00|Glúteo"],
    sexta: ["07:00|Spinning", "07:30|G Local", "18:00|Treinamento funcional", "21:00|Forró"],
  };
  for (const [day, rows] of Object.entries(expected)) {
    const actual = await schedule.locator(`[data-schedule-day="${day}"] .schedule-slot`).evaluateAll((items) =>
      items.map((item) => `${(item as HTMLElement).dataset.start}|${(item as HTMLElement).dataset.activity}`));
    expect(actual).toEqual(rows);
  }
  await expect(schedule.locator(".schedule-slot[data-end]")).toHaveCount(0);
  await expect(schedule.locator('[data-period="manha"]')).toHaveCount(14);
  await expect(schedule.locator('[data-period="noite"]')).toHaveCount(15);
});

test("filtros de dia e período, com retorno à grade completa", async ({ page }) => {
  await page.goto("/index.html#horarios");
  const schedule = page.locator("#horarios");
  await schedule.getByLabel("Dia da semana").selectOption("sexta");
  await schedule.getByLabel("Período", { exact: true }).selectOption("manha");
  await expect(schedule.locator(".schedule-day")).toHaveCount(1);
  await expect(schedule.locator(".schedule-slot")).toHaveCount(2);
  await expect(schedule.locator(".schedule-activity")).toHaveText(["Spinning", "G Local"]);
  await schedule.getByLabel("Período", { exact: true }).selectOption("noite");
  await expect(schedule.locator(".schedule-activity")).toHaveText(["Treinamento funcional", "Forró"]);
  await schedule.getByLabel("Dia da semana").selectOption("domingo");
  await expect(schedule.locator(".schedule-slot")).toHaveCount(0);
  await expect(schedule.getByText("Não há horários informados para esta seleção.", { exact: false })).toBeVisible();
  await schedule.getByRole("button", { name: "VER TODOS OS HORÁRIOS" }).click();
  await expect(schedule.locator(".schedule-slot")).toHaveCount(29);
  await expect(schedule.getByLabel("Dia da semana")).toBeFocused();
});

test("Vital Beach separa funcional e futevôlei e preserva as duas turmas de sábado", async ({ page }) => {
  await page.goto("/index.html#horarios");
  const schedule = page.locator("#horarios");
  await schedule.getByRole("tab", { name: "Vital Beach", exact: true }).click();
  await expect(schedule.locator(".schedule-slot")).toHaveCount(36);
  await schedule.getByLabel("Modalidade", { exact: true }).selectOption("funcional");
  await expect(schedule.locator(".schedule-slot")).toHaveCount(6);
  const weekdayFunctional = await schedule.locator('.schedule-slot[data-start="19:00"]').count();
  expect(weekdayFunctional).toBe(2);
  await schedule.getByLabel("Dia da semana").selectOption("sabado");
  await expect(schedule.locator(".schedule-day")).toHaveCount(1);
  await expect(schedule.locator(".schedule-slot")).toHaveCount(2);
  await expect(schedule.locator(".schedule-day h3")).toHaveText("Sábado");
  await expect(schedule.locator(".schedule-activity-name")).toHaveText(["Funcional", "Funcional"]);
  const ranges = await schedule.locator(".schedule-slot").evaluateAll((items) => items.map((item) =>
    [(item as HTMLElement).dataset.start, (item as HTMLElement).dataset.end]));
  expect(ranges).toEqual([["07:00", "08:00"], ["08:00", "09:00"]]);
  await expect(schedule.locator(".schedule-note")).not.toContainText("conferência");
  await expect(schedule.getByRole("link", { name: "Consultar Vital Beach" })).toHaveAttribute("href", "https://www.instagram.com/vitalbeach_/");
});

test("futevôlei mantém categorias corrigidas, Kids e períodos livres", async ({ page }) => {
  await page.goto("/vital-beach/index.html#horarios");
  const schedule = page.locator("#horarios");
  await schedule.getByLabel("Modalidade", { exact: true }).selectOption("futevolei");
  await expect(schedule.locator(".schedule-slot")).toHaveCount(30);
  await expect(schedule.locator('.schedule-slot[data-kind="livre"]')).toHaveCount(5);
  await expect(schedule).not.toContainText("Iniciante B");
  const expected: Record<string, string[]> = {
    segunda: ["Iniciante A", "Livre", "Iniciante A", "Iniciante pró + Intermediário", "Iniciante A", "Intermediário"],
    terca: ["Iniciante A", "Livre", "KIDS", "Iniciante A / Iniciante pró", "Iniciante A / Iniciante pró", "Intermediário"],
    quarta: ["Iniciante A", "Livre", "Iniciante A", "Iniciante pró + Intermediário", "Iniciante A", "Intermediário"],
    quinta: ["Iniciante A", "Livre", "KIDS", "Iniciante A / Iniciante pró", "Iniciante A / Iniciante pró", "Intermediário"],
    sexta: ["Iniciante A", "Livre", "Iniciante A", "Iniciante A / Iniciante pró", "Iniciante A / Iniciante pró", "Intermediário"],
  };
  for (const [day, labels] of Object.entries(expected)) {
    const rows = schedule.locator(`[data-schedule-day="${day}"] .schedule-slot`);
    await expect(rows.locator(".schedule-activity-name")).toHaveText(labels);
    expect(await rows.evaluateAll((elements) => elements.map((e) => (e as HTMLElement).dataset.start)))
      .toEqual(["07:00", "08:00", "17:00", "18:00", "19:00", "20:00"]);
  }
});

test("CT General não recebe horários de outras unidades", async ({ page }) => {
  await page.goto("/index.html#horarios");
  const schedule = page.locator("#horarios");
  await schedule.getByRole("tab", { name: "CT General", exact: true }).click();
  await expect(schedule.locator(".schedule-slot")).toHaveCount(0);
  await expect(schedule.getByRole("heading", { name: "PROGRAMAÇÃO A CONFIRMAR." })).toBeVisible();
  await expect(schedule.getByLabel("Dia da semana")).not.toBeVisible();
  await expect(schedule.getByRole("link", { name: "Consultar CT General" })).toHaveAttribute("href", "https://www.instagram.com/ct.general/");
});

test("aba e grade também funcionam nas páginas individuais", async ({ page, isMobile }) => {
  for (const [slug, name, count] of [["forca-vital", "Força Vital", 29], ["ct-general", "CT General", 0], ["vital-beach", "Vital Beach", 36]] as const) {
    await page.goto(`/${slug}/index.html`);
    if (isMobile) await page.getByRole("button", { name: "Abrir menu" }).click();
    const nav = page.getByRole("navigation", { name: isMobile ? "Navegação móvel" : "Navegação principal" });
    await nav.getByRole("link", { name: "Horários", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${slug}/index.html#horarios$`));
    const schedule = page.locator("#horarios");
    await expect(schedule.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(schedule.locator(".schedule-slot")).toHaveCount(count);
    if (count) await expect(page.locator(".visit-details .activity-schedule-link")).toHaveAttribute("href", "#horarios");
  }
});

test("abas acessíveis por teclado e análise automática da programação", async ({ page }) => {
  await page.goto("/index.html#horarios");
  const schedule = page.locator("#horarios");
  await schedule.getByRole("tab", { name: "Força Vital", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(schedule.getByRole("tab", { name: "Vital Beach", exact: true })).toBeFocused();
  await expect(schedule.getByRole("tab", { name: "Vital Beach", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(schedule.getByRole("tab", { name: "Força Vital", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(schedule.getByRole("tab", { name: "CT General", exact: true })).toBeFocused();
  for (const name of ["Força Vital", "CT General", "Vital Beach"]) {
    await schedule.getByRole("tab", { name, exact: true }).click();
    const result = await new AxeBuilder({ page }).include("#horarios").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);
  }
});

test("grade inicial permanece no HTML sem JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [route, count] of [["index.html", 29], ["forca-vital/index.html", 29], ["vital-beach/index.html", 36], ["ct-general/index.html", 0]] as const) {
    await page.goto(`http://127.0.0.1:5500/${route}`);
    await expect(page.locator("#horarios .schedule-slot")).toHaveCount(count);
  }
  await context.close();
});
