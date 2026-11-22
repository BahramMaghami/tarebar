import { LoginForm } from '@/components/forms';
import { currentUser } from '@/lib/auth';
import { logout } from '@/app/actions';
import Link from 'next/link';
export const dynamic='force-dynamic';
export default async function Login(){const user=await currentUser();return <main id="main" className="narrow"><span className="eyebrow">به تره‌بار خوش آمدید</span><h1>{user?'حساب کاربری':'تازگی از اینجا شروع می‌شود'}</h1>{user?<><p dir="ltr">{user.email}</p>{user.role==='ADMIN'&&<Link className="button" href="/admin">پنل مدیریت</Link>}<form action={logout}><button className="outline">خروج از حساب</button></form></>:<><p className="muted">با Gmail و رمز عبور خود وارد شوید یا حساب بسازید.</p><LoginForm/></>}</main>}
