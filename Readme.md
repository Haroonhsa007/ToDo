# ToDo List Application

https://code2tutorial.com/tutorial/17712e9b-bf87-4685-b2c1-8a38d36d985e/index.md

A full-stack **task and todo management** application with a React (Vite) frontend and a Django REST backend. Users can register, log in, create tasks with priorities and categories, track progress, and manage their profile—all with JWT authentication and a modern, responsive UI.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Security & Best Practices](#security--best-practices)

---

## Overview

This project is a **monorepo** containing:

| Part | Description |
|------|-------------|
| **Frontend** | Single-page application (SPA) built with **React 19**, **Vite 7**, and **Tailwind CSS 4**. Handles auth, task CRUD, categories, dashboard, calendar, and settings. |
| **Backend** | **Django 6** REST API with **Django REST Framework** (v1) and optional **Django Bolt** (v2) async endpoints. Uses **MySQL**, **JWT** (Simple JWT), and **django-cors-headers** for cross-origin requests from the frontend. |

The frontend talks to the backend over HTTP; all protected endpoints require a **Bearer** JWT token. User data, tasks, and categories are **scoped per user** (multi-tenant at the user level).

---

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                    │
│  • AuthContext (login, register, token storage)                  │
│  • Axios instance (baseURL, Bearer token, refresh on 401)       │
│  • Pages: Login, Register, Dashboard, My Task, Categories, etc.  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP/REST (CORS enabled)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Django 6)                            │
│  • API v1: DRF views + serializers (sync)                        │
│  • API v2: Django Bolt async endpoints (when mounted)            │
│  • JWT auth (Simple JWT), MySQL, WhiteNoise static, media files  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MySQL Database                               │
│  • accounts_user (custom user: name, email, profile_picture)     │
│  • todos_task (title, description, priority, status, category)   │
│  • todos_category (name, color, per user)                        │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

1. User **registers** or **logs in** via `/api/v1/auth/register/` or `/api/v1/auth/login/`.
2. Backend returns `access` and `refresh` JWT tokens plus user payload.
3. Frontend stores tokens in `localStorage` and sets `Authorization: Bearer <access>` on all API requests.
4. When the API returns **401**, the frontend attempts **token refresh** using the refresh token; on failure, the user is redirected to login.
5. Protected routes (Dashboard, My Task, etc.) are wrapped in a `ProtectedRoute` component that redirects to `/login` if not authenticated.

### Data Model (Backend)

- **User** (custom model in `accounts`): `username`, `email`, `name`, `first_name`, `last_name`, `profile_picture`, soft delete support.
- **Category** (`todos`): `name`, `color` (hex), `user` (FK). Unique per user.
- **Task** (`todos`): `title`, `description`, `priority` (Extreme / Moderate / Low), `status` (Not Started / In Progress / Completed), `due_date`, `image`, `user` (FK), `category` (FK, optional). Ordered by `-created_at`.

All list APIs support **filtering**, **search**, and **ordering** where applicable; tasks support **pagination** (page size 20).

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|--------|
| **React 19** | UI components and state |
| **Vite 7** | Build tool, dev server, HMR |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |
| **Axios** | HTTP client with interceptors |
| **react-hot-toast** | Toast notifications |
| **react-icons** | Icons |

### Backend

| Technology | Purpose |
|------------|--------|
| **Django 6** | Web framework, ORM, admin |
| **Django REST Framework** | REST API (v1), pagination, filters |
| **djangorestframework-simplejwt** | JWT access/refresh tokens |
| **django-cors-headers** | CORS for frontend origin |
| **MySQL** | Database (via `mysqlclient`) |
| **Pillow** | Image handling (task/user images) |
| **WhiteNoise** | Static file serving |
| **django-unfold** | Modern admin UI |
| **Django Control Room + panels** | Centralized admin/control plane with Redis, Cache, URLs, Celery panels for operations and debugging |
| **Django Bolt** | Optional async API (v2) with OpenAPI |

### DevOps / Tooling

- **pytest**, **pytest-django**, **pytest-cov** for backend tests.
- **ESLint**, **Prettier** for frontend linting and formatting.
- Configuration via **JSON** (`dev.json` / `prod.json`) for Django (no env vars required for DB/secret in this setup).

---

## Project Structure

