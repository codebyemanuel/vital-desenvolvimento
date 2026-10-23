import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, Instagram, MapPin, MessageCircle } from "lucide-react";
import { units, whatsappUrl } from "@/config/vital";
import { UnitLogo, UnitPhoto } from "@/components/media";
import { Gallery } from "@/components/gallery";
import { SectionTitle } from "@/components/section-title";
import { hasAsset } from "@/lib/assets";

export const dynamicParams = false;
export function generateStaticParams() { return units.map((u) => ({ unit: u.slug })); }
type Props = { params: Promise<{ unit: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unit: slug } = await params; const unit = units.find((u) => u.slug === slug);
  if (!unit) return {};
  return { title: unit.name, description: unit.description,
    alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: `/${unit.slug}` } : undefined,
    openGraph: { title: `${unit.name} | Grupo Vital`, description: unit.description,
      images: hasAsset(unit.photo) && process.env.NEXT_PUBLIC_SITE_URL ? [{ url: unit.photo, alt: unit.photoAlt }] : undefined },
  };
}
export default async function UnitPage({ params }: Props) {
  const { unit: slug } = await params; const unit = units.find((u) => u.slug === slug);
  if (!unit) notFound();
  const whatsapp = whatsappUrl(unit);
  const photos = [{ src: unit.photo, alt: unit.photoAlt }, ...unit.gallery].filter((p) => hasAsset(p.src)).map((p) => ({ ...p, name: unit.name, label: "Instalações reais", focalPoint: unit.focalPoint }));
  const others = units.filter((u) => u.slug !== slug);
  return <main id="conteudo" className={`unit-page theme-${unit.slug}`}>
    <section className="unit-hero" aria-labelledby="unit-title">
      <div className="unit-hero-media" data-parallax><UnitPhoto unit={unit} priority /></div><div className="unit-hero-shade" />
      <div className="unit-hero-top" data-enter><Link href="/#unidades" className="back-link"><ArrowLeft size={16} /> TODAS AS UNIDADES</Link><span className="eyebrow">{unit.number} / GRUPO VITAL</span></div>
      <div className="unit-hero-content"><div data-enter><UnitLogo unit={unit} large /><p className="eyebrow">{unit.name} · {unit.category}</p><h1 id="unit-title">{unit.headline[0]}<br /><span>{unit.headline[1]}</span></h1></div><div className="unit-hero-aside" data-enter><p>{unit.description}</p><a href="#contato" className="button button-accent">VENHA CONHECER <ArrowUpRight size={18} /></a></div></div>
      <a href="#sobre" className="unit-scroll"><ArrowDown size={16} /> DESCUBRA A {unit.name.toUpperCase()}</a>
    </section>
    <section className="section unit-about" id="sobre"><div data-reveal><p className="eyebrow"><span>01</span> A EXPERIÊNCIA</p><h2>SEU PRÓXIMO<br />PASSO COMEÇA<br /><span>AQUI.</span></h2></div><div className="unit-about-copy" data-reveal><p className="lead">{unit.introduction}</p><h3>Um espaço para o seu movimento</h3><ul className="structure-list">{unit.structure.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></div></section>
    <section className="section modalities-section"><SectionTitle number="02" label="ENCONTRE SEU RITMO" title="MOVIMENTO COM PROPÓSITO." /><div className="modalities-grid">{unit.modalities.map((m, i) => <article key={m.name} className="modality" data-reveal><span className="eyebrow">0{i + 1} /</span><ArrowUpRight aria-hidden="true" /><h3>{m.name}</h3><p>{m.description}</p></article>)}</div></section>
    <section className="section unit-gallery"><SectionTitle number="03" label="CONHEÇA O ESPAÇO" title="É AQUI QUE ACONTECE." description="Um olhar sobre as instalações reais. Toque na fotografia para ver cada detalhe." /><Gallery photos={photos} /></section>
    <section className="section visit-section" id="contato"><div className="visit-copy" data-reveal><p className="eyebrow"><span>04</span> VAMOS NOS CONHECER?</p><h2>O PRIMEIRO<br />MOVIMENTO<br /><span>É SEU.</span></h2><p>Fale com a {unit.name} para consultar horários, conhecer as atividades e combinar uma visita ou aula experimental.</p><div className="contact-buttons">{whatsapp && <a className="button button-accent" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> FALAR NO WHATSAPP <ArrowUpRight size={16} /></a>}<a className={`button ${whatsapp ? "button-outline" : "button-accent"}`} href={unit.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} /> {whatsapp ? "INSTAGRAM" : "COMBINAR UMA VISITA"}<ArrowUpRight size={16} /></a></div><p className="contact-handle">Converse com a unidade pelo Instagram: {unit.instagramHandle}</p></div><div className="visit-details" data-reveal><div><h3>HORÁRIOS</h3>{unit.hours.length ? <dl>{unit.hours.map((hour) => <div key={hour.days}><dt>{hour.days}</dt><dd>{hour.time}</dd></div>)}</dl> : <p>Programação a confirmar.<br />Consulte os horários diretamente com a unidade.</p>}</div><div><h3>LOCALIZAÇÃO</h3>{unit.address ? <p><MapPin size={16} /> {unit.address}</p> : <p>Endereço a confirmar.<br />Peça as orientações de chegada pelo Instagram.</p>}{unit.phone && <a href={`tel:${unit.phone.replace(/[^+\d]/g, "")}`}>{unit.phone}</a>}</div><div><h3>PLANOS E AULAS</h3>{unit.plans.length ? <dl>{unit.plans.map((plan) => <div key={plan.name}><dt>{plan.name}</dt><dd>{plan.price}</dd></div>)}</dl> : <p>Consulte planos, valores e disponibilidade de aula experimental com a equipe.</p>}</div></div></section>
    <section className="section other-units"><SectionTitle number="05" label="O MOVIMENTO CONTINUA" title="OUTRAS FORMAS DE IR ALÉM." /><div className="other-grid">{others.map((other) => <Link key={other.slug} href={`/${other.slug}`} className={`other-card theme-${other.slug}`}><div className="other-media">{hasAsset(other.photo) ? <Image src={other.photo} alt={other.photoAlt} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: other.focalPoint }} /> : <UnitPhoto unit={other} />}</div><div className="card-shade" /><div><p className="eyebrow">{other.category}</p><h3>{other.name}<ArrowUpRight /></h3></div></Link>)}</div></section>
  </main>;
}
