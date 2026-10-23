import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Motion } from "@/components/motion";
import { getSiteUrl, site } from "@/config/vital";

const siteUrl = getSiteUrl();
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: `${site.name} | ${site.title}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name, title: site.title, description: site.description },
  twitter: { card: "summary_large_image" },
  robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#11120f" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body id="top"><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header />{children}<Footer /><Motion /></body></html>;
}