```
File Tree: ToDo
────────────────────────────────────────────────────────────────────────────────

├── 📁 backend/
│   ├── 📁 accounts/
│   │   ├── 📁 api/
│   │   │   ├── 📁 v1/
│   │   │   │   ├── 🐍 __init__.py
│   │   │   │   ├── 🐍 serializers.py
│   │   │   │   ├── 🐍 urls.py
│   │   │   │   └── 🐍 view.py
│   │   │   └── 📁 v2/
│   │   │       ├── 🐍 __init__.py
│   │   │       ├── 🐍 schemas.py
│   │   │       └── 🐍 views.py
│   │   ├── 📁 migrations/
│   │   │   ├── 🐍 0001_initial.py
│   │   │   ├── 🐍 0002_user_profile_picture.py
│   │   │   └── 🐍 __init__.py
│   │   ├── 📁 test/
│   │   │   ├── 🐍 test_api_auth.py
│   │   │   └── 🐍 test_models.py
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 admin.py
│   │   ├── 🐍 apps.py
│   │   └── 🐍 models.py
│   ├── 📁 common/
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 deps.py
│   │   └── 🐍 utils.py
│   ├── 📁 core/
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 api.py
│   │   ├── 🐍 asgi.py
│   │   ├── 🐍 settings.py
│   │   ├── 🐍 urls.py
│   │   └── 🐍 wsgi.py
│   ├── 📁 media/
│   │   ├── 📁 profile_pictures/
│   │   │   └── 🖼️ 1769006736244.jpg
│   │   └── 📁 tasks/
│   │       └── 🖼️ a.jpg
│   ├── 📁 static/
│   ├── 📁 staticfiles/
│   │   ├── 📁 admin/
│   │   │   ├── 📁 css/
│   │   │   │   ├── 📁 vendor/
│   │   │   │   │   └── 📁 select2/
│   │   │   │   │       ├── 📝 LICENSE-SELECT2.md
│   │   │   │   │       └── 🎨 select2.css
│   │   │   │   ├── 🎨 autocomplete.css
│   │   │   │   ├── 🎨 base.css
│   │   │   │   ├── 🎨 changelists.css
│   │   │   │   ├── 🎨 dark_mode.css
│   │   │   │   ├── 🎨 dashboard.css
│   │   │   │   ├── 🎨 forms.css
│   │   │   │   ├── 🎨 login.css
│   │   │   │   ├── 🎨 nav_sidebar.css
│   │   │   │   ├── 🎨 responsive.css
│   │   │   │   ├── 🎨 responsive_rtl.css
│   │   │   │   ├── 🎨 rtl.css
│   │   │   │   ├── 🎨 unusable_password_field.css
│   │   │   │   └── 🎨 widgets.css
│   │   │   ├── 📁 img/
│   │   │   │   ├── 📝 README.md
│   │   │   │   ├── 🖼️ calendar-icons.svg
│   │   │   │   ├── 🖼️ icon-addlink.svg
│   │   │   │   ├── 🖼️ icon-alert-dark.svg
│   │   │   │   ├── 🖼️ icon-alert.svg
│   │   │   │   ├── 🖼️ icon-calendar.svg
│   │   │   │   ├── 🖼️ icon-changelink.svg
│   │   │   │   ├── 🖼️ icon-clock.svg
│   │   │   │   ├── 🖼️ icon-debug-dark.svg
│   │   │   │   ├── 🖼️ icon-debug.svg
│   │   │   │   ├── 🖼️ icon-deletelink.svg
│   │   │   │   ├── 🖼️ icon-hidelink.svg
│   │   │   │   ├── 🖼️ icon-info-dark.svg
│   │   │   │   ├── 🖼️ icon-info.svg
│   │   │   │   ├── 🖼️ icon-no-dark.svg
│   │   │   │   ├── 🖼️ icon-no.svg
│   │   │   │   ├── 🖼️ icon-unknown-alt.svg
│   │   │   │   ├── 🖼️ icon-unknown.svg
│   │   │   │   ├── 🖼️ icon-viewlink.svg
│   │   │   │   ├── 🖼️ icon-yes-dark.svg
│   │   │   │   ├── 🖼️ icon-yes.svg
│   │   │   │   ├── 🖼️ inline-delete.svg
│   │   │   │   ├── 🖼️ search.svg
│   │   │   │   ├── 🖼️ selector-icons.svg
│   │   │   │   ├── 🖼️ sorting-icons.svg
│   │   │   │   ├── 🖼️ tooltag-add.svg
│   │   │   │   └── 🖼️ tooltag-arrowright.svg
│   │   │   └── 📁 js/
│   │   │       ├── 📁 admin/
│   │   │       │   ├── 📄 DateTimeShortcuts.js
│   │   │       │   └── 📄 RelatedObjectLookups.js
│   │   │       ├── 📁 vendor/
│   │   │       │   ├── 📁 jquery/
│   │   │       │   │   ├── 📄 LICENSE.txt
│   │   │       │   │   └── 📄 jquery.js
│   │   │       │   ├── 📁 select2/
│   │   │       │   │   ├── 📁 i18n/
│   │   │       │   │   │   ├── 📄 af.js
│   │   │       │   │   │   ├── 📄 ar.js
│   │   │       │   │   │   ├── 📄 az.js
│   │   │       │   │   │   ├── 📄 bg.js
│   │   │       │   │   │   ├── 📄 bn.js
│   │   │       │   │   │   ├── 📄 bs.js
│   │   │       │   │   │   ├── 📄 ca.js
│   │   │       │   │   │   ├── 📄 cs.js
│   │   │       │   │   │   ├── 📄 da.js
│   │   │       │   │   │   ├── 📄 de.js
│   │   │       │   │   │   ├── 📄 dsb.js
│   │   │       │   │   │   ├── 📄 el.js
│   │   │       │   │   │   ├── 📄 en.js
│   │   │       │   │   │   ├── 📄 es.js
│   │   │       │   │   │   ├── 📄 et.js
│   │   │       │   │   │   ├── 📄 eu.js
│   │   │       │   │   │   ├── 📄 fa.js
│   │   │       │   │   │   ├── 📄 fi.js
│   │   │       │   │   │   ├── 📄 fr.js
│   │   │       │   │   │   ├── 📄 gl.js
│   │   │       │   │   │   ├── 📄 he.js
│   │   │       │   │   │   ├── 📄 hi.js
│   │   │       │   │   │   ├── 📄 hr.js
│   │   │       │   │   │   ├── 📄 hsb.js
│   │   │       │   │   │   ├── 📄 hu.js
│   │   │       │   │   │   ├── 📄 hy.js
│   │   │       │   │   │   ├── 📄 id.js
│   │   │       │   │   │   ├── 📄 is.js
│   │   │       │   │   │   ├── 📄 it.js
│   │   │       │   │   │   ├── 📄 ja.js
│   │   │       │   │   │   ├── 📄 ka.js
│   │   │       │   │   │   ├── 📄 km.js
│   │   │       │   │   │   ├── 📄 ko.js
│   │   │       │   │   │   ├── 📄 lt.js
│   │   │       │   │   │   ├── 📄 lv.js
│   │   │       │   │   │   ├── 📄 mk.js
│   │   │       │   │   │   ├── 📄 ms.js
│   │   │       │   │   │   ├── 📄 nb.js
│   │   │       │   │   │   ├── 📄 ne.js
│   │   │       │   │   │   ├── 📄 nl.js
│   │   │       │   │   │   ├── 📄 pl.js
│   │   │       │   │   │   ├── 📄 ps.js
│   │   │       │   │   │   ├── 📄 pt-BR.js
│   │   │       │   │   │   ├── 📄 pt.js
│   │   │       │   │   │   ├── 📄 ro.js
│   │   │       │   │   │   ├── 📄 ru.js
│   │   │       │   │   │   ├── 📄 sk.js
│   │   │       │   │   │   ├── 📄 sl.js
│   │   │       │   │   │   ├── 📄 sq.js
│   │   │       │   │   │   ├── 📄 sr-Cyrl.js
│   │   │       │   │   │   ├── 📄 sr.js
│   │   │       │   │   │   ├── 📄 sv.js
│   │   │       │   │   │   ├── 📄 th.js
│   │   │       │   │   │   ├── 📄 tk.js
│   │   │       │   │   │   ├── 📄 tr.js
│   │   │       │   │   │   ├── 📄 uk.js
│   │   │       │   │   │   ├── 📄 vi.js
│   │   │       │   │   │   ├── 📄 zh-CN.js
│   │   │       │   │   │   └── 📄 zh-TW.js
│   │   │       │   │   ├── 📝 LICENSE.md
│   │   │       │   │   └── 📄 select2.full.js
│   │   │       │   └── 📁 xregexp/
│   │   │       │       ├── 📄 LICENSE.txt
│   │   │       │       └── 📄 xregexp.js
│   │   │       ├── 📄 SelectBox.js
│   │   │       ├── 📄 SelectFilter2.js
│   │   │       ├── 📄 actions.js
│   │   │       ├── 📄 autocomplete.js
│   │   │       ├── 📄 calendar.js
│   │   │       ├── 📄 cancel.js
│   │   │       ├── 📄 change_form.js
│   │   │       ├── 📄 core.js
│   │   │       ├── 📄 filters.js
│   │   │       ├── 📄 inlines.js
│   │   │       ├── 📄 jquery.init.js
│   │   │       ├── 📄 nav_sidebar.js
│   │   │       ├── 📄 popup_response.js
│   │   │       ├── 📄 prepopulate.js
│   │   │       ├── 📄 prepopulate_init.js
│   │   │       ├── 📄 theme.js
│   │   │       └── 📄 urlify.js
│   │   ├── 📁 rest_framework/
│   │   │   ├── 📁 css/
│   │   │   │   ├── 🎨 bootstrap-tweaks.css
│   │   │   │   ├── 🎨 default.css
│   │   │   │   ├── 🎨 font-awesome-4.0.3.css
│   │   │   │   └── 🎨 prettify.css
│   │   │   ├── 📁 docs/
│   │   │   │   ├── 📁 css/
│   │   │   │   │   ├── 🎨 base.css
│   │   │   │   │   └── 🎨 highlight.css
│   │   │   │   ├── 📁 img/
│   │   │   │   │   ├── 📄 favicon.ico
│   │   │   │   │   └── 🖼️ grid.png
│   │   │   │   └── 📁 js/
│   │   │   │       ├── 📄 api.js
│   │   │   │       └── 📄 highlight.pack.js
│   │   │   ├── 📁 fonts/
│   │   │   │   ├── 📄 fontawesome-webfont.eot
│   │   │   │   ├── 🖼️ fontawesome-webfont.svg
│   │   │   │   ├── 📄 fontawesome-webfont.ttf
│   │   │   │   ├── 📄 fontawesome-webfont.woff
│   │   │   │   ├── 📄 glyphicons-halflings-regular.eot
│   │   │   │   ├── 🖼️ glyphicons-halflings-regular.svg
│   │   │   │   ├── 📄 glyphicons-halflings-regular.ttf
│   │   │   │   ├── 📄 glyphicons-halflings-regular.woff
│   │   │   │   └── 📄 glyphicons-halflings-regular.woff2
│   │   │   ├── 📁 img/
│   │   │   │   ├── 🖼️ glyphicons-halflings-white.png
│   │   │   │   ├── 🖼️ glyphicons-halflings.png
│   │   │   │   └── 🖼️ grid.png
│   │   │   └── 📁 js/
│   │   │       ├── 📄 ajax-form.js
│   │   │       ├── 📄 coreapi-0.1.1.js
│   │   │       ├── 📄 csrf.js
│   │   │       ├── 📄 default.js
│   │   │       ├── 📄 load-ajax-form.js
│   │   │       └── 📄 prettify-min.js
│   │   └── 📁 unfold/
│   │       ├── 📁 css/
│   │       │   ├── 📁 simplebar/
│   │       │   │   ├── 📄 LICENSE
│   │       │   │   └── 🎨 simplebar.css
│   │       │   └── 🎨 styles.css
│   │       ├── 📁 fonts/
│   │       │   ├── 📁 inter/
│   │       │   │   ├── 📄 Inter-Bold.woff2
│   │       │   │   ├── 📄 Inter-Medium.woff2
│   │       │   │   ├── 📄 Inter-Regular.woff2
│   │       │   │   ├── 📄 Inter-SemiBold.woff2
│   │       │   │   ├── 📄 LICENSE
│   │       │   │   └── 🎨 styles.css
│   │       │   └── 📁 material-symbols/
│   │       │       ├── 📄 LICENSE
│   │       │       ├── 📄 Material-Symbols-Outlined.woff2
│   │       │       └── 🎨 styles.css
│   │       └── 📁 js/
│   │           ├── 📁 alpine/
│   │           │   ├── 📄 LICENSE
│   │           │   ├── 📄 alpine.anchor.js
│   │           │   ├── 📄 alpine.js
│   │           │   ├── 📄 alpine.persist.js
│   │           │   ├── 📄 alpine.resize.js
│   │           │   └── 📄 alpine.sort.js
│   │           ├── 📁 chart/
│   │           │   ├── 📄 LICENSE
│   │           │   └── 📄 chart.js
│   │           ├── 📁 htmx/
│   │           │   ├── 📄 LICENSE
│   │           │   └── 📄 htmx.js
│   │           ├── 📁 simplebar/
│   │           │   ├── 📄 LICENSE
│   │           │   └── 📄 simplebar.js
│   │           ├── 📄 app.js
│   │           └── 📄 select2.init.js
│   ├── 📁 todos/
│   │   ├── 📁 api/
│   │   │   ├── 📁 v1/
│   │   │   │   ├── 🐍 __init__.py
│   │   │   │   ├── 🐍 serializers.py
│   │   │   │   ├── 🐍 urls.py
│   │   │   │   └── 🐍 views.py
│   │   │   ├── 📁 v2/
│   │   │   │   ├── 🐍 __init__.py
│   │   │   │   ├── 🐍 schemas.py
│   │   │   │   └── 🐍 views.py
│   │   │   └── 🐍 __init__.py
│   │   ├── 📁 migrations/
│   │   │   ├── 🐍 0001_initial.py
│   │   │   └── 🐍 __init__.py
│   │   ├── 📁 test/
│   │   │   ├── 🐍 __init__.py
│   │   │   ├── 🐍 test_api.py
│   │   │   └── 🐍 test_models.py
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 admin.py
│   │   ├── 🐍 apps.py
│   │   └── 🐍 models.py
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── ⚙️ dev.json
│   ├── 🐍 manage.py
│   ├── ⚙️ pytest.ini
│   └── 📄 requirements.txt
├── 📁 frontend/
│   ├── 📁 public/
│   │   ├── 📁 site_svgs/
│   │   │   ├── 📁 dashboard-page/
│   │   │   │   ├── 🖼️ Book.svg
│   │   │   │   ├── 🖼️ Pending.svg
│   │   │   │   └── 🖼️ Task Complete.svg
│   │   │   ├── 📁 login-page/
│   │   │   │   ├── 🖼️ facebook.svg
│   │   │   │   ├── 🖼️ google.svg
│   │   │   │   ├── 🖼️ login.svg
│   │   │   │   └── 🖼️ twitter.svg
│   │   │   ├── 📁 nav-bar/
│   │   │   │   ├── 🖼️ Cal.svg
│   │   │   │   └── 🖼️ Notifications.svg
│   │   │   └── 📁 register-page/
│   │   │       ├── 🖼️ confirm-password.svg
│   │   │       ├── 🖼️ email.svg
│   │   │       ├── 🖼️ first-name.svg
│   │   │       ├── 🖼️ last-name.svg
│   │   │       ├── 🖼️ password.svg
│   │   │       ├── 🖼️ register.svg
│   │   │       ├── 🖼️ register_backgroung.svg
│   │   │       └── 🖼️ uesername.svg
│   │   └── 🖼️ vite.svg
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── 📄 Button.jsx
│   │   │   │   └── 📄 Card.jsx
│   │   │   ├── 📁 features/
│   │   │   │   ├── 📄 TaskCard.jsx
│   │   │   │   └── 📄 TaskStatusChart.jsx
│   │   │   └── 📁 layout/
│   │   │       ├── 📄 Header.jsx
│   │   │       ├── 📄 Layout.jsx
│   │   │       └── 📄 Sidebar.jsx
│   │   ├── 📁 constants/
│   │   │   └── 📄 index.js
│   │   ├── 📁 contexts/
│   │   │   └── 📄 AuthContext.jsx
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 useAPI.js
│   │   │   └── 📄 useLocalStorage.js
│   │   ├── 📁 pages/
│   │   │   ├── 📄 AccountInfo.jsx
│   │   │   ├── 📄 AddTask.jsx
│   │   │   ├── 📄 Calendar.jsx
│   │   │   ├── 📄 ChangePassword.jsx
│   │   │   ├── 📄 CreateCategories.jsx
│   │   │   ├── 📄 Dashboard.jsx
│   │   │   ├── 📄 EditTask.jsx
│   │   │   ├── 📄 Help.jsx
│   │   │   ├── 📄 Home.jsx
│   │   │   ├── 📄 Login.jsx
│   │   │   ├── 📄 MyTask.jsx
│   │   │   ├── 📄 Notifications.jsx
│   │   │   ├── 📄 Register.jsx
│   │   │   ├── 📄 Settings.jsx
│   │   │   ├── 📄 TaskCategories.jsx
│   │   │   ├── 📄 ViewTask.jsx
│   │   │   └── 📄 Vitals.jsx
│   │   ├── 📁 services/
│   │   │   ├── 📄 api.js
│   │   │   └── 📄 axios.js
│   │   ├── 📁 utils/
│   │   │   ├── 📄 cn.js
│   │   │   └── 📄 toast.js
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.jsx
│   ├── ⚙️ .editorconfig
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── ⚙️ .prettierignore
│   ├── ⚙️ .prettierrc
│   ├── 📝 README.md
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 postcss.config.js
│   ├── 📄 tailwind.config.js
│   └── 📄 vite.config.js
├── ⚙️ .gitignore
└── 📝 Readme.md

────────────────────────────────────────────────────────────────────────────────
```

