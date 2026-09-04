---

# 🇷🇺 Русская версия

# Real-Time Chat & Notification Platform

Backend-платформа для чата и уведомлений в реальном времени, разработанная с использованием **Node.js, Express.js, PostgreSQL, Prisma, Redis, BullMQ и Socket.io**.

Приложение поддерживает личные и групповые чаты, обмен сообщениями в реальном времени, загрузку файлов, статусы прочтения сообщений, онлайн/офлайн статусы пользователей, индикатор набора текста, уведомления, отправку email, систему ролей и разрешений, Swagger-документацию, автоматические тесты и запуск через Docker.

---

# Возможности

## Аутентификация

- Регистрация пользователей
- Авторизация пользователей
- JWT-аутентификация
- Хеширование паролей с помощью bcrypt
- Защищённые маршруты
- Получение текущего пользователя
- Авторизация на основе ролей

---

## Пользователи

- Получение профиля текущего пользователя
- Изменение профиля
- Поиск пользователей
- Поддержка аватара
- Статус онлайн/офлайн
- Отслеживание времени последней активности

---

## Личные чаты

- Создание личного чата
- Защита от создания дублирующихся личных чатов
- Получение списка чатов пользователя
- Получение информации о конкретном чате

---

## Групповые чаты

- Создание групп
- Добавление участников
- Удаление участников
- Переименование группы
- Получение списка участников
- Изменение роли участника

Роли внутри группы:

```text
ADMIN
MEMBER
```

Администратор группы может управлять участниками и настройками группы.

---

## Сообщения

Поддерживаются:

- Отправка текстовых сообщений
- Доставка сообщений в реальном времени
- Ответы на сообщения
- Редактирование сообщений
- Удаление сообщений
- История сообщений
- Пагинация
- Поиск сообщений
- Фильтрация сообщений по типу
- Фильтрация по отправителю
- Отметка отдельного сообщения как прочитанного
- Отметка всего чата как прочитанного
- Индивидуальные статусы прочтения для пользователей

Поддерживаемые типы сообщений:

```text
TEXT
IMAGE
FILE
```

---

## Загрузка файлов

Система поддерживает:

- Загрузку файлов
- Загрузку изображений
- Локальное хранение файлов
- Раздачу статических файлов
- Сохранение информации о файле вместе с сообщением
- `multipart/form-data`

Название поля файла:

```text
file
```

---

# Общение в реальном времени

Для real-time взаимодействия используется **Socket.io**.

Поддерживаются:

- Сообщения в реальном времени
- Онлайн/офлайн статус
- Индикатор набора текста
- Комнаты чатов
- Персональные комнаты пользователей
- Несколько Socket-подключений одного пользователя
- События прочтения сообщений
- Уведомления в реальном времени

---

# Уведомления

Система уведомлений поддерживает:

- Получение уведомлений
- Получение количества непрочитанных уведомлений
- Отметку уведомления как прочитанного
- Отметку всех уведомлений как прочитанных
- Удаление уведомлений
- Уведомления в реальном времени
- Фоновую обработку уведомлений

---

# Фоновые задачи

Для фоновых задач используются:

- Redis
- BullMQ

Архитектура:

```text
Application
    ↓
BullMQ Queue
    ↓
Redis
    ↓
Notification Worker
    ↓
Email / Notification
```

Это позволяет выполнять тяжёлые или отложенные операции отдельно от основного HTTP-запроса.

---

# Email-уведомления

Для отправки email используется:

```text
Nodemailer
```

Система может отправлять email-уведомления пользователям, которые находятся офлайн.

---

# Безопасность

Backend включает следующие механизмы безопасности:

- JWT-аутентификация
- Хеширование паролей через bcrypt
- Helmet security headers
- CORS
- Rate Limiting
- Отдельный Rate Limit для аутентификации
- Ограничение размера request body
- Валидация входящих данных
- Авторизация на основе ролей
- Глобальная обработка ошибок
- Отключение заголовка `X-Powered-By`

---

# Валидация

Для валидации запросов используется:

```text
express-validator
```

Проверяются:

- Email
- Пароль
- Username
- UUID
- Сообщения
- Параметры пагинации
- Участники групп
- Роли
- ID уведомлений
- Загружаемые файлы

Пример ответа при ошибке:

```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

# Технологии

## Backend

- Node.js
- Express.js
- JavaScript

## База данных

- PostgreSQL
- Prisma ORM

## Real-Time

- Socket.io

## Cache / Queue

- Redis
- ioredis
- BullMQ

## Аутентификация

- JSON Web Token
- bcryptjs

## Загрузка файлов

- Multer

## Email

- Nodemailer

## Валидация

- express-validator

## Безопасность

- Helmet
- CORS
- express-rate-limit

## Документация

- Swagger
- OpenAPI

## Тестирование

- Jest
- Supertest
- socket.io-client

## DevOps

- Docker
- Docker Compose

---

# Структура проекта

```text
chat-app-backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │   ├── mailer.js
│   │   └── swagger.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── chats/
│   │   ├── messages/
│   │   └── notifications/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── queues/
│   │   ├── notification.queue.js
│   │   └── notification.worker.js
│   │
│   ├── socket/
│   ├── utils/
│   └── app.js
│
├── tests/
│   ├── helpers/
│   │   ├── auth.helper.js
│   │   ├── cleanup.helper.js
│   │   └── test-data.helper.js
│   │
│   ├── auth.test.js
│   ├── users.test.js
│   ├── chats.test.js
│   ├── messages.test.js
│   ├── notifications.test.js
│   ├── permissions.test.js
│   └── socket.test.js
│
├── uploads/
│
├── server.js
├── jest.setup.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.test
├── .env.docker
└── package.json
```

---

# Архитектура приложения

Проект использует модульную архитектуру.

Основные функциональные части разделены на отдельные модули:

```text
auth
users
chats
messages
notifications
```

Стандартный HTTP-запрос проходит следующий путь:

```text
Client
   ↓
Route
   ↓
Authentication
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

Для real-time взаимодействия:

```text
Client
   ↓
Socket.io
   ↓
JWT Authentication
   ↓
Socket Event
   ↓
Chat Room / User Room
   ↓
Connected Clients
```

Для фоновых задач:

```text
Application
   ↓
BullMQ Queue
   ↓
Redis
   ↓
Worker
   ↓
Email / Notification
```

---

# Требования

Для локального запуска необходимы:

- Node.js
- npm
- PostgreSQL
- Redis

Также инфраструктуру можно запустить через Docker.

Рекомендуется:

```text
Node.js 22+
PostgreSQL
Redis
Docker Desktop
```

---

# Установка

Клонируйте репозиторий:

```bash
git clone <repository-url>
```

Перейдите в директорию проекта:

```bash
cd chat-app-backend
```

Установите зависимости:

```bash
npm install
```

---

# Переменные окружения

Создайте файл:

```text
.env
```

Пример:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/chatdb?schema=public"

JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="7d"

REDIS_URL="redis://localhost:6379"

CLIENT_URL="http://localhost:5173"

EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-app-password"
```

> Никогда не добавляйте реальные пароли, JWT-секреты, данные базы и email credentials в публичный Git-репозиторий.

Для GitHub рекомендуется создать:

```text
.env.example
```

с безопасными placeholder-значениями.

---

# Настройка базы данных

Сгенерировать Prisma Client:

```bash
npx prisma generate
```

Применить migrations:

```bash
npx prisma migrate deploy
```

Для разработки:

```bash
npx prisma migrate dev
```

Заполнить базу тестовыми данными:

```bash
node prisma/seed.js
```

Проверить migrations:

```bash
npx prisma migrate status
```

---

# Запуск Backend

Development:

```bash
npm run dev
```

Обычный запуск:

```bash
npm start
```

После запуска API доступен по адресу:

```text
http://localhost:3000
```

---

# Health Check

```http
GET /health
```

Пример ответа:

```json
{
  "status": "OK",
  "message": "Chat API is running",
  "timestamp": "2026-09-02T12:35:27.125Z"
}
```

---

# API

Все защищённые endpoint-ы требуют JWT:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# Authentication API

## Регистрация

```http
POST /api/auth/register
```

Body:

```json
{
  "email": "user@example.com",
  "username": "exampleuser",
  "password": "123456"
}
```

## Авторизация

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

## Получение текущего пользователя

```http
GET /api/auth/me
```

---

# Users API

## Получить профиль

```http
GET /api/users/me
```

## Изменить профиль

```http
PATCH /api/users/me
```

Пример:

```json
{
  "username": "newusername",
  "avatar": "/uploads/avatar.jpg"
}
```

## Поиск пользователей

```http
GET /api/users/search?q=username
```

---

# Chats API

## Создать личный чат

```http
POST /api/chats/private
```

Body:

```json
{
  "userId": "USER_UUID"
}
```

Точное название параметра:

```text
userId
```

## Создать групповой чат

```http
POST /api/chats/group
```

Body:

```json
{
  "name": "Backend Developers",
  "memberIds": [
    "USER_UUID_1",
    "USER_UUID_2"
  ]
}
```

Точное название параметра:

```text
memberIds
```

## Получить список чатов

```http
GET /api/chats
```

## Получить чат

```http
GET /api/chats/:chatId
```

## Переименовать группу

```http
PATCH /api/chats/:chatId
```

Body:

```json
{
  "name": "New Group Name"
}
```

---

# Участники группы

## Получить участников

```http
GET /api/chats/:chatId/members
```

## Добавить участника

```http
POST /api/chats/:chatId/members
```

Body:

```json
{
  "memberId": "USER_UUID"
}
```

Обратите внимание: точное название параметра:

```text
memberId
```

а не `userId`.

## Удалить участника

```http
DELETE /api/chats/:chatId/members/:memberId
```

## Изменить роль участника

```http
PATCH /api/chats/:chatId/members/:memberId/role
```

Body:

```json
{
  "role": "ADMIN"
}
```

Допустимые значения:

```text
ADMIN
MEMBER
```

---

# Messages API

## Отправить сообщение

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "Hello!"
}
```

## Ответить на сообщение

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "Ответ на сообщение",
  "replyToId": "MESSAGE_UUID"
}
```

Точное название параметра:

```text
replyToId
```

## Получить историю сообщений

```http
GET /api/chats/:chatId/messages?page=1&limit=20
```

Поддерживаемые query-параметры:

```text
page
limit
search
type
senderId
```

Например:

```http
GET /api/chats/:chatId/messages?page=1&limit=20&search=hello&type=TEXT
```

## Редактировать сообщение

```http
PATCH /api/chats/messages/:messageId
```

Body:

```json
{
  "content": "Edited message"
}
```

## Удалить сообщение

```http
DELETE /api/chats/messages/:messageId
```

## Отметить сообщение как прочитанное

```http
PATCH /api/chats/messages/:messageId/read
```

## Отметить весь чат как прочитанный

```http
PATCH /api/chats/:chatId/read
```

---

# Отправка файлов

Endpoint:

```http
POST /api/chats/:chatId/messages/file
```

Тип:

```text
multipart/form-data
```

Обязательное поле:

```text
file
```

Дополнительные поля:

```text
content
replyToId
```

Пример:

```bash
curl -X POST \
  http://localhost:3000/api/chats/CHAT_ID/messages/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@example.png" \
  -F "content=Example image"
```

---

# Notifications API

## Получить уведомления

```http
GET /api/notifications
```

## Получить количество непрочитанных

```http
GET /api/notifications/unread-count
```

## Отметить уведомление как прочитанное

```http
PATCH /api/notifications/:notificationId/read
```

## Отметить все уведомления как прочитанные

```http
PATCH /api/notifications/read-all
```

## Удалить уведомление

```http
DELETE /api/notifications/:notificationId
```

---

# Socket.io

Подключение Socket.io защищено JWT-аутентификацией.

Пример подключения клиента:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "YOUR_JWT_TOKEN",
  },
});
```

---

# Socket.io Events

## Подключение к комнате чата

Клиент отправляет:

```js
socket.emit("join-chat", chatId);
```

Важно: передаётся непосредственно строка `chatId`, а не объект.

После успешного подключения сервер отправляет:

```text
joined-chat
```

Payload:

```json
{
  "chatId": "CHAT_UUID"
}
```

---

## Выход из комнаты

```js
socket.emit("leave-chat", chatId);
```

Сервер отправляет:

```text
left-chat
```

---

## Начало набора текста

```js
socket.emit("typing-start", chatId);
```

Другие участники получают:

```text
typing-start
```

Payload:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

---

## Окончание набора текста

```js
socket.emit("typing-stop", chatId);
```

Другие участники получают:

```text
typing-stop
```

Payload:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

Socket.io также используется для:

- Онлайн/офлайн статусов
- Новых сообщений
- Read events
- Уведомлений
- Нескольких одновременных подключений пользователя

---

# Docker

Полный backend stack можно запустить через Docker Compose.

Сборка и запуск:

```bash
docker compose up -d --build
```

Проверить контейнеры:

```bash
docker compose ps
```

Посмотреть логи backend:

```bash
docker compose logs backend --tail=50
```

Применить Prisma migrations:

```bash
docker compose exec backend npx prisma migrate deploy
```

Остановить контейнеры:

```bash
docker compose down
```

Docker Compose запускает:

```text
Backend
PostgreSQL
Redis
```

---

# Swagger API Documentation

После запуска backend Swagger UI доступен по адресу:

```text
http://localhost:3000/api-docs
```

Swagger позволяет просматривать и тестировать HTTP API через браузер.

---

# Тестирование

Для автоматического тестирования используются:

- Jest
- Supertest
- socket.io-client

Запуск всех тестов:

```bash
npm test
```

Текущий результат:

```text
Test Suites: 7 passed, 7 total
Tests:       38 passed, 38 total
Snapshots:   0 total
```

Тестовые наборы:

```text
auth.test.js
users.test.js
chats.test.js
messages.test.js
notifications.test.js
permissions.test.js
socket.test.js
```

Тесты покрывают:

- Authentication
- Users API
- Chats API
- Messages API
- Notifications API
- Group permissions
- Socket.io
- Online/offline status
- Typing events
- Несколько Socket-подключений

Для тестов используется отдельная база:

```text
chatdb_test
```

Автоматические тесты не должны выполняться на production-базе.

---

# Обработка ошибок

В приложении используется глобальный Error Handler.

Неизвестный endpoint:

```json
{
  "error": "Route not found: GET /api/unknown"
}
```

Некорректный JSON:

```json
{
  "error": "Invalid JSON"
}
```

Ошибка валидации:

```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

# Модели базы данных

Основные сущности:

```text
User
Chat
ChatMember
Message
MessageRead
Notification
```

Основные связи:

```text
User
 ├── Messages
 ├── Chat memberships
 ├── Notifications
 └── Message reads

Chat
 ├── Members
 └── Messages

Message
 ├── Sender
 ├── Chat
 ├── Reply
 └── Read receipts
```

---

# Безопасность проекта

Не добавляйте следующие файлы в публичный Git-репозиторий:

```text
.env
.env.test
.env.docker
```

Пример `.gitignore`:

```gitignore
node_modules

.env
.env.*
!.env.example

/generated/prisma

