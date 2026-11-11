# nest-todo-study

Nest.js 백엔드 학습용 프로젝트. 로그인 + 할 일 관리 API.

프런트엔드 개발자가 백엔드 기본기를 익히려고 만들고 있습니다.
동작하는 것보다 **왜 그렇게 쓰는지**를 이해하는 데 중점을 뒀습니다.

## 구성

```
Next.js (Vercel)  →  Nest (Render)  →  Postgres (Neon)
                        ↑ 이 저장소
```

- 배포: https://nest-todo-study.onrender.com
- 무료 플랜이라 15분 유휴 후 잠듭니다. 첫 요청은 ~1분 걸릴 수 있습니다.

## 기술

| | |
|---|---|
| 프레임워크 | Nest 12 (ESM) |
| DB | PostgreSQL + TypeORM |
| 인증 | JWT (`@nestjs/jwt`) + bcrypt |
| 검증 | class-validator + ValidationPipe |
| 런타임 | Node 22 |

## API

| 메서드 | 주소 | 설명 | 인증 |
|---|---|---|---|
| `POST` | `/users` | 회원가입 | |
| `POST` | `/auth/login` | 로그인 → accessToken | |
| `POST` | `/todos` | 할 일 생성 | ✓ |
| `GET` | `/todos` | 내 할 일 목록 | ✓ |
| `PUT` | `/todos/:id` | 제목 수정 | ✓ |
| `PATCH` | `/todos/:id/done` | 완료 토글 | ✓ |
| `DELETE` | `/todos/:id` | 삭제 | ✓ |

인증이 필요한 주소는 헤더에 토큰을 담아 보냅니다.

```
Authorization: Bearer <accessToken>
```

### 제목 수정과 완료 체크를 나눈 이유

사용자 행동이 다릅니다. 제목 수정은 "편집 → 저장"이고, 완료 체크는 "체크박스 한 번"입니다.
하나의 `PUT`으로 묶으면 체크박스를 누를 때마다 "수정"이라는 의미가 붙습니다.

`PATCH /todos/:id/done`은 본문 없이 토글합니다. 체크박스는 누르면 뒤집히는 UI라
프런트가 현재 상태를 보낼 필요가 없습니다.

## 구조

```
src/
├── user/           회원가입, 비밀번호 해싱
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.entity.ts
│   └── dto/
├── auth/           로그인, 토큰 발급·검증
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   ├── current-user.decorator.ts
│   └── dto/
└── todo/           할 일 (작성자별)
    ├── todo.entity.ts
    └── dto/
```

도메인마다 모듈을 두고, `app.module`은 모듈만 import 합니다.
`auth`는 자기 테이블이 없어서 `UserService`를 주입받아 씁니다.

## 실행

```bash
npm install --legacy-peer-deps
npm run start:dev
```

`--legacy-peer-deps`가 필요합니다. Nest CLI 12가 Jest에서 Vitest로 바뀌면서
peer dependency 해석이 실패합니다.

### 환경변수

`.env` 파일을 만들고 두 값을 채웁니다.

```
DATABASE_URL=postgresql://...   # Neon pooled connection
JWT_SECRET=...                  # 아래 명령으로 생성
```

```bash
node -e 'console.log(require("crypto").randomBytes(32).toString("base64"))'
```

## 메모

- `synchronize: true`는 개발용입니다. 엔티티를 보고 테이블을 자동 생성하는데,
  컬럼을 지우면 데이터도 날아갑니다. 운영에서는 마이그레이션을 씁니다.
- ESM(`"type": "module"`)이라 import에 `.js` 확장자가 필요합니다.
  TypeScript 파일을 가리켜도 `.js`로 씁니다.
