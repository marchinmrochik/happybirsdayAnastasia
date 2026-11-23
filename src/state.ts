export const STORAGE_KEY = 'anastasia-birthday:v1';
export const wishes = ['Здоровья', 'Денег', 'Счастья', 'Любви', 'Удачи', 'Приключений'];
export type Lottery = { version: 1; order: number[]; opened: number[] };

function fresh(): Lottery {
  const order = wishes.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { version: 1, order, opened: [] };
}

export function loadLottery(): Lottery {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    const validIndex = (x: unknown) => Number.isInteger(x) && Number(x) >= 0 && Number(x) < 6;
    if (value?.version === 1 && Array.isArray(value.order) && value.order.length === 6 &&
      value.order.every(validIndex) && new Set(value.order).size === 6 &&
      Array.isArray(value.opened) && value.opened.length <= 3 &&
      value.opened.every(validIndex) && new Set(value.opened).size === value.opened.length) {
      return { version: 1, order: value.order, opened: value.opened };
    }
  } catch { /* Private browsing or invalid saved data: start safely. */ }
  return fresh();
}

export function saveLottery(value: Lottery): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; }
  catch { return false; }
}
