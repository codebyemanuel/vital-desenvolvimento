import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { units } from "@/config/vital";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-top"><Link className="footer-wordmark" href="/">GRUPO VITAL</Link><p>O movimento é seu.<br />A força é nossa.</p></div>
    <div className="footer-links">{units.map((unit) => <a key={unit.slug} href={unit.instagram} target="_blank" rel="noopener noreferrer">{unit.name}<ArrowUpRight size={16} /><span className="sr-only"> no Instagram (abre em nova aba)</span></a>)}</div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Grupo Vital</span><span>Força. Performance. Conexão.</span><a href="#top">Voltar ao topo ↑</a></div>
  </footer>;
}
