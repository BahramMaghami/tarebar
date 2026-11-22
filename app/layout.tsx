import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import './globals.css';
export const metadata: Metadata = { title: 'تره‌بار | بازار تازه‌ها', description: 'میوه‌های تازه و قیمت‌های شفاف' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="fa" dir="rtl"><body><a className="skip" href="#main">رفتن به محتوا</a><header><Link className="brand" href="/"><Leaf size={30}/> تره‌بار<span>بازار تازه‌ها</span></Link><nav><Link href="/">بازار میوه</Link><Link href="/purchase">خرید</Link><Link className="outline" href="/login">حساب کاربری</Link></nav></header>{children}<footer><Link className="brand" href="/">تره‌بار</Link><span>تازگی، با یک نگاه.</span><small>نسخه نمایشی • قیمت‌ها به تومان هستند</small></footer></body></html> }
