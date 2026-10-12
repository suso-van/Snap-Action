<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/10ac1aeb-ac95-4652-be4e-d1ff89422b15

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run in the Android emulator

**Prerequisites:** Android Studio with the Android SDK and an AVD, Java 17, and Bun.

1. Install dependencies: `bun install`
2. Start the `Medium_Phone` AVD: `emulator -avd Medium_Phone`
3. Start the app server in another terminal: `bun run dev`
4. Forward the development server to the emulator: `adb reverse tcp:3000 tcp:3000`
5. Build and launch the Android app: `bun run android:run`

## Run on a USB-connected Android phone

Enable Developer options and USB debugging on the phone, connect it to the computer,
and accept the debugging authorization prompt. With the development server running:

1. Find the phone's device serial: `adb devices -l`
2. Forward the development server: `adb -s <device-serial> reverse tcp:3000 tcp:3000`
3. Build and install the app: `bunx cap run android --target <device-serial>`

The Capacitor Android project uses Java; no Kotlin source is needed.
