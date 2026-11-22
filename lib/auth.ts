import { cookies } from "next/headers";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "./db";
import { redirect } from "next/navigation";
export function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return salt + ":" + scryptSync(password, salt, 64).toString("hex"); }
export function verifyPassword(password: string, hash: string) { const [salt, key] = hash.split(":"); return timingSafeEqual(Buffer.from(key, "hex"), scryptSync(password, salt, 64)); }
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export async function currentUser() { const token = (await cookies()).get("session")?.value; if (!token) return null; const session = await db.session.findUnique({ where: { token: tokenHash(token) }, include: { user: true } }); return session && session.expires > new Date() ? session.user : null; }
export async function requireAdmin() { const user = await currentUser(); if (user?.role !== "ADMIN") redirect("/login"); return user; }
