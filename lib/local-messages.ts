import path from "node:path";
import fs from "node:fs/promises";
import sqlite3 from "sqlite3";

type SqliteDatabase = sqlite3.Database;

type LocalMessageRow = {
  id: string;
  content: string;
  room_id: string | null;
  email: string | null;
  sender_name: string | null;
  created_at: string;
};

type InsertLocalMessageInput = {
  id: string;
  roomId: string;
  content: string;
  email?: string;
  senderName?: string;
  createdAtISO: string;
};

const DB_DIR = path.join(process.cwd(), ".local-data");
const DB_PATH = path.join(DB_DIR, "messages.sqlite");

let dbPromise: Promise<SqliteDatabase> | null = null;

function openDb(): Promise<SqliteDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = (async () => {
    await fs.mkdir(DB_DIR, { recursive: true });
    return await new Promise<SqliteDatabase>((resolve, reject) => {
      const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(db);
      });
    });
  })();

  return dbPromise;
}

async function exec(sql: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

async function all<T>(sql: string, params: unknown[] = []) {
  const db = await openDb();
  return await new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows as T[])));
  });
}

async function run(sql: string, params: unknown[] = []) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    db.run(sql, params, (err) => (err ? reject(err) : resolve()));
  });
}

export async function ensureLocalMessagesDb() {
  await exec(`
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      room_id TEXT,
      content TEXT NOT NULL,
      email TEXT,
      sender_name TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_messages_room_created ON messages(room_id, created_at);
  `);
}

export async function listLocalMessages(roomId: string) {
  await ensureLocalMessagesDb();
  return await all<LocalMessageRow>(
    `SELECT id, content, room_id, email, sender_name, created_at
     FROM messages
     WHERE room_id = ?
     ORDER BY created_at ASC`,
    [roomId]
  );
}

export async function insertLocalMessage(input: InsertLocalMessageInput) {
  await ensureLocalMessagesDb();
  await run(
    `INSERT INTO messages (id, room_id, content, email, sender_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.id,
      input.roomId,
      input.content,
      input.email || null,
      input.senderName || null,
      input.createdAtISO,
    ]
  );
}
