export function SectionTitle({ number, label, title, description }: { number: string; label: string; title: string; description?: string }) {
  return <div className="section-heading" data-reveal><div><p className="eyebrow"><span>{number}</span> {label}</p><h2>{title}</h2></div>{description && <p className="section-description">{description}</p>}</div>;
}
