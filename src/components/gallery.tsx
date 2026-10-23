"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

export type GalleryPhoto = { src: string; alt: string; name: string; label: string; focalPoint: string };
export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);
  if (!photos.length) return <div className="gallery-empty"><span className="eyebrow">IMAGENS OFICIAIS</span><p>Em breve, um olhar de perto sobre os nossos espaços.</p></div>;
  return <>
    <div className={`gallery-grid ${photos.length === 1 ? "gallery-single" : ""}`}>
      {photos.map((photo, i) => <button className="gallery-item" key={photo.src} aria-label={`Ampliar foto de ${photo.name}`} onClick={() => { setSelected(photo); dialogRef.current?.showModal(); }}>
        <Image src={photo.src} alt={photo.alt} fill sizes={photos.length === 1 ? "(max-width: 768px) 100vw, 75vw" : "(max-width: 768px) 100vw, 33vw"} style={{ objectFit: "cover", objectPosition: photo.focalPoint }} />
        <span className="gallery-index">0{i + 1}</span><span className="gallery-caption"><span>{photo.name}<small>{photo.label}</small></span><ArrowUpRight /></span>
      </button>)}
    </div>
    <dialog ref={dialogRef} className="lightbox" onClick={(e) => { if (e.target === e.currentTarget) dialogRef.current?.close(); }} aria-label={selected ? `Fotografia de ${selected.name}` : "Fotografia ampliada"}>
      <button className="lightbox-close" autoFocus onClick={() => dialogRef.current?.close()} aria-label="Fechar fotografia"><X /></button>
      {selected && <div className="lightbox-frame"><Image src={selected.src} alt={selected.alt} fill sizes="90vw" style={{ objectFit: "contain" }} /><p>{selected.name} — instalações reais</p></div>}
    </dialog>
  </>;
}
