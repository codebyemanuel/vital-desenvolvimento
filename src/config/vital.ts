export type UnitSlug = "forca-vital" | "ct-general" | "vital-beach";
export type Unit = {
  slug: UnitSlug; name: string; category: string; number: string;
  headline: [string, string]; description: string; introduction: string;
  color: string; instagram: string; instagramHandle: string;
  phone: string | null; whatsapp: string | null; address: string | null;
  hours: { days: string; time: string }[]; plans: { name: string; price: string }[];
  modalities: { name: string; description: string }[];
  structure: string[]; photo: string; photoAlt: string; logo: string;
  gallery: { src: string; alt: string }[]; focalPoint: string;
};

// null e listas vazias representam dados ainda não confirmados. Não invente valores.
// Fotografia e logotipo são arquivos oficiais locais, nunca imagens de terceiros.
export const units: Unit[] = [
  {
    slug: "forca-vital", name: "Força Vital", category: "Musculação & fitness", number: "01",
    headline: ["A SUA FORÇA.", "EM EVOLUÇÃO."], color: "#dfbc71",
    description: "O próximo passo é seu. Um espaço para colocar o corpo em movimento e construir a sua evolução.",
    introduction: "Mais que uma rotina de treino, um compromisso com você. A Força Vital é a unidade de musculação e fitness do Grupo Vital: um convite para encontrar o seu ritmo, superar limites pessoais e seguir em frente.",
    instagram: "https://www.instagram.com/forcavitalfitness_/", instagramHandle: "@forcavitalfitness_",
    phone: null, whatsapp: null, address: null, hours: [], plans: [],
    modalities: [
      { name: "Musculação", description: "Força se constrói com constância. Conheça a proposta de treinamento da unidade." },
      { name: "Fitness", description: "Movimento e bem-estar para fazer parte da sua rotina. Consulte as atividades disponíveis." },
    ],
    structure: ["Ambiente dedicado à musculação", "Equipamentos de treinamento", "Mural com a identidade Força Vital"],
    photo: "/images/optimized/forca-vital/espaco.webp",
    photoAlt: "Ambiente real da Força Vital, com mural de uma mulher flexionando o braço, piso amadeirado e equipamento de musculação.",
    logo: "/logos/forca-vital/logo.webp", gallery: [], focalPoint: "48% 46%",
  },
  {
    slug: "ct-general", name: "CT General", category: "CrossFit & funcional", number: "02",
    headline: ["DISCIPLINA HOJE.", "EVOLUÇÃO SEMPRE."], color: "#c6b480",
    description: "Intensidade com propósito. Descubra uma nova relação com o treino e com os seus próprios limites.",
    introduction: "Cada movimento tem um propósito. O CT General é o centro de treinamento do Grupo Vital, com foco em CrossFit e treinamento funcional. Um espaço para trabalhar força, resistência e a vontade de evoluir.",
    instagram: "https://www.instagram.com/ct.general/", instagramHandle: "@ct.general",
    phone: null, whatsapp: null, address: null, hours: [], plans: [],
    modalities: [
      { name: "CrossFit", description: "Movimentos variados e desafios que convidam à evolução. Consulte a programação da unidade." },
      { name: "Treinamento funcional", description: "Trabalhe capacidades físicas por meio do movimento. Conheça a proposta do centro de treinamento." },
    ],
    structure: ["Estrutura para barras e argolas", "Cordas, anilhas e equipamentos de treino", "Área com piso emborrachado e remos"],
    photo: "/images/optimized/ct-general/espaco.webp",
    photoAlt: "Espaço real do CT General com barras, argolas, cordas, remos e anilhas em ambiente preto e amarelo.",
    logo: "/logos/ct-general/logo.webp", gallery: [], focalPoint: "50% 44%",
  },
  {
    slug: "vital-beach", name: "Vital Beach", category: "Futevôlei & esportes de areia", number: "03",
    headline: ["PÉS NA AREIA.", "ENERGIA LÁ EM CIMA."], color: "#f1cd53",
    description: "O encontro entre esporte e bons momentos. Sinta a energia da areia e faça parte desse movimento.",
    introduction: "A areia aproxima, o esporte conecta. A Vital Beach é o espaço do Grupo Vital para viver o futevôlei e os esportes de areia. Um convite para sair da rotina, aprender novos movimentos e compartilhar a quadra.",
    instagram: "https://www.instagram.com/vitalbeach_/", instagramHandle: "@vitalbeach_",
    phone: null, whatsapp: null, address: null, hours: [], plans: [],
    modalities: [
      { name: "Futevôlei", description: "Controle, movimento e conexão em cada troca de bola. Consulte as turmas disponíveis." },
      { name: "Esportes de areia", description: "Uma quadra, muitas possibilidades. Fale com a unidade para conhecer a programação." },
    ],
    structure: ["Quadra de areia ao ar livre", "Rede e materiais esportivos", "Mural esportivo na área da quadra"],
    photo: "/images/optimized/vital-beach/espaco.webp",
    photoAlt: "Quadra real da Vital Beach ao entardecer com areia, rede, bolas, mural esportivo e uma palmeira.",
    logo: "/logos/vital-beach/logo.webp", gallery: [], focalPoint: "50% 54%",
  },
];

export const site = {
  name: "Grupo Vital", title: "Três experiências. Uma força.",
  description: "Conheça o Grupo Vital: Força Vital, CT General e Vital Beach. Musculação, treinamento funcional e esportes de areia em três experiências conectadas pelo movimento.",
};

export function getSiteUrl(): URL | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url : undefined; }
  catch { return undefined; }
}

export function whatsappUrl(unit: Unit): string | null {
  const number = unit.whatsapp?.replace(/\D/g, "");
  return number && /^\d{10,15}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent(`Olá! Gostaria de conhecer a ${unit.name}.`)}`
    : null;
}
