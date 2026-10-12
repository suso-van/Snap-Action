# SnapAction backend API contract

This is the implementation contract for connecting a backend to the existing
frontend. It separates the three endpoints the current UI already calls from
proposed future endpoints for real authentication and cross-device sync.

## Conventions

- API prefix: `/api`
- Current client requests and responses use JSON.
- JSON property names are camelCase.
- Dates returned inside extracted values/action details should be ISO 8601
  strings with timezone information when a precise instant is known. The
  frontend still displays entity `value`s as strings.
- Confidence values are in the inclusive range `0..1`.
- IDs are opaque strings. The backend should generate stable IDs for persisted
  records; the current local-only UI may generate temporary IDs itself.
- Return a non-2xx HTTP status on failure; do not return an empty success body
  for failed analysis/authentication.
- Error response shape:

  ```json
  {
    "error": {
      "code": "INVALID_IMAGE",
      "message": "The uploaded file is not a supported image.",
      "requestId": "req_..."
    }
  }
  ```

  `requestId` is recommended for server-log correlation. Do not return stack
  traces, provider credentials, or raw internal error messages to the client.
- The current server accepts JSON bodies up to 50 MB. Base64 expands images
  and is memory-heavy; enforce a sensible decoded-image limit, and consider
  adding multipart upload or pre-signed upload URLs before production.
- Never put a Gemini/provider API key in the app bundle or return it from an
  endpoint. All model calls must go through the server.

## Current endpoints: implement these first

### `GET /api/health`

Called when the app starts to determine whether the backend is reachable.

**Successful response — `200 OK`:**

```json
{
  "status": "ok",
  "time": "2026-10-12T03:43:46.647Z",
  "hasApiKey": true
}
```

`status` and `time` match the existing server's response. `hasApiKey` is
currently returned and can help development diagnostics, but it is optional
for the frontend (the current UI only checks whether the HTTP request
succeeded). For production, prefer a non-sensitive `aiAvailable` capability
flag or omit the key-presence field.

**Failure:** `503 Service Unavailable` if the server cannot serve requests.
The app should show the server as offline; it can still show local resources.

### `POST /api/analyze-screenshot`

Analyzes an uploaded/captured image and returns structured entities and actions.
Called for user images from Home or the result screen's upload control.
Built-in sample presets currently bypass this endpoint.

**Request:**

```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "mimeType": "image/jpeg",
  "filename": "boarding-pass.jpg"
}
```

- `imageBase64` is required for current UI calls and may be either a complete
  data URL or raw base64. Strip a data URL prefix before sending to an AI
  provider.
- `mimeType` is optional; current server defaults it to `image/jpeg`.
- `filename` is optional and is a display/context hint, not a trusted path.
- Existing server code also recognizes optional `sampleId`, but the current
  frontend never sends one. Preset demo handling can remain frontend-only.
- Validate MIME type and decoded byte size. Do not trust a filename extension
  as proof of content type.

**Successful response — `200 OK`:**

Return the analysis fields **at the top level**, as shown below:

```json
{
  "category": "ticket",
  "title": "Flight AI-302 to Delhi",
  "summary": "Air India Express flight from Kolkata to New Delhi on Aug 18, 2026.",
  "confidenceScore": 0.98,
  "categoryConfidence": 0.99,
  "warnings": [],
  "extractedEntities": [
    {
      "key": "flight_number",
      "label": "Flight Number",
      "value": "AI-302",
      "type": "text",
      "isEditable": true,
      "provenance": "extracted",
      "confidence": 0.99
    },
    {
      "key": "checkin_deadline",
      "label": "Check-in Deadline",
      "value": "2026-08-18T19:40:00+05:30",
      "type": "datetime",
      "isEditable": true,
      "provenance": "inferred",
      "confidence": 0.94,
      "boundingBox": [410, 220, 470, 620]
    }
  ],
  "suggestedActions": [
    {
      "id": "act_opaque_1",
      "title": "Add flight to calendar",
      "subtitle": "AI-302 · Kolkata to New Delhi",
      "actionType": "calendar",
      "riskLevel": "low",
      "isPrimary": true,
      "details": {
        "eventTitle": "Flight AI-302 to Delhi",
        "datetime": "2026-08-18T20:40:00+05:30",
        "endDate": "2026-08-18T22:55:00+05:30",
        "location": "Kolkata (CCU) to New Delhi (DEL)"
      }
    }
  ],
  "ocrText": "AIR INDIA EXPRESS ...",
  "boundingBoxes": [
    {
      "label": "Flight Number",
      "box": [410, 220, 470, 620]
    }
  ]
}
```

Required analysis fields: `category`, `title`, `summary`,
`confidenceScore`, `extractedEntities`, and `suggestedActions`. Return zero or
more warnings and entities/actions as appropriate; `none` and `unclear` are
valid categories, not API failures. Each entity's optional box uses the
`[ymin, xmin, ymax, xmax]` coordinate order on a `0..1000` scale. Entity
`provenance` is `extracted`, `inferred`, or `verified`.

