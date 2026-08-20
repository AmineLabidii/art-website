const KEY = "atelier-my-orders";

/** Order references the current visitor has placed (client-side only). */
export function getMyOrderRefs(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addMyOrderRef(ref: string) {
  const refs = getMyOrderRefs();
  if (!refs.includes(ref)) {
    localStorage.setItem(KEY, JSON.stringify([ref, ...refs]));
  }
}