coverage
uploads/*
```

Все секретные данные должны храниться в переменных окружения.

Для production рекомендуется:

- Использовать сложный `JWT_SECRET`
- Использовать сложные пароли PostgreSQL
- Использовать HTTPS
- Разрешать CORS только доверенным доменам
- Не хранить email credentials в коде
- Использовать Secret Manager
- Регулярно обновлять зависимости
- Делать backup базы данных

---

# Статус проекта

Backend Core:

```text
100%
```

Автоматические тесты:

```text
38 / 38 passing
```

Текущее состояние:

```text
Authentication       ✅
Users                ✅
Private Chats        ✅
Group Chats          ✅
Messages             ✅
File Uploads         ✅
Read Receipts        ✅
Notifications        ✅
Socket.io            ✅
Redis                ✅
BullMQ                ✅
Email Notifications  ✅
Permissions          ✅
Validation           ✅
Security             ✅
Swagger              ✅
Docker               ✅
Automated Tests      ✅
```

---

# Возможные улучшения

В дальнейшем проект можно расширить:

- Refresh Tokens
- Отзыв Access Token
- CI/CD
- Production Deployment
- Structured Logging
- Monitoring
- Метрики
- Оптимизация запросов к базе данных
- Дополнительные database indexes
- Cloud Storage для файлов
- Реакции на сообщения
- Закреплённые сообщения
- Push Notifications
- API Versioning
- Дополнительные E2E-тесты

---

# Назначение проекта

Проект разработан как учебный и портфолио-проект для практики современной backend-разработки.

Он демонстрирует работу с:

- REST API
- Real-Time WebSocket communication
- Реляционной базой данных
- Очередями фоновых задач
- Redis
- Authentication и Authorization
- File Upload
- Docker
- Automated Testing
- API Documentation
- Backend Security

---

# Автор

**Nurlybek S**

Backend Developer

Основной стек проекта:

`Node.js` · `Express.js` · `PostgreSQL` · `Prisma` · `Redis` · `BullMQ` · `Socket.io` · `Docker`


-----------------------------------------------------------------------------------------

# Real-Time Chat & Notification Platform

A production-style backend for a real-time chat and notification platform built with Node.js, Express.js, PostgreSQL, Prisma, Redis, BullMQ, and Socket.io.

The application supports private and group chats, real-time messaging, file uploads, message read receipts, user presence, typing indicators, notifications, email delivery, role-based permissions, API documentation, automated testing, and Docker deployment.

---

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Current user authentication
- Role-based authorization

### Users

- Get current user profile
- Update profile
- Search users
- User avatar support
- Online/offline status
- Last seen tracking

### Private Chats

- Create private chats
- Prevent duplicate private conversations
- Retrieve user's chats
- Retrieve chat information

### Group Chats

- Create group chats
- Add members
- Remove members
- Rename groups
- View group members
- Change member roles

Group roles:

- `ADMIN`
- `MEMBER`

Group administrators can manage members and group settings.

### Messages

- Send text messages
- Real-time message delivery
- Reply to messages
- Edit messages
- Delete messages
- Message history
- Pagination
- Message search
- Filter messages by type
- Filter messages by sender
- Mark individual messages as read
- Mark entire chats as read
- Per-user read receipts

Supported message types:

- `TEXT`
- `IMAGE`
- `FILE`

### File Uploads

- Upload files and images
- Local file storage
- Static file serving
- File metadata stored with messages
- Multipart form-data support

Multipart field name:

```text
file
```

### Real-Time Communication

Socket.io is used for real-time communication.

Supported functionality includes:

- Real-time messages
- Online/offline presence
- Typing indicators
- Chat rooms
- Personal user rooms
- Multiple socket connections per user
- Read events
- Notification events

### Notifications

- Get notifications
- Get unread notification count
- Mark notification as read
- Mark all notifications as read
- Delete notifications
- Real-time notifications
- Background notification processing

### Background Jobs

BullMQ and Redis are used for asynchronous jobs.

The notification worker can process background tasks such as email notifications without blocking HTTP requests.

### Email Notifications

Nodemailer is used to send email notifications to offline users.

### Security

The backend includes:

- JWT authentication
- bcrypt password hashing
- Helmet security headers
- CORS protection
- API rate limiting
- Authentication rate limiting
- Request body size limits
- Input validation
- Role-based authorization
- Global error handling
- Hidden `X-Powered-By` header

### Validation

Request validation is implemented with `express-validator`.

Validation includes:

- Email validation
- Password validation
- Username validation
- UUID validation
- Message validation
- Pagination validation
- Group member validation
- Role validation
- Notification ID validation
- File validation

### API Documentation

Interactive API documentation is available through Swagger UI.

When the backend is running:

```text
http://localhost:3000/api-docs
```

### Automated Tests

The project uses:

- Jest
- Supertest
- socket.io-client

Current test result:

```text
Test Suites: 7 passed, 7 total
Tests:       38 passed, 38 total
Snapshots:   0 total
```

Tests cover:

- Authentication
- Users
- Chats
- Messages
- Notifications
- Group permissions
- Socket.io

---

# Tech Stack

## Backend

- Node.js
- Express.js
- JavaScript

## Database

- PostgreSQL
- Prisma ORM

## Real-Time

- Socket.io

## Cache / Queue

- Redis
- ioredis
- BullMQ

## Authentication

- JSON Web Token
- bcryptjs

## File Upload

- Multer

## Email

- Nodemailer

## Validation

- express-validator

## Security

- Helmet
- CORS
- express-rate-limit

## Documentation

- Swagger
- OpenAPI

## Testing

- Jest
- Supertest
- socket.io-client

## DevOps

- Docker
- Docker Compose

---

# Project Architecture

```text
chat-app-backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │   ├── mailer.js
│   │   └── swagger.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── chats/
│   │   ├── messages/
│   │   └── notifications/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── queues/
│   │   ├── notification.queue.js
│   │   └── notification.worker.js
│   │
│   ├── socket/
│   │
│   ├── utils/
│   │
│   └── app.js
│
├── tests/
│   ├── helpers/
│   │   ├── auth.helper.js
│   │   ├── cleanup.helper.js
│   │   └── test-data.helper.js
│   │
│   ├── auth.test.js
│   ├── users.test.js
│   ├── chats.test.js
│   ├── messages.test.js
│   ├── notifications.test.js
│   ├── permissions.test.js
│   └── socket.test.js
│
├── uploads/
│
├── server.js
├── jest.setup.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.test
├── .env.docker
└── package.json
```

---

# Architecture Overview

The project follows a modular architecture.

Each major feature is separated into its own module:

```text
auth
users
chats
messages
notifications
```

A typical request flows through:

```text
Client
  ↓
Route
  ↓
Authentication
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Real-time communication follows:

```text
Client
  ↓
Socket.io
  ↓
JWT Authentication
  ↓
Socket Event
  ↓
Chat Room / User Room
  ↓
Connected Clients
```

Background notifications follow:

```text
Application
  ↓
BullMQ Queue
  ↓
Redis
  ↓
Notification Worker
  ↓
Email / Notification Processing
```

---

# Requirements

Before running the project locally, install:

- Node.js
- npm
- PostgreSQL
- Redis

Alternatively, Docker can run the required infrastructure.

Recommended:

```text
Node.js 22+
PostgreSQL
Redis
Docker Desktop
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd chat-app-backend
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/chatdb?schema=public"

JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="7d"

REDIS_URL="redis://localhost:6379"

CLIENT_URL="http://localhost:5173"

EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-app-password"
```

> Never commit real passwords, database credentials, JWT secrets, or email credentials to Git.

For a public repository, create a `.env.example` containing placeholder values.

---

# Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate deploy
```

For development, migrations can be created with:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
node prisma/seed.js
```

Check migration status:

```bash
npx prisma migrate status
```

---

# Running the Backend

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The server runs at:

```text
http://localhost:3000
```

---

# Health Check

Endpoint:

```http
GET /health
```

Example response:

```json
{
  "status": "OK",
  "message": "Chat API is running",
  "timestamp": "2026-09-02T12:35:27.125Z"
}
```

---

# API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

Body:

```json
{
  "email": "user@example.com",
  "username": "exampleuser",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### Current authenticated user

```http
GET /api/auth/me
```

---

# Users

### Get profile

```http
GET /api/users/me
```

### Update profile

```http
PATCH /api/users/me
```

Example:

```json
{
  "username": "newusername",
  "avatar": "/uploads/avatar.jpg"
}
```

### Search users

```http
GET /api/users/search?q=username
```

---

# Chats

## Create Private Chat

```http
POST /api/chats/private
```

Body:

```json
{
  "userId": "USER_UUID"
}
```

The parameter name must be:

```text
userId
```

## Create Group

```http
POST /api/chats/group
```

Body:

```json
{
  "name": "Backend Developers",
  "memberIds": [
    "USER_UUID_1",
    "USER_UUID_2"
  ]
}
```

The parameter name is:

```text
memberIds
```

## Get Chats

```http
GET /api/chats
```

## Get Chat

```http
GET /api/chats/:chatId
```

## Rename Group

```http
PATCH /api/chats/:chatId
```

Body:

```json
{
  "name": "New Group Name"
}
```

---

# Group Members

## Get Members

```http
GET /api/chats/:chatId/members
```

## Add Member

```http
POST /api/chats/:chatId/members
```

Body:

```json
{
  "memberId": "USER_UUID"
}
```

The parameter is intentionally named:

```text
memberId
```

## Remove Member

```http
DELETE /api/chats/:chatId/members/:memberId
```

## Change Member Role

```http
PATCH /api/chats/:chatId/members/:memberId/role
```

Body:

```json
{
  "role": "ADMIN"
}
```

Allowed values:

```text
ADMIN
MEMBER
```

---

# Messages

## Send Message

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "Hello!"
}
```

## Reply to Message

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "This is a reply",
  "replyToId": "MESSAGE_UUID"
}
```

## Message History

```http
GET /api/chats/:chatId/messages?page=1&limit=20
```

Supported query parameters:

```text
page
limit
search
type
senderId
```

Example:

```http
GET /api/chats/:chatId/messages?page=1&limit=20&search=hello&type=TEXT
```

## Edit Message

```http
PATCH /api/chats/messages/:messageId
```

Body:

```json
{
  "content": "Edited message"
}
```

## Delete Message

```http
DELETE /api/chats/messages/:messageId
```

## Mark Message as Read

```http
PATCH /api/chats/messages/:messageId/read
```

## Mark Chat as Read

```http
PATCH /api/chats/:chatId/read
```

---

# File Messages

Endpoint:

```http
POST /api/chats/:chatId/messages/file
```

Content-Type:

```text
multipart/form-data
```

File field:

```text
file
```

Optional fields:

```text
content
replyToId
```

Example using curl:

```bash
curl -X POST \
  http://localhost:3000/api/chats/CHAT_ID/messages/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@example.png" \
  -F "content=Example image"
```

---

# Notifications

## Get Notifications

```http
GET /api/notifications
```

## Unread Count

```http
GET /api/notifications/unread-count
```

## Mark Notification as Read

```http
PATCH /api/notifications/:notificationId/read
```

## Mark All as Read

```http
PATCH /api/notifications/read-all
```

## Delete Notification

```http
DELETE /api/notifications/:notificationId
```

---

# Authentication

Protected HTTP endpoints require a JWT.

Header format:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```bash
curl \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/users/me
```

---

# Socket.io

Socket.io connections are authenticated using JWT.

Example client connection:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "YOUR_JWT_TOKEN",
  },
});
```

---

# Socket Events

## Join Chat

Client:

```js
socket.emit("join-chat", chatId);
```

The payload is the plain `chatId` string.

Server confirmation:

```js
socket.on("joined-chat", ({ chatId }) => {
  console.log("Joined:", chatId);
});
```

## Leave Chat

```js
socket.emit("leave-chat", chatId);
```

Server:

```text
left-chat
```

Payload:

```json
{
  "chatId": "CHAT_UUID"
}
```

## Typing Start

Client:

```js
socket.emit("typing-start", chatId);
```

Other members receive:

```text
typing-start
```

with:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

## Typing Stop

Client:

```js
socket.emit("typing-stop", chatId);
```

Other members receive:

```text
typing-stop
```

with:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

Other real-time functionality includes user presence, new messages, read events, and notifications.

---

# Docker

The complete backend stack can be started with Docker Compose.

Build and start:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs backend --tail=50
```

Apply migrations inside the backend container:

```bash
docker compose exec backend npx prisma migrate deploy
```

Stop containers:

```bash
docker compose down
```

The Docker environment includes:

```text
Backend
PostgreSQL
Redis
```

---

# Testing

The project contains automated integration and Socket.io tests.

Run all tests:

```bash
npm test
```

Current result:

```text
Test Suites: 7 passed, 7 total
Tests:       38 passed, 38 total
Snapshots:   0 total
```

Test suites:

```text
auth.test.js
users.test.js
chats.test.js
messages.test.js
notifications.test.js
permissions.test.js
socket.test.js
```

Tests use a separate test database:

```text
chatdb_test
```

Do not run automated tests against the production database.

---

# Swagger Documentation

Start the backend and open:

```text
http://localhost:3000/api-docs
```

Swagger provides interactive documentation for the HTTP API.

---

# Error Handling

The project uses centralized error handling.

Example validation response:

```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

Unknown route example:

```json
{
  "error": "Route not found: GET /api/unknown"
}
```

Invalid JSON:

```json
{
  "error": "Invalid JSON"
}
```

---

# Database Models

The main database entities are:

```text
User
Chat
ChatMember
Message
MessageRead
Notification
```

Relationships include:

```text
User
 ├── Messages
 ├── Chat memberships
 ├── Notifications
 └── Message reads

Chat
 ├── Members
 └── Messages

Message
 ├── Sender
 ├── Chat
 ├── Reply
 └── Read receipts
```

---

# Security Notes

Never commit these files to a public repository:

```text
.env
.env.test
.env.docker
```

Recommended `.gitignore`:

```gitignore
node_modules

.env
.env.*
!.env.example

/generated/prisma

coverage
uploads/*
```

Keep secrets only in environment variables.

For production:

- Use strong JWT secrets
- Use strong database passwords
- Use HTTPS
- Restrict CORS to trusted origins
- Protect email credentials
- Use production-grade secret management
- Regularly update dependencies
- Back up PostgreSQL data

---

# Development Status

Backend core:

```text
100%
```

Automated tests:

```text
38 / 38 passing
```

Implemented core areas:

```text
Authentication       ✅
Users                ✅
Private Chats        ✅
Group Chats          ✅
Messages             ✅
File Uploads         ✅
Read Receipts        ✅
Notifications        ✅
Socket.io            ✅
Redis                ✅
BullMQ               ✅
Email Notifications  ✅
Permissions          ✅
Validation           ✅
Security             ✅
Swagger              ✅
Docker               ✅
Automated Tests      ✅
```

---

# Future Improvements

Possible future improvements:

- Refresh tokens
- Access token revocation
- CI/CD pipeline
- Production deployment
- Structured logging
- Monitoring and metrics
- Database query optimization
- Additional indexes
- Cloud file storage
- Message reactions
- Message pinning
- Push notifications
- API versioning
- Extended end-to-end tests

---

# License

This project is intended for educational and portfolio purposes.

---

# Author

**Nurlybek S**

Backend Developer

Main technologies used in this project:

`Node.js` · `Express.js` · `PostgreSQL` · `Prisma` · `Redis` · `BullMQ` · `Socket.io` · `Docker`
---

# 🇷🇺 Русская версия

# Real-Time Chat & Notification Platform

Backend-платформа для чата и уведомлений в реальном времени, разработанная с использованием **Node.js, Express.js, PostgreSQL, Prisma, Redis, BullMQ и Socket.io**.

Приложение поддерживает личные и групповые чаты, обмен сообщениями в реальном времени, загрузку файлов, статусы прочтения сообщений, онлайн/офлайн статусы пользователей, индикатор набора текста, уведомления, отправку email, систему ролей и разрешений, Swagger-документацию, автоматические тесты и запуск через Docker.

---

# Возможности

## Аутентификация

- Регистрация пользователей
- Авторизация пользователей
- JWT-аутентификация
- Хеширование паролей с помощью bcrypt
- Защищённые маршруты
- Получение текущего пользователя
- Авторизация на основе ролей

---

## Пользователи

- Получение профиля текущего пользователя
- Изменение профиля
- Поиск пользователей
- Поддержка аватара
- Статус онлайн/офлайн
- Отслеживание времени последней активности

---

## Личные чаты

- Создание личного чата
- Защита от создания дублирующихся личных чатов
- Получение списка чатов пользователя
- Получение информации о конкретном чате

---

## Групповые чаты

- Создание групп
- Добавление участников
- Удаление участников
- Переименование группы
- Получение списка участников
- Изменение роли участника

Роли внутри группы:

```text
ADMIN
MEMBER
```

Администратор группы может управлять участниками и настройками группы.

---

## Сообщения

Поддерживаются:

- Отправка текстовых сообщений
- Доставка сообщений в реальном времени
- Ответы на сообщения
- Редактирование сообщений
- Удаление сообщений
- История сообщений
- Пагинация
- Поиск сообщений
- Фильтрация сообщений по типу
- Фильтрация по отправителю
- Отметка отдельного сообщения как прочитанного
- Отметка всего чата как прочитанного
- Индивидуальные статусы прочтения для пользователей

Поддерживаемые типы сообщений:

```text
TEXT
IMAGE
FILE
```

---

## Загрузка файлов

Система поддерживает:

- Загрузку файлов
- Загрузку изображений
- Локальное хранение файлов
- Раздачу статических файлов
- Сохранение информации о файле вместе с сообщением
- `multipart/form-data`

Название поля файла:

```text
file
```

---

# Общение в реальном времени

Для real-time взаимодействия используется **Socket.io**.

Поддерживаются:

- Сообщения в реальном времени
- Онлайн/офлайн статус
- Индикатор набора текста
- Комнаты чатов
- Персональные комнаты пользователей
- Несколько Socket-подключений одного пользователя
- События прочтения сообщений
- Уведомления в реальном времени

---

# Уведомления

Система уведомлений поддерживает:

- Получение уведомлений
- Получение количества непрочитанных уведомлений
- Отметку уведомления как прочитанного
- Отметку всех уведомлений как прочитанных
- Удаление уведомлений
- Уведомления в реальном времени
- Фоновую обработку уведомлений

---

# Фоновые задачи

Для фоновых задач используются:

- Redis
- BullMQ

Архитектура:

```text
Application
    ↓
BullMQ Queue
    ↓
Redis
    ↓
Notification Worker
    ↓
Email / Notification
```

Это позволяет выполнять тяжёлые или отложенные операции отдельно от основного HTTP-запроса.

---

# Email-уведомления

Для отправки email используется:

```text
Nodemailer
```

Система может отправлять email-уведомления пользователям, которые находятся офлайн.

---

# Безопасность

Backend включает следующие механизмы безопасности:

- JWT-аутентификация
- Хеширование паролей через bcrypt
- Helmet security headers
- CORS
- Rate Limiting
- Отдельный Rate Limit для аутентификации
- Ограничение размера request body
- Валидация входящих данных
- Авторизация на основе ролей
- Глобальная обработка ошибок
- Отключение заголовка `X-Powered-By`

---

# Валидация

Для валидации запросов используется:

```text
express-validator
```

Проверяются:

- Email
- Пароль
- Username
- UUID
- Сообщения
- Параметры пагинации
- Участники групп
- Роли
- ID уведомлений
- Загружаемые файлы

Пример ответа при ошибке:

```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

# Технологии

## Backend

- Node.js
- Express.js
- JavaScript

## База данных

- PostgreSQL
- Prisma ORM

## Real-Time

- Socket.io

## Cache / Queue

- Redis
- ioredis
- BullMQ

## Аутентификация

- JSON Web Token
- bcryptjs

## Загрузка файлов

- Multer

## Email

- Nodemailer

## Валидация

- express-validator

## Безопасность

- Helmet
- CORS
- express-rate-limit

## Документация

- Swagger
- OpenAPI

## Тестирование

- Jest
- Supertest
- socket.io-client

## DevOps

- Docker
- Docker Compose

---

# Структура проекта

```text
chat-app-backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │   ├── mailer.js
│   │   └── swagger.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── chats/
│   │   ├── messages/
│   │   └── notifications/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── queues/
│   │   ├── notification.queue.js
│   │   └── notification.worker.js
│   │
│   ├── socket/
│   ├── utils/
│   └── app.js
│
├── tests/
│   ├── helpers/
│   │   ├── auth.helper.js
│   │   ├── cleanup.helper.js
│   │   └── test-data.helper.js
│   │
│   ├── auth.test.js
│   ├── users.test.js
│   ├── chats.test.js
│   ├── messages.test.js
│   ├── notifications.test.js
│   ├── permissions.test.js
│   └── socket.test.js
│
├── uploads/
│
├── server.js
├── jest.setup.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.test
├── .env.docker
└── package.json
```

---

# Архитектура приложения

Проект использует модульную архитектуру.

Основные функциональные части разделены на отдельные модули:

```text
auth
users
chats
messages
notifications
```

Стандартный HTTP-запрос проходит следующий путь:

```text
Client
   ↓
Route
   ↓
Authentication
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

Для real-time взаимодействия:

```text
Client
   ↓
Socket.io
   ↓
JWT Authentication
   ↓
Socket Event
   ↓
Chat Room / User Room
   ↓
Connected Clients
```

Для фоновых задач:

```text
Application
   ↓
BullMQ Queue
   ↓
Redis
   ↓
Worker
   ↓
Email / Notification
```

---

# Требования

Для локального запуска необходимы:

- Node.js
- npm
- PostgreSQL
- Redis

Также инфраструктуру можно запустить через Docker.

Рекомендуется:

```text
Node.js 22+
PostgreSQL
Redis
Docker Desktop
```

---

# Установка

Клонируйте репозиторий:

```bash
git clone <repository-url>
```

Перейдите в директорию проекта:

```bash
cd chat-app-backend
```

Установите зависимости:

```bash
npm install
```

---

# Переменные окружения

Создайте файл:

```text
.env
```

Пример:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/chatdb?schema=public"

JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="7d"

REDIS_URL="redis://localhost:6379"

CLIENT_URL="http://localhost:5173"

EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-app-password"
```

> Никогда не добавляйте реальные пароли, JWT-секреты, данные базы и email credentials в публичный Git-репозиторий.

Для GitHub рекомендуется создать:

```text
.env.example
```

с безопасными placeholder-значениями.

---

# Настройка базы данных

Сгенерировать Prisma Client:

```bash
npx prisma generate
```

Применить migrations:

```bash
npx prisma migrate deploy
```

Для разработки:

```bash
npx prisma migrate dev
```

Заполнить базу тестовыми данными:

```bash
node prisma/seed.js
```

Проверить migrations:

```bash
npx prisma migrate status
```

---

# Запуск Backend

Development:

```bash
npm run dev
```

Обычный запуск:

```bash
npm start
```

После запуска API доступен по адресу:

```text
http://localhost:3000
```

---

# Health Check

```http
GET /health
```

Пример ответа:

```json
{
  "status": "OK",
  "message": "Chat API is running",
  "timestamp": "2026-09-02T12:35:27.125Z"
}
```

---

# API

Все защищённые endpoint-ы требуют JWT:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# Authentication API

## Регистрация

```http
POST /api/auth/register
```

Body:

```json
{
  "email": "user@example.com",
  "username": "exampleuser",
  "password": "123456"
}
```

## Авторизация

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

## Получение текущего пользователя

```http
GET /api/auth/me
```

---

# Users API

## Получить профиль

```http
GET /api/users/me
```

## Изменить профиль

```http
PATCH /api/users/me
```

Пример:

```json
{
  "username": "newusername",
  "avatar": "/uploads/avatar.jpg"
}
```

## Поиск пользователей

```http
GET /api/users/search?q=username
```

---

# Chats API

## Создать личный чат

```http
POST /api/chats/private
```

Body:

```json
{
  "userId": "USER_UUID"
}
```

Точное название параметра:

```text
userId
```

## Создать групповой чат

```http
POST /api/chats/group
```

Body:

```json
{
  "name": "Backend Developers",
  "memberIds": [
    "USER_UUID_1",
    "USER_UUID_2"
  ]
}
```

Точное название параметра:

```text
memberIds
```

## Получить список чатов

```http
GET /api/chats
```

## Получить чат

```http
GET /api/chats/:chatId
```

## Переименовать группу

```http
PATCH /api/chats/:chatId
```

Body:

```json
{
  "name": "New Group Name"
}
```

---

# Участники группы

## Получить участников

```http
GET /api/chats/:chatId/members
```

## Добавить участника

```http
POST /api/chats/:chatId/members
```

Body:

```json
{
  "memberId": "USER_UUID"
}
```

Обратите внимание: точное название параметра:

```text
memberId
```

а не `userId`.

## Удалить участника

```http
DELETE /api/chats/:chatId/members/:memberId
```

## Изменить роль участника

```http
PATCH /api/chats/:chatId/members/:memberId/role
```

Body:

```json
{
  "role": "ADMIN"
}
```

Допустимые значения:

```text
ADMIN
MEMBER
```

---

# Messages API

## Отправить сообщение

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "Hello!"
}
```

## Ответить на сообщение

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "Ответ на сообщение",
  "replyToId": "MESSAGE_UUID"
}
```

Точное название параметра:

```text
replyToId
```

## Получить историю сообщений

```http
GET /api/chats/:chatId/messages?page=1&limit=20
```

Поддерживаемые query-параметры:

```text
page
limit
search
type
senderId
```

Например:

```http
GET /api/chats/:chatId/messages?page=1&limit=20&search=hello&type=TEXT
```

## Редактировать сообщение

```http
PATCH /api/chats/messages/:messageId
```

Body:

```json
{
  "content": "Edited message"
}
```

## Удалить сообщение

```http
DELETE /api/chats/messages/:messageId
```

## Отметить сообщение как прочитанное

```http
PATCH /api/chats/messages/:messageId/read
```

## Отметить весь чат как прочитанный

```http
PATCH /api/chats/:chatId/read
```

---

# Отправка файлов

Endpoint:

```http
POST /api/chats/:chatId/messages/file
```

Тип:

```text
multipart/form-data
```

Обязательное поле:

```text
file
```

Дополнительные поля:

```text
content
replyToId
```

Пример:

```bash
curl -X POST \
  http://localhost:3000/api/chats/CHAT_ID/messages/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@example.png" \
  -F "content=Example image"
```

---

# Notifications API

## Получить уведомления

```http
GET /api/notifications
```

## Получить количество непрочитанных

```http
GET /api/notifications/unread-count
```

## Отметить уведомление как прочитанное

```http
PATCH /api/notifications/:notificationId/read
```

## Отметить все уведомления как прочитанные

```http
PATCH /api/notifications/read-all
```

## Удалить уведомление

```http
DELETE /api/notifications/:notificationId
```

---

# Socket.io

Подключение Socket.io защищено JWT-аутентификацией.

Пример подключения клиента:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "YOUR_JWT_TOKEN",
  },
});
```

---

# Socket.io Events

## Подключение к комнате чата

Клиент отправляет:

```js
socket.emit("join-chat", chatId);
```

Важно: передаётся непосредственно строка `chatId`, а не объект.

После успешного подключения сервер отправляет:

```text
joined-chat
```

Payload:

```json
{
  "chatId": "CHAT_UUID"
}
```

---

## Выход из комнаты

```js
socket.emit("leave-chat", chatId);
```

Сервер отправляет:

```text
left-chat
```

---

## Начало набора текста

```js
socket.emit("typing-start", chatId);
```

Другие участники получают:

```text
typing-start
```

Payload:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

---

## Окончание набора текста

```js
socket.emit("typing-stop", chatId);
```

Другие участники получают:

```text
typing-stop
```

Payload:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

Socket.io также используется для:

- Онлайн/офлайн статусов
- Новых сообщений
- Read events
- Уведомлений
- Нескольких одновременных подключений пользователя

---

# Docker

Полный backend stack можно запустить через Docker Compose.

Сборка и запуск:

```bash
docker compose up -d --build
```

Проверить контейнеры:

```bash
docker compose ps
```

Посмотреть логи backend:

```bash
docker compose logs backend --tail=50
```

Применить Prisma migrations:

```bash
docker compose exec backend npx prisma migrate deploy
```

Остановить контейнеры:

```bash
docker compose down
```

Docker Compose запускает:

```text
Backend
PostgreSQL
Redis
```

---

# Swagger API Documentation

После запуска backend Swagger UI доступен по адресу:

```text
http://localhost:3000/api-docs
```

Swagger позволяет просматривать и тестировать HTTP API через браузер.

---

# Тестирование

Для автоматического тестирования используются:

- Jest
- Supertest
- socket.io-client

Запуск всех тестов:

```bash
npm test
```

Текущий результат:

```text
Test Suites: 7 passed, 7 total
Tests:       38 passed, 38 total
Snapshots:   0 total
```

Тестовые наборы:

```text
auth.test.js
users.test.js
chats.test.js
messages.test.js
notifications.test.js
permissions.test.js
socket.test.js
```

Тесты покрывают:

- Authentication
- Users API
- Chats API
- Messages API
- Notifications API
- Group permissions
- Socket.io
- Online/offline status
- Typing events
- Несколько Socket-подключений

Для тестов используется отдельная база:

```text
chatdb_test
```

Автоматические тесты не должны выполняться на production-базе.

---

# Обработка ошибок

В приложении используется глобальный Error Handler.

Неизвестный endpoint:

```json
{
  "error": "Route not found: GET /api/unknown"
}
```

Некорректный JSON:

```json
{
  "error": "Invalid JSON"
}
```

Ошибка валидации:

```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

# Модели базы данных

Основные сущности:

```text
User
Chat
ChatMember
Message
MessageRead
Notification
```

Основные связи:

```text
User
 ├── Messages
 ├── Chat memberships
 ├── Notifications
 └── Message reads

Chat
 ├── Members
 └── Messages

Message
 ├── Sender
 ├── Chat
 ├── Reply
 └── Read receipts
```

---

# Безопасность проекта

Не добавляйте следующие файлы в публичный Git-репозиторий:

```text
.env
.env.test
.env.docker
```

Пример `.gitignore`:

```gitignore
node_modules

.env
.env.*
!.env.example

/generated/prisma

coverage
uploads/*
```

Все секретные данные должны храниться в переменных окружения.

Для production рекомендуется:

- Использовать сложный `JWT_SECRET`
- Использовать сложные пароли PostgreSQL
- Использовать HTTPS
- Разрешать CORS только доверенным доменам
- Не хранить email credentials в коде
- Использовать Secret Manager
- Регулярно обновлять зависимости
- Делать backup базы данных

---

# Статус проекта

Backend Core:

```text
100%
```

Автоматические тесты:

```text
38 / 38 passing
```

Текущее состояние:

```text
Authentication       ✅
Users                ✅
Private Chats        ✅
Group Chats          ✅
Messages             ✅
File Uploads         ✅
Read Receipts        ✅
Notifications        ✅
Socket.io            ✅
Redis                ✅
BullMQ                ✅
Email Notifications  ✅
Permissions          ✅
Validation           ✅
Security             ✅
Swagger              ✅
Docker               ✅
Automated Tests      ✅
```

---

# Возможные улучшения

В дальнейшем проект можно расширить:

- Refresh Tokens
- Отзыв Access Token
- CI/CD
- Production Deployment
- Structured Logging
- Monitoring
- Метрики
- Оптимизация запросов к базе данных
- Дополнительные database indexes
- Cloud Storage для файлов
- Реакции на сообщения
- Закреплённые сообщения
- Push Notifications
- API Versioning
- Дополнительные E2E-тесты

---

# Назначение проекта

Проект разработан как учебный и портфолио-проект для практики современной backend-разработки.

Он демонстрирует работу с:

- REST API
- Real-Time WebSocket communication
- Реляционной базой данных
- Очередями фоновых задач
- Redis
- Authentication и Authorization
- File Upload
- Docker
- Automated Testing
- API Documentation
- Backend Security

---

# Автор

**Nurlybek S**

Backend Developer

Основной стек проекта:

`Node.js` · `Express.js` · `PostgreSQL` · `Prisma` · `Redis` · `BullMQ` · `Socket.io` · `Docker`


-----------------------------------------------------------------------------------------

# Real-Time Chat & Notification Platform

A production-style backend for a real-time chat and notification platform built with Node.js, Express.js, PostgreSQL, Prisma, Redis, BullMQ, and Socket.io.

The application supports private and group chats, real-time messaging, file uploads, message read receipts, user presence, typing indicators, notifications, email delivery, role-based permissions, API documentation, automated testing, and Docker deployment.

---

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Current user authentication
- Role-based authorization

### Users

- Get current user profile
- Update profile
- Search users
- User avatar support
- Online/offline status
- Last seen tracking

### Private Chats

- Create private chats
- Prevent duplicate private conversations
- Retrieve user's chats
- Retrieve chat information

### Group Chats

- Create group chats
- Add members
- Remove members
- Rename groups
- View group members
- Change member roles

Group roles:

- `ADMIN`
- `MEMBER`

Group administrators can manage members and group settings.

### Messages

- Send text messages
- Real-time message delivery
- Reply to messages
- Edit messages
- Delete messages
- Message history
- Pagination
- Message search
- Filter messages by type
- Filter messages by sender
- Mark individual messages as read
- Mark entire chats as read
- Per-user read receipts

Supported message types:

- `TEXT`
- `IMAGE`
- `FILE`

### File Uploads

- Upload files and images
- Local file storage
- Static file serving
- File metadata stored with messages
- Multipart form-data support

Multipart field name:

```text
file
```

### Real-Time Communication

Socket.io is used for real-time communication.

Supported functionality includes:

- Real-time messages
- Online/offline presence
- Typing indicators
- Chat rooms
- Personal user rooms
- Multiple socket connections per user
- Read events
- Notification events

### Notifications

- Get notifications
- Get unread notification count
- Mark notification as read
- Mark all notifications as read
- Delete notifications
- Real-time notifications
- Background notification processing

### Background Jobs

BullMQ and Redis are used for asynchronous jobs.

The notification worker can process background tasks such as email notifications without blocking HTTP requests.

### Email Notifications

Nodemailer is used to send email notifications to offline users.

### Security

The backend includes:

- JWT authentication
- bcrypt password hashing
- Helmet security headers
- CORS protection
- API rate limiting
- Authentication rate limiting
- Request body size limits
- Input validation
- Role-based authorization
- Global error handling
- Hidden `X-Powered-By` header

### Validation

Request validation is implemented with `express-validator`.

Validation includes:

- Email validation
- Password validation
- Username validation
- UUID validation
- Message validation
- Pagination validation
- Group member validation
- Role validation
- Notification ID validation
- File validation

### API Documentation

Interactive API documentation is available through Swagger UI.

When the backend is running:

```text
http://localhost:3000/api-docs
```

### Automated Tests

The project uses:

- Jest
- Supertest
- socket.io-client

Current test result:

```text
Test Suites: 7 passed, 7 total
Tests:       38 passed, 38 total
Snapshots:   0 total
```

Tests cover:

- Authentication
- Users
- Chats
- Messages
- Notifications
- Group permissions
- Socket.io

---

# Tech Stack

## Backend

- Node.js
- Express.js
- JavaScript

## Database

- PostgreSQL
- Prisma ORM

## Real-Time

- Socket.io

## Cache / Queue

- Redis
- ioredis
- BullMQ

## Authentication

- JSON Web Token
- bcryptjs

## File Upload

- Multer

## Email

- Nodemailer

## Validation

- express-validator

## Security

- Helmet
- CORS
- express-rate-limit

## Documentation

- Swagger
- OpenAPI

## Testing

- Jest
- Supertest
- socket.io-client

## DevOps

- Docker
- Docker Compose

---

# Project Architecture

```text
chat-app-backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │   ├── mailer.js
│   │   └── swagger.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── chats/
│   │   ├── messages/
│   │   └── notifications/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── queues/
│   │   ├── notification.queue.js
│   │   └── notification.worker.js
│   │
│   ├── socket/
│   │
│   ├── utils/
│   │
│   └── app.js
│
├── tests/
│   ├── helpers/
│   │   ├── auth.helper.js
│   │   ├── cleanup.helper.js
│   │   └── test-data.helper.js
│   │
│   ├── auth.test.js
│   ├── users.test.js
│   ├── chats.test.js
│   ├── messages.test.js
│   ├── notifications.test.js
│   ├── permissions.test.js
│   └── socket.test.js
│
├── uploads/
│
├── server.js
├── jest.setup.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.test
├── .env.docker
└── package.json
```

---

# Architecture Overview

The project follows a modular architecture.

Each major feature is separated into its own module:

```text
auth
users
chats
messages
notifications
```

A typical request flows through:

```text
Client
  ↓
Route
  ↓
Authentication
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Real-time communication follows:

```text
Client
  ↓
Socket.io
  ↓
JWT Authentication
  ↓
Socket Event
  ↓
Chat Room / User Room
  ↓
Connected Clients
```

Background notifications follow:

```text
Application
  ↓
BullMQ Queue
  ↓
Redis
  ↓
Notification Worker
  ↓
Email / Notification Processing
```

---

# Requirements

Before running the project locally, install:

- Node.js
- npm
- PostgreSQL
- Redis

Alternatively, Docker can run the required infrastructure.

Recommended:

```text
Node.js 22+
PostgreSQL
Redis
Docker Desktop
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd chat-app-backend
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/chatdb?schema=public"

JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="7d"

REDIS_URL="redis://localhost:6379"

CLIENT_URL="http://localhost:5173"

EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-app-password"
```

> Never commit real passwords, database credentials, JWT secrets, or email credentials to Git.

For a public repository, create a `.env.example` containing placeholder values.

---

# Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate deploy
```

For development, migrations can be created with:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
node prisma/seed.js
```

Check migration status:

```bash
npx prisma migrate status
```

---

# Running the Backend

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The server runs at:

```text
http://localhost:3000
```

---

# Health Check

Endpoint:

```http
GET /health
```

Example response:

```json
{
  "status": "OK",
  "message": "Chat API is running",
  "timestamp": "2026-09-02T12:35:27.125Z"
}
```

---

# API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

Body:

```json
{
  "email": "user@example.com",
  "username": "exampleuser",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### Current authenticated user

```http
GET /api/auth/me
```

---

# Users

### Get profile

```http
GET /api/users/me
```

### Update profile

```http
PATCH /api/users/me
```

Example:

```json
{
  "username": "newusername",
  "avatar": "/uploads/avatar.jpg"
}
```

### Search users

```http
GET /api/users/search?q=username
```

---

# Chats

## Create Private Chat

```http
POST /api/chats/private
```

Body:

```json
{
  "userId": "USER_UUID"
}
```

The parameter name must be:

```text
userId
```

## Create Group

```http
POST /api/chats/group
```

Body:

```json
{
  "name": "Backend Developers",
  "memberIds": [
    "USER_UUID_1",
    "USER_UUID_2"
  ]
}
```

The parameter name is:

```text
memberIds
```

## Get Chats

```http
GET /api/chats
```

## Get Chat

```http
GET /api/chats/:chatId
```

## Rename Group

```http
PATCH /api/chats/:chatId
```

Body:

```json
{
  "name": "New Group Name"
}
```

---

# Group Members

## Get Members

```http
GET /api/chats/:chatId/members
```

## Add Member

```http
POST /api/chats/:chatId/members
```

Body:

```json
{
  "memberId": "USER_UUID"
}
```

The parameter is intentionally named:

```text
memberId
```

## Remove Member

```http
DELETE /api/chats/:chatId/members/:memberId
```

## Change Member Role

```http
PATCH /api/chats/:chatId/members/:memberId/role
```

Body:

```json
{
  "role": "ADMIN"
}
```

Allowed values:

```text
ADMIN
MEMBER
```

---

# Messages

## Send Message

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "Hello!"
}
```

## Reply to Message

```http
POST /api/chats/:chatId/messages
```

Body:

```json
{
  "content": "This is a reply",
  "replyToId": "MESSAGE_UUID"
}
```

## Message History

```http
GET /api/chats/:chatId/messages?page=1&limit=20
```

Supported query parameters:

```text
page
limit
search
type
senderId
```

Example:

```http
GET /api/chats/:chatId/messages?page=1&limit=20&search=hello&type=TEXT
```

## Edit Message

```http
PATCH /api/chats/messages/:messageId
```

Body:

```json
{
  "content": "Edited message"
}
```

## Delete Message

```http
DELETE /api/chats/messages/:messageId
```

## Mark Message as Read

```http
PATCH /api/chats/messages/:messageId/read
```

## Mark Chat as Read

```http
PATCH /api/chats/:chatId/read
```

---

# File Messages

Endpoint:

```http
POST /api/chats/:chatId/messages/file
```

Content-Type:

```text
multipart/form-data
```

File field:

```text
file
```

Optional fields:

```text
content
replyToId
```

Example using curl:

```bash
curl -X POST \
  http://localhost:3000/api/chats/CHAT_ID/messages/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@example.png" \
  -F "content=Example image"
```

---

# Notifications

## Get Notifications

```http
GET /api/notifications
```

## Unread Count

```http
GET /api/notifications/unread-count
```

## Mark Notification as Read

```http
PATCH /api/notifications/:notificationId/read
```

## Mark All as Read

```http
PATCH /api/notifications/read-all
```

## Delete Notification

```http
DELETE /api/notifications/:notificationId
```

---

# Authentication

Protected HTTP endpoints require a JWT.

Header format:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```bash
curl \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/users/me
```

---

# Socket.io

Socket.io connections are authenticated using JWT.

Example client connection:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "YOUR_JWT_TOKEN",
  },
});
```

---

# Socket Events

## Join Chat

Client:

```js
socket.emit("join-chat", chatId);
```

The payload is the plain `chatId` string.

Server confirmation:

```js
socket.on("joined-chat", ({ chatId }) => {
  console.log("Joined:", chatId);
});
```

## Leave Chat

```js
socket.emit("leave-chat", chatId);
```

Server:

```text
left-chat
```

Payload:

```json
{
  "chatId": "CHAT_UUID"
}
```

## Typing Start

Client:

```js
socket.emit("typing-start", chatId);
```

Other members receive:

```text
typing-start
```

with:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

## Typing Stop

Client:

```js
socket.emit("typing-stop", chatId);
```

Other members receive:

```text
typing-stop
```

with:

```json
{
  "chatId": "CHAT_UUID",
  "userId": "USER_UUID"
}
```

Other real-time functionality includes user presence, new messages, read events, and notifications.

---

# Docker

The complete backend stack can be started with Docker Compose.

Build and start:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs backend --tail=50
```

Apply migrations inside the backend container:

```bash
docker compose exec backend npx prisma migrate deploy
```

Stop containers:

```bash
docker compose down
```

The Docker environment includes:

```text
Backend
PostgreSQL
Redis
```

---

# Testing

The project contains automated integration and Socket.io tests.

Run all tests:

```bash
npm test
```

Current result:

```text
Test Suites: 7 passed, 7 total
Tests:       38 passed, 38 total
Snapshots:   0 total
```

Test suites:

```text
auth.test.js
users.test.js
chats.test.js
messages.test.js
notifications.test.js
permissions.test.js
socket.test.js
```

Tests use a separate test database:

```text
chatdb_test
```

Do not run automated tests against the production database.

---

# Swagger Documentation

Start the backend and open:

```text
http://localhost:3000/api-docs
```

Swagger provides interactive documentation for the HTTP API.

---

# Error Handling

The project uses centralized error handling.

Example validation response:

```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

Unknown route example:

```json
{
  "error": "Route not found: GET /api/unknown"
}
```

Invalid JSON:

```json
{
  "error": "Invalid JSON"
}
```

---

# Database Models

The main database entities are:

```text
User
Chat
ChatMember
Message
MessageRead
Notification
```

Relationships include:

```text
User
 ├── Messages
 ├── Chat memberships
 ├── Notifications
 └── Message reads

Chat
 ├── Members
 └── Messages

Message
 ├── Sender
 ├── Chat
 ├── Reply
 └── Read receipts
```

---

# Security Notes

Never commit these files to a public repository:

```text
.env
.env.test
.env.docker
```

Recommended `.gitignore`:

```gitignore
node_modules

.env
.env.*
!.env.example

/generated/prisma

coverage
uploads/*
```

Keep secrets only in environment variables.

For production:

- Use strong JWT secrets
- Use strong database passwords
- Use HTTPS
- Restrict CORS to trusted origins
- Protect email credentials
- Use production-grade secret management
- Regularly update dependencies
- Back up PostgreSQL data

---

# Development Status

Backend core:

```text
100%
```

Automated tests:

```text
38 / 38 passing
```

Implemented core areas:

```text
Authentication       ✅
Users                ✅
Private Chats        ✅
Group Chats          ✅
Messages             ✅
File Uploads         ✅
Read Receipts        ✅
Notifications        ✅
Socket.io            ✅
Redis                ✅
BullMQ               ✅
Email Notifications  ✅
Permissions          ✅
Validation           ✅
Security             ✅
Swagger              ✅
Docker               ✅
Automated Tests      ✅
```

---

# Future Improvements

Possible future improvements:

- Refresh tokens
- Access token revocation
- CI/CD pipeline
- Production deployment
- Structured logging
- Monitoring and metrics
- Database query optimization
- Additional indexes
- Cloud file storage
- Message reactions
- Message pinning
- Push notifications
- API versioning
- Extended end-to-end tests

---

# License

This project is intended for educational and portfolio purposes.

---

# Author

**Nurlybek S**

Backend Developer

Main technologies used in this project:

`Node.js` · `Express.js` · `PostgreSQL` · `Prisma` · `Redis` · `BullMQ` · `Socket.io` · `Docker`
