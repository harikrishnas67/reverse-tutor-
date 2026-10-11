# Reverse Tutor – installable app (PWA), free setup

Everything below uses free plans: Firebase (Spark), Netlify (free), Gemini API (free tier).

## Step 1 – Get a Gemini API key
1. Go to aistudio.google.com/apikey and sign in with Google.
2. Click "Create API key" and copy it. Keep it secret.

## Step 2 – Firebase (sign-in + database)
1. console.firebase.google.com -> Add project (name it, skip Analytics).
2. Build -> Authentication -> Get started -> Sign-in method -> Google -> Enable -> Save.
3. Build -> Firestore Database -> Create database -> production mode -> pick a nearby region (e.g. asia-south1).
4. Firestore -> Rules tab -> delete everything, paste the contents of `firestore.rules` -> Publish.
5. Project settings (gear) -> General -> "Your apps" -> Web icon (</>) -> register app -> copy the firebaseConfig values.
6. Open `config.js` and replace the four PASTE_ values (apiKey, authDomain, projectId, appId).

## Step 3 – Put the code on GitHub
1. Unzip this folder. Create a new repository at github.com (private is fine).
2. Upload all files (index.html, config.js, platform.js, sw.js, manifest.webmanifest, netlify.toml, firestore.rules, icons/, netlify/).
   Make sure the `netlify/functions/ai.js` path is kept.

## Step 4 – Deploy on Netlify
1. app.netlify.com -> Add new site -> Import an existing project -> GitHub -> choose the repo.
2. Build command: leave empty. Publish directory: `.` -> Deploy.
3. Site configuration -> Environment variables -> add:
   - GEMINI_API_KEY = your key from Step 1
   - FIREBASE_API_KEY = the apiKey value from config.js
   - GEMINI_MODEL = optional (default: gemini-flash-latest)
4. Deploys -> Trigger deploy -> Deploy site (so the variables take effect).
5. Copy your site address (e.g. yourapp.netlify.app).

## Step 5 – Allow your site to sign in
Firebase -> Authentication -> Settings -> Authorized domains -> Add domain -> paste yourapp.netlify.app.

## Step 6 – Test
1. Open your site. If a banner says "Sign in with Google", sign in; the page reloads.
2. Try Teach -> submit an explanation -> you should get 5 questions (AI working).
3. Take a Chapter Quiz and post in Discuss to check the database.

## Step 7 – Install on phone
- Android (Chrome): open the site -> menu (3 dots) -> Install app.
- iPhone (Safari): Share -> Add to Home Screen.

## Troubleshooting
- "Setup needed" banner: config.js still has PASTE_ values, or you did not redeploy.
- Sign-in popup fails: the Netlify domain is missing from Authorized domains (Step 5).
- Quizzes show "AI unavailable": check GEMINI_API_KEY and FIREBASE_API_KEY in Netlify, then redeploy. Free-tier limits may also be hit; wait a minute.
- Leaderboard empty / "Could not save": Firestore rules not published (Step 2.4).
- If a Gemini model is retired, set GEMINI_MODEL in Netlify to a current Flash model ID from ai.google.dev/models.

## Notes
- Free-tier Gemini may use prompts to improve Google's models; tell users not to enter private data.
- Each user can make 60 AI calls per hour. Attachments are disabled in this version.
