export function setLocalStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (item === null) return null;
  try {
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(e);
    return null;
  }
}
