import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { connectMongoDB } from "../server/mongodb";
import path from "path";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao MongoDB
connectMongoDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

// tRPC routes
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Servir arquivos estáticos do frontend
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// SPA fallback - servir index.html para todas as rotas não-API
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
