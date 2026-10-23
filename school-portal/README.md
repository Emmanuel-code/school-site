# GH School portal (Next.js 14, App Router)
npm install && npm run dev  -> http://localhost:3000
Routes: / (public site), /login, /portal/{parent|student|teacher|admin}
Demo data lives in lib/data.js. Next: real auth (NextAuth/Clerk), a database (Postgres + Prisma), payments (Paystack/Hubtel).
Setup wizard: first launch asks school type, name, contact, levels, colour (lib/data.js applyDemo fills portal content).
