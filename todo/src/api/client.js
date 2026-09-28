import { SEED_DB } from "../data/seed.js";

// 서버 없이 브라우저 localStorage에 저장하는 저장소. json-server처럼 컬렉션 단위 CRUD를 제공한다.
// 모든 함수는 Promise를 반환해 훅(낙관적 업데이트, 실패 시 되돌리기)이 서버 API와 같은 방식으로 동작한다.
// 초기화하려면 개발자 도구에서 localStorage의 이 키를 지우고 새로고침한다.
export const STORAGE_KEY = "todo-app:db";

const STORAGE_ERROR = "브라우저 저장소를 사용할 수 없습니다. 사생활 보호 모드이거나 저장 공간이 부족한지 확인해 주세요.";

function loadDb() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    throw new Error(STORAGE_ERROR);
  }

  if (raw === null) {
    saveDb(SEED_DB); // 첫 실행: 예시 데이터로 시작
    return structuredClone(SEED_DB);
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("저장된 데이터가 손상되었습니다. localStorage의 todo-app:db 항목을 지우고 새로고침해 주세요.");
  }
}

function saveDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    throw new Error(STORAGE_ERROR);
  }
}

// json-server처럼 문자열 id를 만든다.
function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// 동기 로직을 Promise로 감싸, 던진 Error가 rejected Promise로 전달되게 한다.
const run = (task) =>
  new Promise((resolve) => {
    resolve(task());
  });

const findIndex = (items, id) => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("대상을 찾을 수 없습니다. (404)");
  return index;
};

export const list = (name) => run(() => loadDb()[name]);

export const insert = (name, data) =>
  run(() => {
    const db = loadDb();
    const created = { ...data, id: createId() };
    db[name].push(created);
    saveDb(db);
    return created;
  });

export const update = (name, id, patch) =>
  run(() => {
    const db = loadDb();
    const index = findIndex(db[name], id);
    db[name][index] = { ...db[name][index], ...patch };
    saveDb(db);
    return db[name][index];
  });

export const remove = (name, id) =>
  run(() => {
    const db = loadDb();
    db[name].splice(findIndex(db[name], id), 1);
    saveDb(db);
    return null;
  });