---

## Features

### User & Auth

- **Register**: username, email, name (first/last), password, confirm password.
- **Login**: username + password → JWT access + refresh and user object.
- **Token refresh**: Automatic retry on 401 using refresh token (axios interceptor).
- **Profile**: View/update profile (name, email, profile picture); change password.
- **Protected routes**: All app routes except `/login` and `/register` require authentication.

### Tasks

- **CRUD**: Create, read, update, delete tasks.
- **Fields**: Title, description, priority (Extreme / Moderate / Low), status (Not Started / In Progress / Completed), due date, optional image, optional category.
- **Filtering & search**: By status, priority, category, and text search; ordering (e.g. by date, priority).
- **Statistics**: Aggregated counts and percentages (e.g. completed, in progress, not started) for dashboard/vitals.

### Categories

- **CRUD**: Create, read, update, delete categories.
- **Fields**: Name, color (hex). Each user has their own set of categories; names are unique per user.
- Tasks can be optionally linked to one category.

### Operations & Control Room

- **Unfold Admin UI**: Modern Django admin at `/admin/` for managing users, tasks, and categories.
- **Django Control Room dashboard**: Central operations console at `/admin/dj-control-room/` with Redis, cache, URL, and Celery panels to help you monitor and debug the system (see `backend/README.md` for more details).