Action types must be one of `calendar`, `reminder`, `map`, `pay`, `track`,
`task`, `copy`, `share`, `call`, `email`, `contact`, `open_link`, or
`open_github`. `details` may contain the category-relevant fields listed in
`src/types.ts` / `FRONTEND_FEATURES.md`. Generate stable, unique action IDs
within a result. Provide roughly 2–4 relevant actions when the image supports
them; return an empty list rather than inventing actions.

**Important existing mismatch:** the current `server.ts` wraps Gemini output as
`{ "status": "success", "result": { ...analysis fields... } }`, while
`src/App.tsx` currently reads `title`, `category`, `extractedEntities`, etc.
directly from the response root. Implement the flat response above, or update
the frontend to unwrap `result` before returning the response. Do not leave
these shapes inconsistent. The current no-API-key server response
`{ "status": "simulated", "message": "...", "result": null }` also does not
provide an analysis for the current UI to display; return a genuine result or
an explicit non-2xx error instead of a success-shaped `null`.

**Errors:**

| HTTP | Code example | When |
|---|---|---|
| `400` | `INVALID_REQUEST` | Missing image, malformed request, invalid MIME type. |
| `413` | `IMAGE_TOO_LARGE` | Request or decoded image exceeds configured size limit. |
| `415` | `UNSUPPORTED_MEDIA_TYPE` | Not a supported image. |
| `422` | `ANALYSIS_FAILED` | Image is valid but cannot be analyzed; use category `unclear` for a normal low-legibility result instead. |
| `429` | `RATE_LIMITED` | Per-user/IP or provider rate limit reached. |
| `502`/`503` | `AI_PROVIDER_UNAVAILABLE` | AI provider is unavailable or not configured. |

For provider timeouts, set a documented request timeout and return a clear
retryable error. Avoid returning the uploaded image or sensitive prompt
contents in logs.

### `POST /api/ask-screenshot`

Answers a question grounded in the open screenshot's extracted context and
optionally its original image. Each frontend call currently sends one question;
conversation history is held only in component memory and is not sent.

**Request:**

```json
{
  "question": "What is the deadline?",
  "screenshotData": {
    "category": "ticket",
    "title": "Flight AI-302 to Delhi",
    "summary": "Flight from Kolkata to New Delhi.",
    "extractedEntities": [
      {
        "key": "checkin_deadline",
        "label": "Check-in Deadline",
        "value": "2026-08-18T19:40:00+05:30",
        "type": "datetime"
      }
    ],
    "ocrText": "AIR INDIA EXPRESS ..."
  },
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "mimeType": "image/jpeg"
}
```

- `question` is required and must be non-empty.
- `screenshotData` is the context subset the current client sends; support
  missing optional fields.
- `imageBase64` is optional and only sent when `imageSrc` is an image data URL.
- `mimeType` is optional and defaults to `image/jpeg`.

**Successful response — `200 OK`:**

```json
{
  "answer": "Check-in closes at 7:40 PM on Aug 18, 2026.",
  "suggestedFollowups": [
    "When does boarding begin?",
    "What terminal is the flight from?"
  ]
}
```

The answer should be concise and grounded only in the supplied screenshot
context/image. Follow-ups are optional for the UI but should be an array of
short strings (usually 2–3).

**Errors:** `400 INVALID_REQUEST` for a missing question, `413 IMAGE_TOO_LARGE`
for an oversized optional image, `429 RATE_LIMITED`, and `502`/`503
AI_PROVIDER_UNAVAILABLE` for provider errors. The UI currently falls back to
a local contextual answer if the request fails.

## Future endpoints: auth and cloud sync

The following endpoints are recommendations for the backend phase after the
frontend's mock sign-in and local-only persistence are replaced. They are not
currently called by the frontend. Agree on session and sync behavior before
implementing them.

### Authentication

Do not implement social login by accepting a client-supplied `AuthUser`. The
frontend currently simulates Google/GitHub/Facebook/email sign-in; a production
flow needs actual provider verification and frontend callback integration.

Recommended options:

- OAuth/OIDC authorization-code flow with PKCE for Google/GitHub/Facebook.
- Email registration/login with server-side password hashing, verification,
  reset tokens, rate limits, and session rotation.
- Secure, revocable server sessions (prefer HttpOnly/Secure/SameSite cookies
  where the app's WebView/deployment topology supports them; otherwise define
  short-lived access plus refresh tokens and safe native storage).

Possible API shape once the client flow is agreed:

