export const packingKey = 'rainbow-packing-v1';
export const packingIds = ['shelter', 'sleep', 'water', 'bowl', 'weather', 'care', 'waste', 'return', 'music', 'work', 'notebook'];

export function readPacking(storage) {
  try {
    const saved = JSON.parse(storage.getItem(packingKey));
    return Array.isArray(saved) ? [...new Set(saved.filter(id => packingIds.includes(id)))] : [];
  } catch { return []; }
}

export function writePacking(storage, ids) {
  try { storage.setItem(packingKey, JSON.stringify(ids)); return true; }
  catch { return false; }
}
