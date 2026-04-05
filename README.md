# Arcana Vault — Real Bot UI Patch

This patch wires the existing web chat UI to the real VPS bot API by adding server-side proxy routes and replacing the placeholder chat page with a live multilingual Oracle portal.

## What this patch adds

- `app/chat/page.tsx`
  - Replaces the placeholder chat route with a live client component.
- `app/components/OraclePortal.tsx`
  - Full UI for tradition selection, mode selection, language switching, voice recording, voice reply playback, starter prompts, and follow-up prompts.
- `lib/oracle-ui.ts`
  - Source-backed pack/mode config and all EN/TR/RU copy.
- `app/api/oracle/*/route.ts`
  - Same-origin Next.js proxy routes for:
    - `/api/oracle/health`
    - `/api/oracle/ask`
    - `/api/oracle/tts`
    - `/api/oracle/stt`
    - `/api/oracle/checkout`

## Why the proxy layer matters

The uploaded VPS API already exposes `/ask`, `/tts`, `/stt`, and `/checkout`, but its CORS allow-list is domain-specific. Routing browser traffic through Next.js proxy routes keeps the frontend working on Vercel preview domains too and avoids exposing the bot host directly in the client.

## Environment variable needed

Set this in Vercel and in local `.env.local`:

```bash
ORACLE_API_BASE=https://YOUR-VPS-DOMAIN-OR-IP
```

Examples:

```bash
ORACLE_API_BASE=https://vault-api.yourdomain.com
```

## Files to back up before applying

- `app/chat/page.tsx`

## Source-backed voice rules used

These are taken from the uploaded VPS bot source where available:

- Tao voice-enabled modes: `oracle`, `seeker`, `quote`
- Tarot voice-enabled modes: `oracle`, `seeker`, `reading`, `quote`, `shadow`, `pathwork`
- Tantra voice-enabled modes: `oracle`, `seeker`, `dharana`, `surrender`, `quote`
- Plant / entheogen: generic web handling added because the API supports the collection but the uploaded Telegram module set did not include a dedicated plant module file

## Notes

- UI language defaults to English.
- Switching EN/TR/RU changes all labels, starter prompts, follow-ups, and the response language sent to the backend.
- Voice reply automatically disables itself when the selected mode is not voice-enabled.
- Voice input uses browser `MediaRecorder` -> `/api/oracle/stt`.
- Voice output uses `/api/oracle/tts` and plays back the returned OGG audio.
