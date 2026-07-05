# AK Strannik Admin

Vite/React administrative application.

## Development

The development server intentionally has no default API target. Set an explicit,
non-production backend in `apps/admin/.env.local`:

```dotenv
ADMIN_DEV_API_ORIGIN=http://localhost:8080
```

Then run:

```sh
pnpm --filter @ak-strannik/admin dev
```

The API must expose `/api/v1/admin/auth/*`. Both successful login and `/me`
responses must include a non-empty `csrfToken`; the latter is required to restore
CSRF protection after a browser reload. Session cookies should be `HttpOnly`,
`Secure` in production, and use an appropriate `SameSite` policy.