### UI / UX

- **Dashboard**: Overview and task statistics.
- **My Task / Vitals**: Task list and progress.
- **Calendar**: Calendar view for tasks.
- **Categories**: Manage categories; used when creating/editing tasks.
- **Notifications, Settings, Help**: Placeholder or supporting pages.
- **Layout**: Header, collapsible sidebar, responsive behavior (e.g. mobile).
- **Toasts**: Success/error feedback via `react-hot-toast`.

---

## Getting Started

### Prerequisites

- **Node.js** (e.g. 18+) and **npm** (or equivalent) for the frontend.
- **Python 3.8+** and **pip** for the backend.
- **MySQL 5.7+** (or 8.x) running and accessible.

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
```

Create the MySQL database and user (adjust port if needed):

```sql
CREATE DATABASE todolist CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'todolist'@'localhost' IDENTIFIED BY 'todolist1234';
GRANT ALL PRIVILEGES ON todolist.* TO 'todolist'@'localhost';
FLUSH PRIVILEGES;
```

Ensure `backend/dev.json` matches your DB (name, user, password, host, port). Example:

```json
{
  "DEBUG": true,
  "SECRET_KEY": "your-secret-key",
  "ALLOWED_HOSTS": ["*"],
  "DATABASES": {
    "default": {
      "ENGINE": "django.db.backends.mysql",
      "NAME": "todolist",
      "USER": "todolist",
      "PASSWORD": "todolist1234",
      "HOST": "localhost",
      "PORT": "3306",
      "OPTIONS": {}
    }
  }
}
```

Run migrations and (optionally) create a superuser:

```bash
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin/
python manage.py runserver
```

Backend will be at **http://localhost:8000**. API v1 base: **http://localhost:8000/api/v1/**.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Copy environment example and set the API base URL:

```bash
cp .env.example .env
```

In `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start the dev server:

