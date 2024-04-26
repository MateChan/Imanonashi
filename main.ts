import { Hono } from "hono/mod.ts";
import { api } from "misskey-js";

const {
  MISSKEY_HOSTNAME,
  MISSKEY_TOKEN,
  MISSKEY_WEBHOOK_SECRET,
} = Deno.env.toObject();

const misskey = new api.APIClient({
  origin: `https://${MISSKEY_HOSTNAME}`,
  credential: MISSKEY_TOKEN,
});

const app = new Hono();

app.post("/", async (c) => {
  if (MISSKEY_WEBHOOK_SECRET !== c.req.header("X-Misskey-Hook-Secret")) {
    return c.text("invalid webhook secret", 401);
  }

  const { type, body } = await c.req.json();

  if (type === "note" && body?.note.text === "いまのなし") {
    const notes = await misskey.request("users/notes", {
      userId: body?.note.userId,
      limit: 2,
    });
    misskey.request("notes/delete", { noteId: notes[1].id });
  }

  return c.text("ok");
});

Deno.serve(app.fetch);
