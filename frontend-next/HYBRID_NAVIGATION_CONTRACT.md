# Hybrid navigation contract

The Next.js public shell and the proxied CRA application use this shared visual and functional contract without sharing build-time components.

| Token | Contract |
| --- | --- |
| Header height | 64px (`h-16`) |
| Content width | 1280px maximum (`max-w-7xl`) |
| Brand mark | 36px rounded-square gradient mark |
| Navigation | 14px medium text; pill hover/active treatment |
| Action controls | 40px minimum height; full-pill radius |
| Header spacing | 16px mobile, 24px small screens, 32px large screens |
| Compact navigation | Below 1280px (`xl`), use the accessible mobile menu |
| Guest links | Home, Take Test, 16 Types, About, Compare, Community, Jobs, Contact, Log in, Sign up, Language |
| Authenticated links | Guest links plus Connections, My Profile, Logout |

The CRA `AuthContext` remains the source of truth for session semantics. The Next.js shell only validates the same `kalqlater_auth_token` through the existing `/api/community/me` endpoint after hydration; it never renders account data server-side.
