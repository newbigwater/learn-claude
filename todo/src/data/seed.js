// 첫 실행 때 localStorage에 넣는 예시 데이터 (구 db.json 내용)
export const SEED_DB = {
  "todos": [
    {
      "id": "1",
      "title": "React 공식 문서 읽기",
      "memo": "Hooks 챕터부터 정리",
      "completed": false,
      "categoryId": "1",
      "tags": [
        "react",
        "문서"
      ],
      "priority": "high",
      "dueDate": "2026-10-05",
      "createdAt": "2026-09-28T09:00:00.000Z",
      "updatedAt": "2026-09-28T09:00:00.000Z"
    },
    {
      "id": "2",
      "title": "주간 회의 자료 준비",
      "memo": "",
      "completed": false,
      "categoryId": "2",
      "tags": [
        "회의"
      ],
      "priority": "medium",
      "dueDate": "2026-09-30",
      "createdAt": "2026-09-28T09:10:00.000Z",
      "updatedAt": "2026-09-28T09:10:00.000Z"
    },
    {
      "id": "3",
      "title": "장보기",
      "memo": "우유, 달걀, 채소",
      "completed": true,
      "categoryId": "3",
      "tags": [],
      "priority": "low",
      "dueDate": null,
      "createdAt": "2026-09-27T18:00:00.000Z",
      "updatedAt": "2026-09-28T08:00:00.000Z"
    }
  ],
  "categories": [
    {
      "id": "1",
      "name": "학습",
      "color": "blue"
    },
    {
      "id": "2",
      "name": "업무",
      "color": "amber"
    },
    {
      "id": "3",
      "name": "개인",
      "color": "green"
    }
  ]
};
