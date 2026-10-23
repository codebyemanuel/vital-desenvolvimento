"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { units } from "@/config/vital";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
      if (event.key === "Tab") {
        const links = Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
        const first = links[0]; const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggleRef.current?.focus(); }
        else if (event.shiftKey && document.activeElement === toggleRef.current) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggleRef.current?.focus(); }
        else if (!event.shiftKey && document.activeElement === toggleRef.current) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(focusFrame); document.body.style.overflow = original; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Grupo Vital, início" onClick={() => setOpen(false)}>
        <span>GRUPO</span><strong>VITAL</strong>
      </Link>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <Link href="/#unidades">Nossas unidades</Link><Link href="/#essencia">O grupo</Link><Link href="/#espacos">Os espaços</Link>
      </nav>
      <Link href="/#unidades" className="header-cta">Encontre seu movimento <ArrowUpRight size={16} /></Link>
      <button ref={toggleRef} className="menu-toggle" aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
      <div className={`mobile-menu ${open ? "is-open" : ""}`} id="mobile-menu" ref={panelRef} inert={!open} aria-hidden={!open}>
        <nav aria-label="Navegação móvel">
          <span className="eyebrow">ESCOLHA SUA EXPERIÊNCIA</span>
          {units.map((unit) => <Link key={unit.slug} href={`/${unit.slug}`} aria-current={pathname === `/${unit.slug}` ? "page" : undefined} onClick={() => setOpen(false)}>
            <small>{unit.number}</small>{unit.name}<ArrowUpRight />
          </Link>)}
          <Link href="/#essencia" className="mobile-about" onClick={() => setOpen(false)}>Conheça o Grupo Vital</Link>
        </nav>
        <p>Três experiências. Uma força.</p>
      </div>
    </header>
  );
}
