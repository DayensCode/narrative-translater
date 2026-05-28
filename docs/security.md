# Безопасность

Narrative позиционируется как confidential-приложение: голос и текст не должны
покидать устройство. Этот документ фиксирует, какие угрозы рассматривались при
аудите, как они закрыты в коде и какие границы нельзя пересекать при будущих
правках.

## Сводка

- 15 находок по итогам аудита — все закрыты.
- `npm run typecheck`, `lint`, `test`, `build` проходят чисто.
- `npm audit` — 0 vulnerabilities.

| Severity | Всего | Open |
| -------- | ----- | ---- |
| High     | 5     | 0    |
| Medium   | 5     | 0    |
| Low      | 5     | 0    |

Статусы:

- **Resolved** — проблема устранена в коде.
- **Mitigated** — закрыта защитой в глубину через другую находку.
- **Documented** — не проблема, а инвариант, зафиксированный в `AGENT.md`.

## Сводная таблица находок

| ID    | Severity | Область                   | Заголовок                                           | Статус     |
| ----- | -------- | ------------------------- | --------------------------------------------------- | ---------- |
| F-01  | High     | Сетевые утечки            | Google Fonts загружались со стороннего CDN          | Resolved   |
| F-02  | High     | Целостность моделей       | SW кешировал opaque-ответы (status 0)               | Resolved   |
| F-03  | High     | XSS / эксфильтрация       | Отсутствовал Content-Security-Policy                | Resolved   |
| F-04  | High     | Supply chain              | 5 high-severity уязвимостей в dev-зависимостях      | Resolved   |
| F-05  | High     | Изоляция                  | Отсутствовал Permissions-Policy                     | Resolved   |
| F-06  | Medium   | Сетевые утечки            | SpeechSynthesis мог уходить в облачный TTS          | Resolved   |
| F-07  | Medium   | Конфиденциальность        | Не было функции «стереть все данные»                | Resolved   |
| F-08  | Medium   | Целостность               | HF-модели без pinned revision                       | Resolved   |
| F-09  | Medium   | Dev-окружение             | Dev-сервер слушал 0.0.0.0                           | Resolved   |
| F-10  | Medium   | Supply chain              | SW autoUpdate без подтверждения                     | Resolved   |
| F-11  | Low      | XSS                       | `i18next` `escapeValue: false`                      | Resolved   |
| F-12  | Low      | Защита в глубину          | localStorage и транскрипт доступны любому XSS       | Mitigated  |
| F-13  | Low      | UX безопасности           | Нет confirm перед Clear                             | Resolved   |
| F-14  | Low      | Tabnabbing                | Нет ESLint-защиты от `target="_blank"`              | Resolved   |
| F-15  | Low      | Не находка, подтверждение | `HashRouter` не уходит на сервер                    | Documented |

## Детали по находкам

### F-01 · Google Fonts загружались со стороннего CDN

- **Severity:** High · **Область:** Сетевые утечки · **Статус:** Resolved
- **Где:** `src/index.css`
- **Риск до фикса.** Каждый запуск отправлял IP, User-Agent и Referer на
  `fonts.googleapis.com` и `fonts.gstatic.com`, что противоречило
  позиционированию offline-first и «ничего не покидает устройство».
- **Резолюция.** Подключён `@fontsource/roboto` (400/500/700) — шрифты едут в
  общий бандл и раздаются с того же origin. Никаких внешних запросов за
  шрифтом больше нет.
- **Затронуто:** `@fontsource/roboto` + `@import` в `src/index.css`.

### F-02 · SW кешировал opaque-ответы (status 0)

- **Severity:** High · **Область:** Целостность моделей · **Статус:** Resolved
- **Где:** `vite.config.ts`
- **Риск до фикса.** `CacheFirst` сохранял opaque-ответы (cross-origin no-cors).
  При MITM на первой загрузке подменённый `.onnx` мог осесть в кеше на 30 дней.
- **Резолюция.** `cacheableResponse.statuses = [200]` для обоих `CacheFirst`-правил
  (`hf-model-cache`, `cdn-assets-cache`). Opaque-ответы больше не персистятся —
  поломанное соединение не оставляет артефакта.
- **Затронуто:** `vite.config.ts: statuses = [200]`.

### F-03 · Отсутствовал Content-Security-Policy

- **Severity:** High · **Область:** XSS / эксфильтрация · **Статус:** Resolved
- **Где:** `index.html`
- **Риск до фикса.** Без CSP любой будущий XSS получал неограниченный
  `connect-src` и мог выгрузить транскрипт/перевод на произвольный хост.
- **Резолюция.** Строгий CSP в `<meta>`:
  `default-src 'self'; script-src 'self'; connect-src 'self' + HF-хосты;
  frame-ancestors 'none'; base-uri 'none'; form-action 'none';
  object-src 'none'`. Inline anti-flash скрипт вынесен в
  `/public/theme-boot.js`, поэтому `script-src` обходится без `'unsafe-inline'`.
- **Затронуто:** `index.html` + `public/theme-boot.js`.

### F-04 · 5 high-severity уязвимостей в dev-зависимостях

