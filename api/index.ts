import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import MongoStore from "connect-mongo";
import { connectToDatabase } from "../server/mongodb";
import { registerRoutes } from "../server/routes";

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files if any exist in working dir
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Global CORS setup for Cloudflare Worker and direct cross-origin calls
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Normalize URL for Express routing if Vercel stripped the /api prefix
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.url.startsWith("/api") && req.url !== "/" && req.url !== "/sitemap.xml" && !req.url.startsWith("/uploads")) {
    req.url = `/api${req.url}`;
  }
  next();
});

// Session configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || (process.env.MONGODB_URI ? 'mongodb' : 'simple');
let sessionStore: any = undefined;

if (STORAGE_TYPE === 'mongodb' && process.env.MONGODB_URI) {
  try {
    sessionStore = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      stringify: false,
    });
  } catch (err: any) {
    console.warn("⚠️ MongoStore setup warning:", err.message);
  }
}

const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
};
app.use(session(sessionConfig));

// Root API status endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "online",
    message: "FullPortfolioHub Backend API running on Vercel",
    timestamp: new Date().toISOString()
  });
});

// Register routes directly onto Express app
registerRoutes(app).catch(err => {
  console.error("❌ Error registering routes:", err);
});

// Connect to MongoDB asynchronously if enabled
if (STORAGE_TYPE === 'mongodb' && process.env.MONGODB_URI) {
  connectToDatabase().catch(err => {
    console.warn("⚠️ MongoDB async connection warning:", err.message);
  });
}

export default app;
