export type SortMode =
  | "name-asc"
  | "name-desc"
  | "visit-recent"
  | "visit-oldest"
  | "score-asc"
  | "score-desc";

export const DEFAULT_SORT_MODE: SortMode = "score-desc";
export const SORT_PREFERENCE_STORAGE_KEY = "ranking-gourmet-default-sort";
export const SORT_PREFERENCE_CHANGED_EVENT = "ranking-gourmet-sort-preference-changed";

export const SORT_OPTIONS: Array<{ value: SortMode; label: string; shortLabel: string }> = [
  { value: "score-desc", label: "Ranking por score: mayor a menor", shortLabel: "SCORE+" },
  { value: "score-asc", label: "Ranking por score: menor a mayor", shortLabel: "SCORE-" },
  { value: "visit-recent", label: "Visitas recientes", shortLabel: "REC." },
  { value: "visit-oldest", label: "Visitas antiguas", shortLabel: "ANT." },
  { value: "name-asc", label: "Nombre A-Z", shortLabel: "A-Z" },
  { value: "name-desc", label: "Nombre Z-A", shortLabel: "Z-A" },
];

export function isSortMode(value: string): value is SortMode {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function getSortOption(sortMode: SortMode) {
  return SORT_OPTIONS.find((option) => option.value === sortMode) ?? SORT_OPTIONS[0];
}

export function getStoredDefaultSortMode(): SortMode {
  if (typeof window === "undefined") {
    return DEFAULT_SORT_MODE;
  }

  const storedValue = window.localStorage.getItem(SORT_PREFERENCE_STORAGE_KEY);
  return storedValue && isSortMode(storedValue) ? storedValue : DEFAULT_SORT_MODE;
}

export function storeDefaultSortMode(sortMode: SortMode) {
  window.localStorage.setItem(SORT_PREFERENCE_STORAGE_KEY, sortMode);
  window.dispatchEvent(
    new CustomEvent(SORT_PREFERENCE_CHANGED_EVENT, {
      detail: sortMode,
    })
  );
}
