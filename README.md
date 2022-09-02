[![Tests for sprint 13](https://github.com/KaerMorgan/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/KaerMorgan/express-mesto-gha/actions/workflows/tests-13-sprint.yml)

[![Tests for sprint 14](https://github.com/KaerMorgan/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/KaerMorgan/express-mesto-gha/actions/workflows/tests-14-sprint.yml)

# Проект Mesto фронтенд + бэкенд

## Описание

Веб API на `NodeJS` и `ExpressJS`. Проект будет представлять собой серверную часть проекта _Место_.
В качестве базы данных используется `MongoDB` с `mongoose`.
В разработке использовался `ESLint` со стайлгайдом от Airbnb и `editorconfig`.

Также используются:
`helmet` - для простановки security-заголовков.
`express-rate-limit` - для ограничения кол-во запросов и защиты от DoS-атак.

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки  
`/models` — папка с файлами описания схем пользователя и карточки
`/erros` — папка с файлами кастомных ошибок

## Эндпоинты

_GET_ `/users` — возвращает всех пользователей из базы данных  
_POST_ `/users` — создаёт пользователя с переданными в теле запроса  
_GET_ `/users/:userId` - возвращает пользователя по переданному id  
_PATCH_ `/users/me` — обновляет профиль  
_PATCH_ `/users/me/avatar` — обновляет аватар

_GET_ `/cards` — возвращает все карточки  
_POST_ `/cards` — создаёт карточку  
_DELETE_ `/cards/:cardId` — удаляет карточку по идентификатору

_PUT_ `/cards/:cardId/likes` — поставить лайк карточке  
_DELETE_ `/cards/:cardId/likes` — убрать лайк с карточки

## Запуск проекта

`npm run start` — запускает сервер  
`npm run dev` — запускает сервер с hot-reload

## Публичный IP-адрес сервера и домен

https://morgankatarn.nomoredomains.sbs/ - фронтенд
https://api.morgankatarn.nomoredomains.sbs/signin - сервер

51.250.78.39 - ip
