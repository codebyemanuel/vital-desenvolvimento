"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="conteudo" className="error-page"><p className="eyebrow">UMA PAUSA NO MOVIMENTO</p><h1>VAMOS TENTAR<br /><span>MAIS UMA VEZ?</span></h1><p>Não foi possível carregar esta página.</p><button className="button button-accent" onClick={reset}>TENTAR NOVAMENTE</button></main>;
}