- **Severity:** High · **Область:** Supply chain · **Статус:** Resolved
- **Где:** `package-lock.json`
- **Риск до фикса.** `serialize-javascript ≤7.0.4` (RCE, CWE-96) и `minimatch`
  ReDoS приезжали через `vite-plugin-pwa → workbox-build → @rollup/plugin-terser`.
- **Резолюция.** Добавлены `overrides` в `package.json`:
  `serialize-javascript: 7.0.5`, `minimatch: 10.2.5`. `npm audit` теперь —
  `found 0 vulnerabilities`.
- **Затронуто:** `package.json` `overrides`.

### F-05 · Отсутствовал Permissions-Policy

- **Severity:** High · **Область:** Изоляция · **Статус:** Resolved
- **Где:** `index.html`
- **Риск до фикса.** В случае встраивания в iframe любой фрейм получал
  `microphone`; `frame-ancestors` также не был ограничен.
- **Резолюция.** `<meta http-equiv="Permissions-Policy">` с
  `microphone=(self), camera=(), geolocation=(), interest-cohort=(), payment=(),
  usb=()` и др. `frame-ancestors 'none'` закрыт через CSP.
- **Затронуто:** `index.html`.

### F-06 · SpeechSynthesis мог уходить в облачный TTS

- **Severity:** Medium · **Область:** Сетевые утечки · **Статус:** Resolved
- **Где:** `src/hooks/useSpeechSynthesis.ts`
- **Риск до фикса.** Часть системных голосов (Chrome «Google …», «Enhanced» на
  iOS) стримит произносимый текст в облако вендора ОС/браузера.
- **Резолюция.** `pickVoice` сначала выбирает `voice.localService === true`.
  Добавлен тумблер «Только локальные голоса озвучки» в Settings → Privacy с
  дефолтом `true`; при включённом тумблере и отсутствии локального голоса
  `speak()` возвращает управление без произнесения, чтобы текст не ушёл в
  облако.
- **Затронуто:** `useSpeechSynthesis` + Privacy-секция в `SettingsPage`.

### F-07 · Не было функции «стереть все данные»

- **Severity:** Medium · **Область:** Конфиденциальность · **Статус:** Resolved
- **Где:** `src/utils/wipe-data.ts`, `SettingsPage`
- **Риск до фикса.** Для confidential-приложения ожидается one-click wipe —
  `localStorage`/`sessionStorage`, Cache Storage (~1.5 ГБ моделей),
  `IndexedDB`, SW-регистрации.
- **Резолюция.** Создан `wipeLocalData()` и кнопка «Стереть все данные» в
  Settings → Privacy. После подтверждения чистятся `localStorage`,
  `sessionStorage`, все `caches`, все `indexedDB.databases()`, `unregister`
  всех SW-регистраций, затем hard reload.
- **Затронуто:** `src/utils/wipe-data.ts` + `SettingsPage`.

### F-08 · HF-модели без pinned revision

- **Severity:** Medium · **Область:** Целостность · **Статус:** Resolved
- **Где:** `src/workers/whisper.worker.ts`, `translate.worker.ts`, `_hf.ts`
- **Риск до фикса.** `pipeline()` резолвил `revision` к `main` — веса могли
  молча переехать между релизами.
- **Резолюция.** `createHfPipeline` принимает `revision`. Зафиксированы
  коммиты:
  - `Xenova/whisper-small @ 2d67713f236afa48a18992566e7647f6ca848e13`
  - `Xenova/nllb-200-distilled-600M @ 261c31d1a5732c67cdd16d80e8d6088507c7ccea`
  Бамп SHA теперь осознанный и триггерит повторный аудит.
- **Затронуто:** `workers/_hf.ts` + whisper/translate workers.

### F-09 · Dev-сервер слушал 0.0.0.0

- **Severity:** Medium · **Область:** Dev-окружение · **Статус:** Resolved
- **Где:** `vite.config.ts`
- **Риск до фикса.** `npm run dev` биндился на все интерфейсы. На публичном
  Wi-Fi разработчик раздавал рабочее состояние в LAN.
- **Резолюция.** `server.host = "127.0.0.1"` и то же для `preview`.
  LAN-тестирование — только осознанно через `vite --host`.
- **Затронуто:** `vite.config.ts`.

### F-10 · SW autoUpdate без подтверждения

- **Severity:** Medium · **Область:** Supply chain · **Статус:** Resolved
- **Где:** `vite.config.ts`, `src/components/UpdateBanner`
- **Риск до фикса.** При компрометации build pipeline новый SW моментально
  заменял старый у всех установленных клиентов.
- **Резолюция.** `registerType: "prompt"` в `VitePWA`. `UpdateBanner` владеет
  `registerSW({ onNeedRefresh })` и показывает баннер «Доступна новая версия» с
  кнопками «Обновить / Позже». Без согласия SW не меняется.
- **Затронуто:** `vite.config.ts` + `UpdateBanner`.

### F-11 · `i18next` `escapeValue: false`

