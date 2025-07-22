# Site Health Check Service

Мониторинг доступности сайтов с уведомлениями в Telegram, логированием и удобным API/CLI.

## Возможности
- Проверка доступности сайтов по расписанию (индивидуальный cron для каждого сайта)
- Уведомления в Telegram о падениях/восстановлениях
- История всех проверок (логи)
- CRUD для сайтов через API и CLI
- Хранение данных в PostgreSQL (через TypeORM)
- Контейнеризация через Docker

## Быстрый старт

1. Клонируй репозиторий и перейди в папку проекта
2. Скопируй `.env.example` → `.env` и заполни переменные (особенно TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)
3. Запусти через Docker:
   ```bash
   docker-compose up --build -d
   ```
4. Для управления сайтами:
   ```bash
   docker-compose exec app node cli.js
   ```
5. API доступен на `http://localhost:3000/sites`

## Основные команды npm
- `npm run dev` — запуск с hot-reload (разработка)
- `npm start` — запуск в продакшене
- `npm run cli` — CLI для управления сайтами
- `npm run format` — автоформатирование кода

## Переменные окружения
- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота
- `TELEGRAM_CHAT_ID` — id чата для уведомлений
- `POSTGRES_*` — настройки БД (по умолчанию работают с docker-compose)
- `PORT` — порт приложения (по умолчанию 3000)

## API
- `GET /sites` — список сайтов
- `POST /sites` — добавить сайт
- `PUT /sites/:id` — обновить сайт
- `DELETE /sites/:id` — удалить сайт
- `GET /sites/logs` — все логи (параметры: limit, offset, status)
- `GET /sites/:id/logs` — логи по сайту

## Развёртывание
Смотри подробную инструкцию в [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Made with ❤️ for DevOps & SRE** 