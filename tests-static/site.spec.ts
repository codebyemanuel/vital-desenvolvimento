import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/index.html", "/forca-vital/index.html", "/ct-general/index.html", "/vital-beach/index.html"];
const units = [["forca-vital", "Força Vital"], ["ct-general", "CT General"], ["vital-beach", "Vital Beach"]];

for (const route of pages) {
  test(`HTML, CSS, JS, imagens e acessibilidade: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    const remoteRequests: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("requestfailed", (r) => errors.push(r.url()));
    page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    page.on("request", (r) => { if (new URL(r.url()).hostname !== "127.0.0.1") remoteRequests.push(r.url()); });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/Grupo Vital/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByAltText(/^Logotipo oficial /)).toHaveCount(route === "/index.html" ? 3 : 1);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(17, 18, 15)");
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((e) => (e as HTMLImageElement).complete && (e as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect(image).toHaveAttribute("alt", /\S/);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
    expect(remoteRequests).toEqual([]);
    expect(await page.locator('script[src*="_next"], img[src*="_next"]').count()).toBe(0);
  });
}

test("navegação completa com caminhos relativos", async ({ page }) => {
  await page.goto("/index.html");
  for (const [slug, name] of units) {
    await page.getByRole("link", { name: `Explorar unidade ${name}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${slug}/index.html$`));
    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("link", { name: "TODAS AS UNIDADES" }).click();
    await expect(page).toHaveURL(/\/index.html#unidades$/);
  }
});

test("galeria das três fotos: foco, Escape e botão fechar", async ({ page }) => {
  await page.goto("/index.html");
  for (const [slug, name] of units) {
    const button = page.getByRole("button", { name: `Ampliar foto de ${name}`, exact: true });
    await button.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-label", `Fotografia de ${name}`);
    await expect(dialog.locator("img")).toHaveAttribute("src", new RegExp(`/public/images/optimized/${slug}/espaco.webp$`));
    await expect.poll(() => dialog.locator("img").evaluate((e) => (e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByRole("button", { name: "Fechar fotografia" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(button).toBeFocused();
  }
  await page.getByRole("button", { name: "Ampliar foto de Força Vital", exact: true }).click();
  await page.getByRole("button", { name: "Fechar fotografia" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("menu móvel mantém foco e navega", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Menu móvel não se aplica ao viewport desktop");
  await page.goto("/index.html");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.click();
  const first = page.locator("#mobile-menu a").first();
  await expect(first).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Fechar menu" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.getByRole("navigation", { name: "Navegação móvel" }).getByRole("link", { name: /Vital Beach/ }).click();
  await expect(page).toHaveURL(/\/vital-beach\/index.html$/);
  await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "false");
});

test("configuração central altera contatos e horários", async ({ page }) => {
  // Dados de teste são injetados apenas no navegador e não são salvos na entrega.
  await page.route("**/assets/js/config.js", async (route) => {
    const response = await route.fetch();
    const source = await response.text();
    await route.fulfill({ response, body: source + '\nObject.assign(window.VITAL_CONFIG.units[0], {name:"Unidade de teste", whatsapp:"5511999999999", address:"Endereço de teste", hours:[{days:"Dia de teste",time:"10h às 11h"}], plans:[{name:"Plano de teste",price:"Sob consulta"}]});' });
  });
  await page.goto("/forca-vital/index.html");
  await expect(page).toHaveTitle(/Unidade de teste/);
  await expect(page.getByRole("link", { name: /FALAR NO WHATSAPP/ })).toHaveAttribute("href", /wa.me\/5511999999999/);
  await expect(page.getByText("Endereço de teste", { exact: true })).toBeVisible();
  await expect(page.getByText("10h às 11h", { exact: true })).toBeVisible();
  await expect(page.getByText("Plano de teste", { exact: true })).toBeVisible();
});

test("dados ausentes e movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/forca-vital/index.html");
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: /COMBINAR UMA VISITA/ })).toHaveAttribute("href", "https://www.instagram.com/forcavitalfitness_/");
  await page.goto("/index.html");
  await expect(page.locator("h1")).toBeVisible();
  expect(await page.locator(".marquee>div").evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
  await page.getByRole("link", { name: "Explorar unidade CT General", exact: true }).click();
  await expect(page).toHaveURL(/\/ct-general\/index.html$/);
});

test("larguras de celular, tablet e desktop", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of pages) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} em ${width}px`).toBe(true);
    }
  }
});

test("HTML continua completo sem JavaScript e 404 fornecida", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5500/index.html");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explorar unidade Força Vital", exact: true })).toBeVisible();
  await page.goto("http://127.0.0.1:5500/404.html");
  await expect(page.getByRole("link", { name: /VOLTAR AO INÍCIO/ })).toBeVisible();
  await context.close();
});