```bash
npm run dev
```

Frontend will typically run at **http://localhost:5173**. Use **Login** or **Register** to get a JWT and access the app.

### 3. Run Both

- Terminal 1: `backend` → `python manage.py runserver`
- Terminal 2: `frontend` → `npm run dev`

Then open **http://localhost:5173** and sign in or register.

---

## Configuration

### Backend

- **Config file**: `backend/dev.json` (or `prod.json` when `DEBUG` is false in `dev.json`). Holds `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, and `DATABASES`.
- **CORS**: Allowed origins are in `core/settings.py` (e.g. `http://localhost:5173`, `http://localhost:3000`). Adjust for your frontend URL.
- **JWT**: Access token lifetime 60 minutes, refresh 1 day; configured in `SIMPLE_JWT` in `settings.py`.
- **Static/Media**: Static files via WhiteNoise; media (uploads) at `MEDIA_URL`/`MEDIA_ROOT` (e.g. `/media/`, `backend/media/`).
- **Admin & Ops Dashboard**: Unfold-themed Django admin plus Django Control Room (see `backend/README.md`) with Redis, Cache, URLs, and Celery panels at `/admin/dj-*-panel/` and the main dashboard at `/admin/dj-control-room/`.

### Frontend

- **API base URL**: `VITE_API_BASE_URL` in `.env` (e.g. `http://localhost:8000/api/v1`). Used in `constants/index.js` and axios baseURL.
- **Refresh token**: Axios interceptor in `services/axios.js` uses the same base URL for the refresh endpoint; ensure it points to the same backend.

