// Pricely score API (Cloudflare Pages Function, D1 database bound as DB).
// POST {day:"dYYYYMMDD", uid, score} saves one score per player per day
// and returns every score for that day so the game can draw the real curve.
// GET ?day=dYYYYMMDD returns the scores without saving.

const MAX_SCORE = 700;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// Accept only today or yesterday (US Eastern time), so old days can't be stuffed.
function allowedDays() {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" });
  const now = Date.now();
  return [0, 1].map((d) => "d" + fmt.format(new Date(now - d * 86400000)).replace(/-/g, ""));
}

async function scoresFor(db, day) {
  const { results } = await db
    .prepare("SELECT score FROM scores WHERE day = ? LIMIT 5000")
    .bind(day)
    .all();
  return results.map((r) => r.score);
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
  const { day, uid, score } = body || {};
  if (typeof day !== "string" || !allowedDays().includes(day)) return json({ error: "bad day" }, 400);
  if (typeof uid !== "string" || uid.length < 8 || uid.length > 64) return json({ error: "bad uid" }, 400);
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) return json({ error: "bad score" }, 400);

  await env.DB
    .prepare("INSERT OR IGNORE INTO scores (day, uid, score, created_at) VALUES (?, ?, ?, ?)")
    .bind(day, uid, score, Date.now())
    .run();
  return json({ scores: await scoresFor(env.DB, day) });
}

export async function onRequestGet({ request, env }) {
  const day = new URL(request.url).searchParams.get("day");
  if (!day || !/^d\d{8}$/.test(day)) return json({ error: "bad day" }, 400);
  return json({ scores: await scoresFor(env.DB, day) });
}
