# CampusConnect API

## Main endpoints
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/users`, `GET /api/users/me`, `PATCH /api/users/me`, `GET /api/users/:userId`
- `GET /api/posts`, `POST /api/posts`, `GET /api/posts/:postId`, `PATCH /api/posts/:postId`, `DELETE /api/posts/:postId`
- `POST /api/posts/:postId/like`, `DELETE /api/posts/:postId/like`
- `GET/POST /api/posts/:postId/comments`, `PATCH/DELETE /api/comments/:commentId`
- `GET/POST /api/resources`, `GET /api/resources/:resourceId`, `PATCH/DELETE /api/resources/:resourceId`
- `GET /api/health`

Protected routes require `Authorization: Bearer <token>`.
