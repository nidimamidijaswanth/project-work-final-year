# FocusAI Android Wrapper

This folder is a Capacitor Android wrapper for the deployed FocusAI web app.

It loads:

```text
https://focusai-nine.vercel.app
```

The Vercel frontend talks to the Railway backend exactly like the deployed web app does, so this does not disturb Vercel or Railway deployment.

## Run With Connected Android Mobile

Enable USB debugging on your phone, connect it to the laptop, then run:

```powershell
cd C:\Users\prane\COHORT-HARKIRAT\FocusAI\android
npm install
npm run build
npx cap sync android
npx cap run android
```

If Capacitor asks you to choose a target, select your connected Android phone.

## Run In Android Studio

1. Open Android Studio.
2. `File > Open`
3. Select this folder:

```text
C:\Users\prane\COHORT-HARKIRAT\FocusAI\android
```

4. Let Gradle sync finish.
5. Select your connected phone.
6. Press Run.

## Commands

Prepare Capacitor web fallback:

```powershell
npm run build
```

Sync Android native project:

```powershell
npx cap sync android
```

Build and install on connected Android phone:

```powershell
npx cap run android
```

## Notes

- Do not run `npm run build` inside `android\app`.
- Run all npm and Capacitor commands from the `android` folder.
- The Android app is a wrapper. The live UI still comes from Vercel.
- Login works through the same deployed FocusAI authentication flow.
