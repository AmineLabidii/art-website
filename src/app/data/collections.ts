import { Collection } from "./types";

export const COLLECTIONS: Collection[] = [
  {
    id: "abstrait",
    name: "Art Abstrait",
    tagline: "Le geste et l'émotion",
    description:
      "Des compositions vibrantes où la couleur devient langage. Chaque toile est une conversation entre le hasard et l'intention.",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "moderne",
    name: "Art Moderne",
    tagline: "Les lignes du présent",
    description:
      "Une sélection contemporaine, graphique et audacieuse, pensée pour les intérieurs qui affirment leur caractère.",
    image:
      "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "luxe",
    name: "Collection Luxe",
    tagline: "L'exception encadrée",
    description:
      "Pièces d'exception en édition limitée, finitions dorées et grands formats. L'art comme signature d'un lieu.",
    image:
      "https://images.unsplash.com/photo-1635141849017-c531949fb5b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "nature",
    name: "Collection Nature",
    tagline: "Le souffle du vivant",
    description:
      "Tons terreux, ombres végétales et matières organiques pour ramener la sérénité du dehors à l'intérieur.",
    image:
      "https://images.unsplash.com/photo-1658934475116-990b909c3038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "tunisien",
    name: "Inspiration Tunisienne",
    tagline: "Nos racines, notre lumière",
    description:
      "Une ode à la Méditerranée : bleus de Sidi Bou Saïd, ocres du désert et motifs hérités de nos artisans.",
    image:
      "https://images.unsplash.com/photo-1552312097-8ef75595e2a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "minimaliste",
    name: "Art Minimaliste",
    tagline: "Le silence maîtrisé",
    description:
      "L'essentiel, rien de plus. Des œuvres épurées où l'espace négatif devient aussi important que le trait.",
    image:
      "https://images.unsplash.com/photo-1761156254622-7b66649b1f69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "islamique",
    name: "Art Islamique",
    tagline: "La géométrie sacrée",
    description:
      "Calligraphies et arabesques revisitées avec élégance contemporaine, hommage à un patrimoine millénaire.",
    image:
      "https://images.unsplash.com/photo-1563882687284-b4381efc07f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export const collectionById = (id: string) =>
  COLLECTIONS.find((c) => c.id === id);
