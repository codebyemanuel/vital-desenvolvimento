import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/forca-vital", "/ct-general", "/vital-beach"];
for (const route of routes) {
  test(`renderização, recursos e acessibilidade: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => { if (response.status() >= 400 && new URL(response.url()).hostname === "127.0.0.1") errors.push(`${response.status()} ${response.url()}`); });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/Grupo Vital/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator(".media-pending, .logo-pending")).toHaveCount(0);
    await expect(page.getByAltText(/^Logotipo oficial /)).toHaveCount(route === "/" ? 3 : 1);
    await page.evaluate(() => document.fonts.ready);
    for (const fraction of [.25, .5, .75, 1]) {
      await page.evaluate((n) => window.scrollTo(0, document.body.scrollHeight * n), fraction);
      await page.waitForTimeout(250);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Leve cada imagem lazy à área visível e aguarde o carregamento real,
    // incluindo a primeira otimização AVIF/WebP do servidor.
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el) => {
        const img = el as HTMLImageElement;
        return img.complete && img.naturalWidth > 0;
      }), { timeout: 15000, message: `Imagem não carregou: ${await image.getAttribute("src")}` }).toBe(true);
      await expect(image).toHaveAttribute("alt", /\S/);
    }
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("navegação entre as quatro páginas", async ({ page }) => {
  await page.goto("/");
  for (const [slug, name] of [["forca-vital", "Força Vital"], ["ct-general", "CT General"], ["vital-beach", "Vital Beach"]]) {
    await page.getByRole("link", { name: `Explorar unidade ${name}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${slug}$`));
    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("link", { name: "TODAS AS UNIDADES" }).click();
    await expect(page).toHaveURL(/\/#unidades$/);
  }
});

test("contatos reais e WhatsApp sem número oculto", async ({ page }) => {
  await page.goto("/forca-vital");
  const cta = page.getByRole("link", { name: /COMBINAR UMA VISITA/ });
  await expect(cta).toHaveAttribute("href", "https://www.instagram.com/forcavitalfitness_/");
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(page.getByText("Endereço a confirmar.")).toBeVisible();
});

test("menu móvel: foco, Escape e navegação", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Comportamento exclusivo do menu móvel");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Navegação móvel" })).toBeVisible();
  await expect(page.locator("#mobile-menu a").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Fechar menu" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#mobile-menu a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("navigation", { name: "Navegação móvel" }).getByRole("link", { name: /Vital Beach/ }).click();
  await expect(page).toHaveURL(/\/vital-beach$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("movimento reduzido mantém conteúdo e navegação", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const card = page.getByRole("link", { name: "Explorar unidade CT General", exact: true });
  await expect(card.getByText("EXPLORAR UNIDADE")).toBeVisible();
  expect(await page.locator(".marquee>div").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await card.click();
  await expect(page).toHaveURL(/\/ct-general$/);
});

test("galeria amplia fotografias e fecha com Escape", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Ampliar foto de/ })).toHaveCount(3);
  for (const [slug, name] of [["forca-vital", "Força Vital"], ["ct-general", "CT General"], ["vital-beach", "Vital Beach"]]) {
    const photo = page.getByRole("button", { name: `Ampliar foto de ${name}`, exact: true });
    await photo.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-label", `Fotografia de ${name}`);
    const image = dialog.locator("img");
    expect(new URL((await image.getAttribute("src"))!, "http://127.0.0.1:3000").searchParams.get("url")).toBe(`/images/optimized/${slug}/espaco.webp`);
    await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0), { timeout: 15000 }).toBe(true);
    await expect(page.getByRole("button", { name: "Fechar fotografia" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(photo).toBeFocused();
  }
});

test("404 personalizada e metadados", async ({ page, request }) => {
  const response = await page.goto("/pagina-inexistente");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /VOLTAR AO INÍCIO/ })).toBeVisible();
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("urlset");
});

test("telas compactas sem overflow", async ({ page }) => {
  for (const width of [320, 375, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} em ${width}px`).toBe(true);
      const h1 = page.locator("h1");
      const box = await h1.boundingBox();
      expect(box?.x).toBeGreaterThanOrEqual(0);
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width);
    }
  }
});
