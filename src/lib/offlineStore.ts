// IndexedDB-backed offline message queue
// Falls back to localStorage when IndexedDB is unavailable.

export interface OfflineMessage {
  id: string;
  type: 'private' | 'group';
  senderId: string;
  receiverId?: string;
  roomId?: string;
  content: string;
  isSos: boolean;
  createdAt: string;
  synced: boolean;
}

const DB_NAME  = 'vibeway_offline';
const DB_VER   = 1;
const STORE    = 'pending_messages';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror   = () => reject(req.error);
  });
}

export async function queueMessage(msg: Omit<OfflineMessage, 'id' | 'synced'>): Promise<string> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const record: OfflineMessage = { ...msg, id, synced: false };
  try {
    const db = await openDB();
    await new Promise<void>((res, rej) => {
      const tx  = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).add(record);
      req.onsuccess = () => res();
      req.onerror   = () => rej(req.error);
    });
  } catch {
    // Fallback to localStorage
    const key = `vw_offline_${id}`;
    localStorage.setItem(key, JSON.stringify(record));
  }
  return id;
}

export async function getPendingMessages(): Promise<OfflineMessage[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE, 'readonly');
      const index = tx.objectStore(STORE).index('synced');
      const req   = index.getAll(IDBKeyRange.only(false));
      req.onsuccess = () => resolve(req.result as OfflineMessage[]);
      req.onerror   = () => reject(req.error);
    });
  } catch {
    const msgs: OfflineMessage[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('vw_offline_')) {
        try { msgs.push(JSON.parse(localStorage.getItem(k)!)); } catch { /* skip */ }
      }
    }
    return msgs.filter((m) => !m.synced);
  }
}

export async function markSynced(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((res, rej) => {
      const tx    = db.transaction(STORE, 'readwrite');
      const store = tx.objectStore(STORE);
      const get   = store.get(id);
      get.onsuccess = () => {
        if (get.result) {
          get.result.synced = true;
          const put = store.put(get.result);
          put.onsuccess = () => res();
          put.onerror   = () => rej(put.error);
        } else res();
      };
      get.onerror = () => rej(get.error);
    });
  } catch {
    const k = `vw_offline_${id}`;
    const raw = localStorage.getItem(k);
    if (raw) {
      const obj = JSON.parse(raw);
      obj.synced = true;
      localStorage.setItem(k, JSON.stringify(obj));
    }
  }
}
