# Деплой на [Railway](https://railway.com) (из GitHub)

В корне репозитория **`railway.json`**: сборка и старт. **Путь healthcheck в файле не задан** — Railway не будет останавливать деплой на шаге «Network → Healthcheck» (эту проверку при желании можно включить в UI сервиса позже). Конфиг: [Config as Code](https://docs.railway.com/reference/config-as-code).

**Миграции БД** в `railway.json` **не запускаются автоматически** (чтобы деплой не падал на pre-deploy). Один раз после первого успешного деплоя выполните в [Shell](https://docs.railway.com/guides/cli#shell) сервиса приложения из **корня репозитория**:

```bash
npm run migrate --prefix backend
```

(Либо `cd backend && npm run migrate`.)

## 1. Проект из GitHub

1. [New project → GitHub](https://railway.com/new/github) → репозиторий Agro ERP.
2. При необходимости в сервисе укажите ветку **`main`**.

## 2. База данных с PostGIS

Нужны **PostGIS** и **pgcrypto** (см. `backend/migrations/001_init_extensions.sql`).

Обычный **PostgreSQL** на Railway без PostGIS часто **не подходит**. Добавьте шаблон с PostGIS, например [PG 17 + PostGIS](https://railway.com/deploy/postgis-17).

В сервисе **приложения** → **Variables** → **`DATABASE_URL`** → **Reference** на сервис БД → **`DATABASE_URL`**. Подробнее: [Variables](https://docs.railway.com/guides/variables). Если reference не сделан, но в сервис «просочились» стандартные **`PGHOST` / `PGUSER` / `PGPASSWORD` / `PGDATABASE`**, приложение **соберёт** строку подключения само. Надёжнее всё равно задать **`DATABASE_URL`** явно.

## 3. Переменные (сервис приложения)

| Переменная | Обязательно | Значение |
|------------|-------------|----------|
| `DATABASE_URL` | да | Reference на Postgres/PostGIS |
| `JWT_SECRET` | да | ≥ **32** символов |
| `NODE_ENV` | да | `production` |
| `VITE_API_URL` | да | `/api` (для сборки фронта) |
| `APP_ORIGIN` | нет | Если **не** задать, backend подставит **`https://` + `RAILWAY_PUBLIC_DOMAIN`** (Railway добавляет переменную сам). Свой домен — задайте `APP_ORIGIN` вручную. |

`PORT` задаёт Railway — backend его читает.

## 4. Сборка и старт (`railway.json`)

- **Build:** `npm install && npm run install:all && npm run build`
- **Start:** `NODE_ENV=production node backend/src/server.js` (из корня репозитория; путь к `frontend/dist` ищется от расположения `app.js`, не от `cwd`)
- **Healthcheck:** в репозитории **не задан** — деплой не блокируется на Network. После выката откройте в браузере `/health` или `/api/health`. При необходимости добавьте проверку в настройках сервиса на Railway.

## 5. Проверка

1. Деплой **зелёный** → в Shell: `npm run migrate --prefix backend`.
2. Логи: `ERP backend запущен на порту …`
3. Браузер: `https://…/health` или `…/api/health` → `{"status":"ok"}`
4. Администратор: см. README / `create-admin`.

## 6. Ссылки

- [Railway Docs](https://docs.railway.com/)
- [Public networking / домены](https://docs.railway.com/guides/public-networking)
