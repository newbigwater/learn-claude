import { useMemo } from "react";

// 값의 '내용'이 같으면 이전과 같은 객체를 돌려준다.
// 파생 데이터(개수, 태그 목록 등)를 매번 새로 계산해도 내용이 같으면 memo된 자식이 다시 그려지지 않는다.
// JSON으로 직렬화 가능한 작은 값에만 사용한다.
export function useContentMemo(value) {
  const key = JSON.stringify(value);
  return useMemo(() => JSON.parse(key), [key]); // key가 value의 내용을 대표한다
}
