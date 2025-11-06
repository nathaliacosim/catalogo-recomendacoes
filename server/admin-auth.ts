import { Request, Response, NextFunction } from "express";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

export interface AdminSession {
  token: string;
  expiresAt: number;
}

/**
 * Gera um token simples para admin
 */
export function generateAdminToken(): string {
  return Buffer.from(`admin-${Date.now()}-${Math.random()}`).toString("base64");
}

/**
 * Valida a senha do admin
 */
export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Middleware para verificar token de admin
 */
export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Validar token (simples - em produção use JWT)
  // Por enquanto, aceitamos qualquer token que tenha sido gerado
  if (!token.startsWith("admin-")) {
    return res.status(401).json({ error: "Token inválido" });
  }

  next();
}