| Method and path | Purpose |
|---|---|
| `GET /api/auth/providers` | Advertise enabled providers and auth capabilities. |
| `GET /api/auth/{provider}/start` | Start OAuth/OIDC; bind `state` and PKCE challenge. |
| `GET /api/auth/{provider}/callback` | Validate state/code and establish a session; never trust profile claims without provider verification. |
| `POST /api/auth/email/register` | Create an email account after server validation. |
| `POST /api/auth/email/login` | Authenticate and establish a session. |
| `POST /api/auth/logout` | Revoke the current session. |
| `GET /api/auth/me` | Return the verified current user and tier. |
| `POST /api/auth/password/forgot` | Request a reset without disclosing whether an account exists. |
| `POST /api/auth/password/reset` | Consume a short-lived, single-use reset token. |

Use `401 UNAUTHENTICATED` for missing/expired sessions and `403 FORBIDDEN` for
authenticated users lacking permission. Do not expose whether an email exists
in login/reset errors.

### Cloud resource sync

The current app stores screenshots, executed actions, and settings in browser /
WebView local storage. The account UI suggests sync, but no sync request is
currently made. Before enabling cloud sync, define conflict resolution,
deletion propagation, image retention, and whether screenshots are uploaded
or only their extracted metadata.

Suggested authenticated endpoints:

| Method and path | Purpose |
|---|---|
| `GET /api/v1/me` | Verified profile, tier, and sync capabilities. |
| `GET /api/v1/resources?cursor=...&limit=...` | Paginated user's screenshot resources; allow category/saved/archived filters if needed. |
| `POST /api/v1/resources` | Create a resource from an analysis result and optional uploaded image reference. |
| `GET /api/v1/resources/{resourceId}` | Fetch one owned resource and its analysis/action data. |
| `PATCH /api/v1/resources/{resourceId}` | Update user-editable fields, saved/archive state, or other explicitly supported metadata. |
| `DELETE /api/v1/resources/{resourceId}` | Delete an owned resource and apply the documented image-retention policy. |
| `GET /api/v1/actions?cursor=...&limit=...` | Paginated executed actions for the user. |
| `POST /api/v1/actions` | Persist an action created from a suggested action. |
| `PATCH /api/v1/actions/{actionId}` | Update status such as active/completed/snoozed. |
| `DELETE /api/v1/actions/{actionId}` | Delete an owned action. |
| `GET /api/v1/settings` | Fetch server-side user settings. |
| `PATCH /api/v1/settings` | Save settings with partial-update semantics. |

For mobile/offline use, add idempotency keys to create/batch operations and
use an `updatedAt` or revision/ETag field to detect concurrent edits. A sync
endpoint can be added later if individual CRUD calls are too chatty, but its
cursor and conflict semantics must be explicit.

Example persisted resource shape:

```json
{
  "id": "res_opaque",
  "createdAt": "2026-10-12T03:43:46.647Z",
  "updatedAt": "2026-10-12T03:43:46.647Z",
  "category": "ticket",
  "title": "Flight AI-302 to Delhi",
  "summary": "Flight from Kolkata to New Delhi.",
  "confidenceScore": 0.98,
  "categoryConfidence": 0.99,
  "warnings": [],
  "extractedEntities": [],
  "suggestedActions": [],
  "executedActions": [],
  "ocrText": "AIR INDIA EXPRESS ...",
  "image": {
    "contentType": "image/jpeg",
    "url": "server-controlled-or-short-lived-url"
  },
  "isSavedToLibrary": false,
  "isArchived": false
}
```

The backend derives the owner from the verified session, not this JSON. Do not
persist or return a `data:` URL for large images; use a controlled object-store
reference or omit the original image when local-only storage is selected.
Do not upload `isPreset: true` built-in samples unless the product explicitly
decides to sync sample data.

## Settings model

Current TypeScript defaults in `src/utils/storage.ts`:

```json
{
  "autoDetectActions": true,
  "requireConfirmation": "high_impact_only",
  "defaultReminderOffset": "1h",
  "defaultCalendar": "google",
  "storeScreenshotsLocally": true,
  "cloudSync": false,
  "hapticFeedback": true,
  "theme": "dark",
  "deviceFrame": "mobile"
}
```

`requireConfirmation` values are `all`, `high_impact_only`, and `none`.
`defaultCalendar` values in the shared type are `google`, `apple`, and `ics`
(the current Profile selector only exposes Google and Apple/ICS). Other
enumerations are in `src/types.ts`. Validate server updates against the shared
contract and preserve unspecified values on PATCH.

## Security, privacy, and operational requirements

- Authenticate every future user-owned resource, action, and settings route.
  Scope every query by the verified user ID.
- Validate request size, MIME type, JSON shape, allowed enum values, string
  lengths, and date formats.
- Apply per-user/IP rate limits to analysis, Ask AI, auth, and upload routes.
- Keep provider secrets server-side; do not expose them through health checks,
  errors, source maps, or logs.
- Treat images, OCR, extracted contacts, payment details, and questions as
  sensitive user data. Define retention/deletion and avoid logging payloads.
- Do not execute payments or other consequential actions from model output.
  Suggested actions are untrusted suggestions; the user reviews/executes them
  on-device.
- Use TLS in deployed environments. The current localhost/cleartext
  configuration is for local USB/emulator development only.

