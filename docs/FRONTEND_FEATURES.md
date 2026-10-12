# SnapAction frontend feature guide

This document describes the frontend as currently implemented. It is intended
to help backend work preserve the existing screens, data shapes, and user
flows.

## App at a glance

SnapAction turns an image of useful information into a categorized resource,
editable extracted fields, and suggested actions. The app is a React 19 and
TypeScript single-page application. On Android, Capacitor hosts that same web
frontend in a WebView; Android's native entry point is Java.

- Frontend entry: `src/main.tsx`
- Main navigation, app state, API calls, and local actions: `src/App.tsx`
- Shared TypeScript data contracts: `src/types.ts`
- Current development server and AI API implementation: `server.ts`
- Persistent browser/WebView storage: `src/utils/storage.ts`

## App navigation and screens

The four persistent bottom-navigation tabs are:

| Tab | Frontend behavior |
|---|---|
| Home | Upload, capture, paste, or choose a sample screenshot; browse recent items and sample resources. |
| History | Search resources and OCR text, filter by category/saved/archived, switch list/grid layout, open a result, save/archive, delete, or clear history. |
| Actions | View actions created from screenshots; filter by all/tasks/calendar/packages/completed, mark complete/incomplete, delete, reopen the source screenshot, and export calendar events. |
| Profile | View guest/account details; change the implemented auto-detect and default-calendar settings; see local counts, export a JSON backup, and clear local app data. |

The header stays visible and contains the app brand and the single sign-in entry
point for guests. Authenticated users see an account control that opens Profile.
When viewing screenshot details or an analysis error, the header provides a
back control and the bottom tabs are hidden.

### Home

- Accepts image files from the file picker, drag-and-drop on supported
  platforms, and clipboard image paste when clipboard access is available.
- Opens an in-app camera using `getUserMedia`, can switch front/rear camera,
  and captures an image for analysis.
- Offers built-in sample screenshots grouped by category for demos. Selecting
  a preset is currently handled entirely in the frontend; it does not call the
  analysis API.
- Shows recent screenshot resources and allows opening them.

### Analysis and result

The app shows a processing screen, then opens a result screen or an "unclear"
error screen. A result can display:

- Category, title, summary, confidence, warnings, and the original screenshot.
- Extracted entities, including type, confidence, provenance, editability, and
  optional warning metadata.
- Suggested actions with a type, title, subtitle, risk, primary flag, and
  category-specific `details`.
- Inline entity edits and an edit-fields modal.
- Original-image collapse and lightbox/zoom.
- Ask AI about this screenshot.
- Save/star, archive, delete, or upload/analyze another screenshot.

Supported categories are `ticket`, `travel` (legacy alias), `payment`,
`receipt`, `package`, `address`, `task`, `event`, `contact`, `link`, `github`,
`document`, `other`, `unclear`, and `none`.

`unclear` opens the error flow. `none` is a valid non-actionable analysis
category and should not be treated as a transport error.

### Actions

Suggested action types are `calendar`, `reminder`, `map`, `pay`, `track`,
`task`, `copy`, `share`, `call`, `email`, `contact`, `open_link`, and
`open_github`.

Execution is presently a frontend operation, not an action-execution API:

- Calendar events open a Google Calendar URL or download an ICS file.
- Map, call, email, and link actions open device/browser URL handlers.
- Contact actions download a vCard.
- Copy actions write text to the clipboard.
- Other action types are represented in the local Actions list.
- The confirmation setting currently requests confirmation for all actions or
  selected high-impact types (calendar, pay, reminder).
- A tracking action currently receives demo tracking data in the frontend.

When executed, an action is stored locally as an `ExecutedAction` with status
`active`. The Actions tab can change that status to `completed` or delete the
action. There is no current backend API for executing third-party actions,
package-carrier tracking, or persisting the action list.

### History and local resource management

History is a locally stored array of `ScreenshotItem`s. Search covers title,
summary, extracted entity labels/values, and OCR text. Category filters and
saved/archived state are applied in the frontend. Save/archive toggles,
deletes, and clear-history operations currently update local storage only.

The original image is retained as `imageSrc`, often a `data:image/...;base64`
data URL. Built-in sample resources are mixed into initial local data. A
backend must distinguish demo presets from user-owned resources if it is to
persist/sync resources; do not upload demo samples as if they were user
captures.

### Profile, onboarding, and account status

