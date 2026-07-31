# Community authentication and profile architecture

## Collections

- `community_users`: private account record (`id`, normalized `email`, bcrypt `password_hash`, reset token, timestamps). This collection is never returned from public endpoints.
- `community_profiles`: one record per `owner_id`, containing only community profile fields, selected personality type, visibility, consent, and timestamps. `username` and `owner_id` must be unique indexes in production.

## Authorization

Bearer JWTs identify an account. Create, update, deactivate, and delete profile endpoints resolve ownership from the JWT—not request data. Public profiles are visible to everyone; members-only profiles require a valid session; hidden profiles are never returned by directory or public-profile endpoints.

## Environment

Set `MONGO_URL`, `DB_NAME`, `JWT_SECRET` (long, random production value), and `CORS_ORIGINS`. Password reset delivery additionally needs `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `CONTACT_FROM_EMAIL`.

## Local development

Install `backend/requirements.txt`, configure a local MongoDB database and the variables above, then run the FastAPI application. Run `npm start` from `frontend`. Community profiles are real backend records; `mockMembers.js` remains only as a migration reference and must not seed production data.
