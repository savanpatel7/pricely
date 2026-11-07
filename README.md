# Pricely

Daily 8-bit price guessing game, deployed as a Cloudflare Worker with static assets.

- `public/index.html` - the whole game
- `src/worker.js` - score API at /api/score (one score per player per day), everything else served from public/
- `schema.sql` - the D1 table
- `wrangler.jsonc` - Worker config; `database_id` must be the real D1 id of `pricely-scores`

Deploy command: `npx wrangler deploy`
