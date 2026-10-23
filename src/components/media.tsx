import Image from "next/image";
import { hasAsset } from "@/lib/assets";
import type { Unit } from "@/config/vital";

export function UnitPhoto({ unit, priority = false, sizes = "100vw", className = "" }: {
  unit: Unit; priority?: boolean; sizes?: string; className?: string;
}) {
  return hasAsset(unit.photo) ? (
    <Image src={unit.photo} alt={unit.photoAlt} fill sizes={sizes} priority={priority}
      className={`unit-photo ${className}`} style={{ objectPosition: unit.focalPoint }} />
  ) : (
    <div className={`media-pending ${className}`} role="img" aria-label={`Fotografia oficial da ${unit.name} pendente de importação`}>
      <span className="pending-grid" aria-hidden="true" />
      <span className="pending-note">{unit.name}<br /><small>Fotografia oficial aguardando importação</small></span>
    </div>
  );
}

export function UnitLogo({ unit, large = false }: { unit: Unit; large?: boolean }) {
  return hasAsset(unit.logo) ? (
    <div className={`unit-logo ${large ? "unit-logo-large" : ""}`}>
      <Image src={unit.logo} alt={`Logotipo oficial ${unit.name}`} fill sizes={large ? "180px" : "96px"} />
    </div>
  ) : <span className="logo-pending">Logotipo oficial pendente</span>;
}