- First launch can show a three-step onboarding modal. Its seen flag is local.
- Profile currently exposes the auto-detect-actions checkbox and default
  calendar selection (`google` or `apple`/ICS).
- The `UserSettings` model has additional values for reminder offset,
  confirmation policy, local storage, cloud sync, haptics, theme, and device
  frame. Several have defaults but no active Profile control or backend
  behavior yet.
- JSON backup export and clear-all-data are local operations.
- Sign-in/sign-up controls currently create mock users after a short delay.
  Google, GitHub, Facebook, and email login are **not real authentication**
  integrations. Forgot-password is also a UI-only notice. Do not treat the
  client-provided `AuthUser` object as verified identity.
- `cloudSync` defaults to `false`; there is no current cloud-sync client flow.

## Frontend data contracts

The canonical detailed TypeScript definitions are in `src/types.ts`. The
following is a concise shape reference for backend responses and persisted
records.

### Analysis result

```ts
type Category =
  | 'ticket' | 'travel' | 'payment' | 'receipt' | 'package' | 'address'
  | 'task' | 'event' | 'contact' | 'link' | 'github' | 'document'
  | 'other' | 'unclear' | 'none';

type EntityProvenance = 'extracted' | 'inferred' | 'verified';

interface ExtractedEntity {
  key: string;
  label: string;
  value: string;
  type?: 'text' | 'datetime' | 'currency' | 'location' | 'tracking'
    | 'phone' | 'email' | 'url' | 'status' | 'code' | 'badge';
  isEditable?: boolean;
  boundingBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax], 0..1000
  provenance?: EntityProvenance;
  confidence?: number; // 0..1
  isWarning?: boolean;
  warningMessage?: string;
}

interface AnalysisResult {
  category: Category;
  title: string;
  summary: string;
  confidenceScore: number; // 0..1
  categoryConfidence?: number; // supported by the model, not currently required by UI
  warnings?: string[];
  extractedEntities: ExtractedEntity[];
  suggestedActions: SuggestedAction[];
  ocrText?: string;
}
```

### Suggested and executed actions

`SuggestedAction` has `id`, `title`, `subtitle`, `actionType`, optional
`riskLevel` (`low` or `high`), optional `isPrimary`, optional `iconName`, and a
`details` object. The details object supports:

`eventTitle`, `datetime`, `endDate`, `location`, `amount`, `currency`,
`merchant`, `dueDate`, `paymentRef`, `trackingNumber`, `carrier`,
`destination`, `orderNumber`, `taskTitle`, `priority` (`High`, `Medium`,
`Low`), `project`, `address`, `placeName`, `phone`, `email`, `contactName`,
`organization`, `titleRole`, `productName`, `warrantyDate`, `url`, `repoName`,
`repoOwner`, `cloneUrl`, `notes`, `mapQuery`, and `actionUrl`.

An `ExecutedAction` additionally has `screenshotId`, `actionId`, `executedAt`
(epoch milliseconds), status (`active`, `completed`, `snoozed`), optional
category, details, and optional carrier-tracking information.

### Local resource

`ScreenshotItem` is the frontend's complete resource record. It combines a
client-generated `id`, epoch-millisecond `timestamp`, analysis fields, original
`imageSrc`, optional OCR text, entities, suggested and executed actions,
optional `isPreset`/`presetBadge`, saved/archive booleans, warnings, and
optional category confidence. Backends should not require the client to send
trustworthy ownership or server timestamps; derive those from the session and
server.

## Frontend persistence keys

The current browser/WebView storage keys are:

| Key | Purpose |
|---|---|
| `snapaction_screenshots_v2` | Screenshot resources, including sample presets. |
| `snapaction_executed_actions_v2` | Executed action list. |
| `snapaction_settings_v1` | User settings. |
| `snapaction_onboarding_seen_v1` | Onboarding completion flag. |
| `snapaction_auth_user_v1` | Mock signed-in user; not an authentication credential. |

These are local persistence details, not a recommended server database schema.

## Current backend integration boundary

The only routes currently called by the frontend are:

1. `GET /api/health` on startup.
2. `POST /api/analyze-screenshot` for a user-provided image.
3. `POST /api/ask-screenshot` for contextual questions about the open result.

Analysis fields are read from the **top level** of the analysis JSON by
`src/App.tsx`. Ask AI reads `answer` and optionally `suggestedFollowups`.
Authentication, resource CRUD/sync, settings sync, and action persistence have
not yet been wired to backend calls.

