# Deployment

## 1. MongoDB Atlas

1. Create a free shared cluster at MongoDB Atlas.
2. Create a database user and password.
3. Add the Render outbound IP access rule. For a simple demo, use `0.0.0.0/0`.
4. Copy the driver connection string and replace its placeholders.

## 2. Push the repository

This workspace is not currently a git repository. From the project root:

```powershell
git init
git add .
git commit -m "Prepare gym membership app for deployment"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
```

Do not commit `server/.env`, `client/.env`, or real credentials.

## 3. Render API

Create a Render Web Service from the repository. Use:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

Set these environment variables in Render:

- `MONGO_URI`: Atlas connection string
- `JWT_SECRET`: long random secret
- `PORT`: `10000`
- `CLIENT_URL`: final Vercel/Netlify frontend URL

The same settings are available in `server/render.yaml`.

## 4. Vercel frontend

Create a Vercel project from the same repository and set the root directory to `client`.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://<render-service>.onrender.com/api`

`client/vercel.json` preserves React Router routes on refresh.

## 5. Smoke test

Open the deployed frontend in a private browser session and verify:

1. Register and log in.
2. Create a plan.
3. Create a member against that plan.
4. Renew the member.
5. Check in the active member.
6. Open the expiring-members widget.
7. Confirm the browser console has no CORS or environment errors.