---

## API Overview

The app is designed to use **API v1** (Django REST Framework). The following is a concise overview; the **backend README** (`backend/README.md`) has full request/response examples.

### Base URL

- **v1**: `http://localhost:8000/api/v1/`

### Auth (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/auth/register/` | Register (username, email, name, password, password_confirm) |
| POST   | `/auth/login/`    | Login (username, password) → access, refresh, user |
| POST   | `/auth/refresh/`  | Body: `{ "refresh": "..." }` → new access token |

### User (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/users/me/`           | Current user |
| PUT    | `/users/profile/`     | Update profile (including profile_picture) |
| POST   | `/users/change-password/` | Change password |

### Tasks (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/todos/`           | List (optional: status, priority, category, search, ordering, page) |
| POST   | `/todos/`           | Create (multipart/form-data; optional image, category) |
| GET    | `/todos/{id}/`      | Retrieve one |
| PUT    | `/todos/{id}/`      | Full update |
| DELETE | `/todos/{id}/`     | Delete |
| GET    | `/todos/statistics/` | Counts and percentages by status |

### Categories (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/categories/`      | List current user’s categories |
| POST   | `/categories/`      | Create (name, color) |
| GET    | `/categories/{id}/` | Retrieve one |
| PUT    | `/categories/{id}/` | Update |
| DELETE | `/categories/{id}/` | Delete |

