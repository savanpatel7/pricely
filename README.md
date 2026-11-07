# Pricely

Daily 8-bit price guessing game. Static page plus one Cloudflare Pages Function for scores.

- `index.html` - the whole game
- `functions/api/score.js` - saves one score per player per day, returns that day's scores
- `schema.sql` - the D1 table

## Cloudflare setup
1. Workers & Pages > Create > Pages > Connect to Git > pick this repo. Build command: none. Output directory: `/`.
2. Storage & Databases > D1 > Create database named `pricely-scores`. Open its Console and run the contents of `schema.sql`.
3. Pages project > Settings > Bindings > Add > D1 database. Variable name `DB`, database `pricely-scores`. Then redeploy.
