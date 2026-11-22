# تره‌بار — MVP بازار میوه

رابط فارسی و RTL، جستجو و دسته‌بندی، نمایش قیمت به تومان، ثبت‌نام و ورود Gmail + رمز، پنل مدیر برای افزودن/ویرایش/حذف، و صفحه موقت `/purchase`.

## اجرا

نیازمندی: Node.js 20.19+ (یا 22.12+) و npm.

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run db:generate
# در ویندوز اگر دیتابیس هنوز وجود ندارد:
if (!(Test-Path dev.db)) { New-Item -ItemType File dev.db }
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

## حساب مدیر

در `.env` مقدار `ADMIN_EMAIL` را Gmail خود و `ADMIN_PASSWORD` را رمز حداقل ۱۲ کاراکتری قرار دهید، سپس `npm.cmd run db:seed` را اجرا کنید. این دستور حساب مدیر را ایجاد می‌کند یا رمز همان حساب را تغییر می‌دهد. پس از ساخت مدیر، رمز را از `.env` حذف کنید. ورود از `/login` و مدیریت از `/admin` است. کاربران ثبت‌نام‌شده همواره نقش USER دارند.

این ورود از نوع credentials است؛ ارسال ایمیل، تأیید مالکیت Gmail، OAuth و بازیابی رمز در این MVP پیاده نشده‌اند. مرور بازار عمومی است.

## داده و زیرساخت

Prisma 7 با adapter رسمی better-sqlite3، SQLite محلی در `dev.db`، migration ثبت‌شده و seed غیرتکراری. قیمت‌ها و محصولات اولیه صرفاً نمایشی‌اند. تصاویر از Unsplash دریافت می‌شوند. عملیات نوشتن با Next.js Server Actions و بررسی دسترسی مدیر اجرا می‌شوند. رمزها با scrypt هش و sessionهای تصادفی به‌صورت هش در دیتابیس ذخیره می‌شوند.

برای استقرار SQLite به دیسک ماندگار و یک instance نیاز است؛ برای استقرار چند instance یا serverless دیتابیس اشتراکی انتخاب کنید. در production کوکی secure به HTTPS نیاز دارد.

## بررسی

```powershell
npm.cmd run lint
npm.cmd run build
```

راهنمای طراحی محلی: `.agents/skills/ui-ux-pro-max/SKILL.md`؛ سبک ساده، رنگ سبز، کنترل‌های قابل استفاده با کیبورد و چیدمان واکنش‌گرا.

## PostgreSQL deployment update

The active provider is now PostgreSQL (Neon). Set DATABASE_URL in .env and Vercel. Run npm run db:generate, npm run db:migrate, and npm run db:seed. PostgreSQL migrations live in prisma/postgres-migrations; prisma/migrations contains historical SQLite migrations and is not used. Local SQLite setup instructions above are superseded. Admin seed requires a Gmail address and password of at least 12 characters.
