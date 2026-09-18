# ALS Detailing

Сайт детейлинг-студии ALS (Волгоград, ул. Новорядская, 120а). Статический сайт: HTML + CSS + JS, без сборки.

## Структура

- `index.html` — страница
- `css/style.css` — стили
- `js/main.js` — меню, форма записи (открывает чат в Telegram), акция, видео
- `images/` — фавикон, фоновое видео (`hero-bg.mp4` для ПК, `hero-bg-mobile.mp4` для телефона), фото работ в `images/gallery/`

## Как менять

- Цены и услуги — в `index.html`, разделы «Услуги» и «Цены».
- Акция — атрибут `data-until` у блока `#promo`; после этой даты блок скрывается сам.
- Контакты: +7 (933) 911-34-34, Telegram @als_mf, Instagram @als_detailing1.

## Локальный просмотр

Достаточно открыть `index.html` в браузере.

## Публикация

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / `(root)`.
