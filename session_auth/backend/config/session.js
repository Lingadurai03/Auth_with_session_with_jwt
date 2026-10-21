import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import pg from "pg";
import "dotenv/config";

const PgSession = connectPgSimple(session);

const pgPool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const sessionMiddleWare = session({
  store: new PgSession({
    pool: pgPool,
    createTableIfMissing: true,
  }),

  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
});
