import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { units } from "@/config/vital";
import { UnitLogo, UnitPhoto } from "@/components/media";
import { SectionTitle } from "@/components/section-title";
import { Gallery } from "@/components/gallery";
import { hasAsset } from "@/lib/assets";

export default function Home() {
  const photos = units.filter((u) => hasAsset(u.photo)).map((u) => ({ src: u.photo, alt: u.photoAlt, name: u.name, label: u.category, focalPoint: u.focalPoint }));
  return <main id="conteudo">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-overline" data-enter><span className="eyebrow"><i className="status-dot" /> SEU CORPO. SEU RITMO. SEU LUGAR.</span><span className="hero-edition">GRUPO VITAL — EM MOVIMENTO</span></div>
      <div className="hero-title-row"><h1 id="home-title" data-enter>TRÊS EXPERIÊNCIAS.<br /><span>UMA FORÇA.</span></h1><div className="hero-intro" data-enter><MoveUpRight strokeWidth={1} className="hero-arrow" /><p>Força para evoluir.<br />Energia para ir além.<br />Um lugar para ser você.</p></div></div>
      <div className="hero-units" id="unidades">
        {units.map((unit) => <Link href={`/${unit.slug}`} key={unit.slug} className={`experience-card theme-${unit.slug}`} aria-label={`Explorar unidade ${unit.name}`}>
          <div className="experience-media"><UnitPhoto unit={unit} priority sizes="(max-width: 760px) 100vw, 45vw" /></div>
          <div className="card-shade" /><div className="card-top"><span>{unit.number} /</span><UnitLogo unit={unit} /><ArrowUpRight className="card-top-arrow" size={21} /></div>
          <div className="card-content"><p className="card-category">{unit.category}</p><h2>{unit.name.toUpperCase()}</h2><div className="card-detail"><p>{unit.description}</p><span className="card-link">EXPLORAR UNIDADE <ArrowUpRight size={17} /></span></div></div>
        </Link>)}
      </div>
      <div className="hero-bottom"><a href="#essencia"><ArrowDown size={14} /> CONTINUE EM MOVIMENTO</a><span>01 MUSCULAÇÃO <b>·</b> 02 PERFORMANCE <b>·</b> 03 AREIA</span></div>
    </section>
    <div className="marquee" aria-hidden="true"><div>MOVIMENTO É VIDA <span>↗</span> VIVA A SUA MELHOR VERSÃO <span>↗</span> MOVIMENTO É VIDA <span>↗</span> VIVA A SUA MELHOR VERSÃO <span>↗</span></div></div>
    <section id="essencia" className="section essence-section">
      <div className="essence-label" data-reveal><p className="eyebrow"><span>01</span> NOSSA ESSÊNCIA</p><div className="essence-symbol" aria-hidden="true">↗</div></div>
      <div className="essence-copy" data-reveal><h2>NÃO É SÓ SOBRE<br />TREINAR.<br /><span>É SOBRE VIVER<br />EM MOVIMENTO.</span></h2><div className="essence-body"><p>Acreditamos na força de quem começa. Na energia de quem continua. E nas conexões que fazem cada passo valer a pena.</p><p>O Grupo Vital reúne três formas de se movimentar. Da musculação à intensidade do treinamento funcional, da superação pessoal à leveza de um jogo na areia. Encontre a experiência que combina com você.</p></div><a className="text-link" href="#unidades">CONHEÇA AS UNIDADES <ArrowUpRight size={18} /></a></div>
    </section>
    <section className="pillars-section" aria-label="Os pilares do Grupo Vital">{[{ word: "FORÇA", label: "Para construir a sua evolução.", unit: units[0] }, { word: "SUPERAÇÃO", label: "Para ir além do que você imagina.", unit: units[1] }, { word: "CONEXÃO", label: "Para dividir a energia do esporte.", unit: units[2] }].map((p) => <Link href={`/${p.unit.slug}`} key={p.word} className="pillar" data-reveal><span className="eyebrow">{p.unit.number} — {p.unit.name}</span><div><h3>{p.word}</h3><ArrowUpRight size={30} strokeWidth={1} /></div><p>{p.label}</p></Link>)}</section>
    <section className="section spaces-section" id="espacos"><SectionTitle number="02" label="POR DENTRO DO GRUPO" title="ESPAÇOS REAIS. NOVAS POSSIBILIDADES." description="Cada espaço tem sua identidade. Todos compartilham a mesma vontade: colocar a vida em movimento." /><Gallery photos={photos} /></section>
    <section className="join-section" data-reveal><div><p className="eyebrow">SEU PRÓXIMO CAPÍTULO COMEÇA AQUI</p><h2>QUAL É O SEU<br /><span>MOVIMENTO?</span></h2></div><a className="round-cta" href="#unidades" aria-label="Escolher uma unidade"><ArrowDownRight size={56} strokeWidth={1} /></a><p>Três experiências.<br />Escolha a sua e venha conhecer.</p></section>
  </main>;
}
