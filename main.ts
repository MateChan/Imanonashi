import { Hono } from "hono/mod.ts";
import { api } from "misskey-js";
import { Note, User } from "misskey-js/entities";

type Webhook =
  & {
    server: string;
    hookId: string;
    userId: string;
    eventId: string;
    createdAt: string;
  }
  & ({
    type: "follow" | "followed" | "unfollow";
    body: { user: User };
  } | {
    type: "note" | "renote" | "reply" | "mention";
    body: { note: Note };
  });

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

  const { type, body }: Webhook = await c.req.json();

  if (type === "note") {
    const { text, id: noteId } = body.note;
    if (text === "いまのなし") {
      const notes = await misskey.request("users/notes", {
        userId: body.note.userId,
        limit: 2,
      });
      misskey.request("notes/delete", { noteId: notes[1].id });
    } else if (text?.endsWith("すぐ消す")) {
      setTimeout(() => {
        misskey.request("notes/delete", { noteId });
      }, 60 * 1000);
    }
  }

  return c.text("ok");
});

Deno.serve(app.fetch);
