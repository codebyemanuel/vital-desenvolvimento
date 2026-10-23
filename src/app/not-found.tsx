import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return <main id="conteudo" className="error-page"><p className="eyebrow">404 / FORA DO PERCURSO</p><h1>VAMOS VOLTAR<br /><span>AO MOVIMENTO?</span></h1><p>Essa página não foi encontrada. As nossas três experiências continuam esperando por você.</p><Link href="/" className="button button-accent">VOLTAR AO INÍCIO <ArrowUpRight size={18} /></Link></main>;
}