All authenticated requests must include the header:  
`Authorization: Bearer <access_token>`.

The backend also includes an **API v2** (Django Bolt) definition in `core/api.py` and under `accounts.api.v2` and `todos.api.v2`. Those endpoints mirror v1 with async handlers and OpenAPI; they are only active if the Bolt API is mounted in the project URLs (see backend docs).

---

## Testing

### Backend

From `backend/` with the virtual environment activated:

```bash
pytest
pytest -v
pytest --cov=todos --cov=accounts --cov-report=html
pytest accounts/test/
pytest todos/test/
```

Coverage report: `htmlcov/index.html`.

### Frontend

Use the project’s existing scripts:

```bash
cd frontend
npm run lint
npm run format:check
npm run format
```

Add `npm test` or a test runner (e.g. Vitest) if you introduce frontend unit tests.

---

## Security & Best Practices

- **Authentication**: All task and category endpoints require a valid JWT; auth is enforced by DRF and (if used) Bolt guards.
- **Authorization**: Queries are filtered by `user` so that users only see and modify their own tasks and categories.
- **Passwords**: Django’s default password validators are used; tokens are not stored in code.
- **CORS**: Limited to explicit origins (e.g. dev frontend URLs).
- **File uploads**: Image types and size limits are enforced (see `ALLOWED_IMAGE_TYPES` and `FILE_UPLOAD_MAX_MEMORY_SIZE` in `settings.py`).
- **Secrets**: Use strong `SECRET_KEY` and `prod.json` (or env-based config) in production; never commit real secrets.

For more detail on the backend (migrations, admin, troubleshooting), see **`backend/README.md`**.