- **Severity:** Low · **Область:** XSS · **Статус:** Resolved
- **Где:** `src/i18n/index.ts`
- **Риск до фикса.** На момент аудита безопасно (React экранирует текст), но
  любое будущее `<Trans components>` с пользовательскими `values` обошло бы
  экранирование.
- **Резолюция.** `interpolation.escapeValue = true`. Попутный футган закрыт.
- **Затронуто:** `src/i18n/index.ts`.

### F-12 · localStorage и транскрипт доступны любому XSS

- **Severity:** Low · **Область:** Защита в глубину · **Статус:** Mitigated
- **Где:** по всему UI
- **Риск до фикса.** Чувствительных данных в `localStorage` нет, но при XSS
  транскрипт в React state мог утечь через `window.__REACT_ROOT__`.
- **Резолюция.** Закрыто в рамках F-03 через CSP: даже при XSS `fetch()` не
  уйдёт на произвольный хост (`connect-src` allowlist) и скрипты с
  inline/remote источников блокируются. Дополнительно — кнопка Wipe data
  убирает всё по запросу.
- **Затронуто:** `index.html` CSP + `wipe-data`.

### F-13 · Нет confirm перед Clear

- **Severity:** Low · **Область:** UX безопасности · **Статус:** Resolved
- **Где:** `src/App.tsx: clearAll`
- **Риск до фикса.** Один тап уничтожал рабочую сессию без подтверждения.
- **Резолюция.** `clearAll()` проверяет есть ли контент (`transcript` /
  `partial` / `translated`) и при наличии вызывает локализованный
  `window.confirm` перед удалением. Новый i18n-ключ `clearConfirm`.
- **Затронуто:** `src/App.tsx` + i18n.

### F-14 · Нет ESLint-защиты от `target="_blank"`

- **Severity:** Low · **Область:** Tabnabbing · **Статус:** Resolved
- **Где:** `eslint.config.js`
- **Риск до фикса.** Сейчас внешних ссылок нет, но без правила любой future
  `target="_blank"` без `rel="noopener noreferrer"` стал бы уязвимостью.
- **Резолюция.** Добавлено `no-restricted-syntax` на
  `JSXAttribute[name.name='target'][value.value='_blank']` с подробным
  сообщением о необходимости `rel`.
- **Затронуто:** `eslint.config.js`.

### F-15 · `HashRouter` не уходит на сервер

- **Severity:** Low · **Область:** Не находка, подтверждение · **Статус:** Documented
- **Где:** `src/main.tsx`
- **Риск до фикса.** Путь после `#` не попадает в access-логи — плюс для
  confidential-использования. Важно не потерять при рефакторинге на
  `BrowserRouter`.
- **Резолюция.** В `AGENT.md` появился раздел «Security-инварианты», где
  `HashRouter` зафиксирован как осознанное решение, вместе с pinned HF
  revisions, CSP, prompt-updates, localService TTS, `127.0.0.1` и запретом
  `target=_blank` без `rel`.
- **Затронуто:** `AGENT.md`.

## Security-инварианты

Зафиксированы в `AGENT.md`, чтобы не регрессировать при будущих правках.
Каждый — граница, которую нельзя пересекать без отдельного обсуждения.

- **Роутинг.** `HashRouter`, не `BrowserRouter` — пути после `#` не попадают в
  access-логи origin-сервера.
- **Модели.** HF-веса пиннятся к конкретному commit SHA. Обновление ревизии =
  повторный аудит того, что скачивается.
- **Транспорт.** Любой новый внешний хост должен попасть либо в `connect-src`
  CSP, либо быть self-hosted. По умолчанию — self-hosted.
- **Service Worker.** `registerType: "prompt"`. Новый SW не ставится без
  явного согласия пользователя — окно обнаружения скомпрометированной сборки.
- **TTS.** По умолчанию `voice.localService === true`. Cloud-voices — только
  после явного opt-in в Settings.
- **Dev.** Dev-сервер биндится на `127.0.0.1`. LAN — только через
  `vite --host` осознанно.
- **Storage.** В `localStorage` только UI-преференсы, никаких токенов /
  транскриптов / PII.
- **Внешние ссылки.** `<a target="_blank">` только с `rel="noopener noreferrer"`;
  ESLint-правило в `eslint.config.js` следит.

## Регулярная верификация

| Что проверить                          | Как                                                                           | Частота             |
| -------------------------------------- | ----------------------------------------------------------------------------- | ------------------- |
| Уязвимости зависимостей                | `npm audit` в CI + Dependabot/Renovate                                        | Weekly              |
| HF revisions актуальны и валидны       | Ручная сверка SHA в `workers/*.worker.ts` с `huggingface.co/api/models/…`     | При бампе модели    |
| CSP/Permissions-Policy не ослабли      | Grep `index.html`; любой диф требует second-reviewer                          | На каждое PR-ревью  |
| `registerType` остаётся `prompt`       | Grep `vite.config.ts` на `autoUpdate`                                         | На каждое PR-ревью  |
| Новые внешние хосты                    | Grep на `http(s)://` в `src/` — должно быть пусто вне CSP / self-hosted       | На каждое PR-ревью  |
