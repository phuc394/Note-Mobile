# Note Mobile Backend

## Render deploy

- Root Directory: `backend`
- Build Command: `npm ci --omit=dev`
- Start Command: `npm start`
- Health Check Path: `/health`

Set the variables from `.env.example` in Render Environment. Do not upload `.env`.

Use `CLIENT_ORIGIN` for allowed browser origins. Multiple origins can be comma-separated. React Native requests normally have no `Origin` header and are allowed.
