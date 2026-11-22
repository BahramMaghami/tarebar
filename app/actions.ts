"use server";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, tokenHash, requireAdmin } from "@/lib/auth";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function authenticate(_: { error: string }, form: FormData) {
 const email = String(form.get("email") ?? "").trim().toLowerCase(); const password = String(form.get("password") ?? "");
 if (!/^[a-z0-9.]+@gmail\.com$/.test(email) || password.length < 8 || password.length > 128) return { error: "Gmail معتبر و رمز عبور بین ۸ تا ۱۲۸ کاراکتر وارد کنید." };
 let user = await db.user.findUnique({ where: { email } });
 if (form.get("mode") === "register") { if (user) return { error: "ثبت‌نام ممکن نیست؛ با حساب خود وارد شوید." }; try { user = await db.user.create({ data: { email, password: hashPassword(password) } }); } catch { return { error: "ثبت‌نام انجام نشد. دوباره تلاش کنید." }; } }
 else if (!user || !verifyPassword(password, user.password)) return { error: "ایمیل یا رمز عبور صحیح نیست." };
 if (!user) return { error: "ورود ناموفق بود." };
 const token = randomBytes(32).toString("hex"); const expires = new Date(Date.now() + 604800000);
 await db.session.create({ data: { token: tokenHash(token), userId: user.id, expires } });
 (await cookies()).set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires, path: "/" });
 redirect(user.role === "ADMIN" ? "/admin" : "/");
}
export async function logout() { const jar = await cookies(); const token = jar.get("session")?.value; if (token) await db.session.deleteMany({ where: { token: tokenHash(token) } }); jar.delete("session"); redirect("/"); }
export async function saveFruit(_: { error: string }, form: FormData) {
 await requireAdmin(); const name = String(form.get("name") ?? "").trim(); const price = Number(form.get("price")); const category = String(form.get("category")); const image = String(form.get("image") ?? "").trim(); const id = Number(form.get("id"));
 if (!name || name.length > 80 || !Number.isSafeInteger(price) || price < 1 || price > 100000000 || !["میوه فصل", "مرکبات", "میوه استوایی"].includes(category) || !/^https:\/\//.test(image)) return { error: "نام، قیمت مثبت و آدرس HTTPS تصویر را بررسی کنید." };
 const data = { name, price, category, image, available: form.get("available") === "on" };
 if (id) await db.fruit.update({ where: { id }, data }); else await db.fruit.create({ data });
 revalidatePath("/"); revalidatePath("/admin"); redirect("/admin?saved=1");
}
export async function deleteFruit(form: FormData) { await requireAdmin(); await db.fruit.deleteMany({ where: { id: Number(form.get("id")) } }); revalidatePath("/"); revalidatePath("/admin"); }
