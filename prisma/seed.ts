import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { randomBytes,scryptSync } from 'node:crypto';
const db=new PrismaClient({adapter:new PrismaBetterSqlite3({url:process.env.DATABASE_URL??'file:./dev.db'})});
async function main(){
const email=process.env.ADMIN_EMAIL;const password=process.env.ADMIN_PASSWORD;
if(email&&password){if(!/^[a-z0-9.]+@gmail\.com$/.test(email)||password.length<12)throw new Error('Use a Gmail address and an admin password of at least 12 characters.');const salt=randomBytes(16).toString('hex');await db.user.upsert({where:{email},update:{role:'ADMIN',password:salt+':'+scryptSync(password,salt,64).toString('hex')},create:{email,role:'ADMIN',password:salt+':'+scryptSync(password,salt,64).toString('hex')}});console.log('Admin account configured.');}
if(!await db.fruit.count()){const items=[['سیب قرمز دماوند',85000,'میوه فصل','photo-1560806887-1e4cd0b6cbd6'],['پرتقال آبدار شمال',65000,'مرکبات','photo-1547514701-42782101795e'],['موز تازه',125000,'میوه استوایی','photo-1571771894821-ce9b6c11b08e'],['توت‌فرنگی گلخانه‌ای',180000,'میوه فصل','photo-1464965911861-746a04b4bca6'],['انار سرخ ساوه',95000,'میوه فصل','photo-1541344999736-83eca272f6fc'],['کیوی تازه',78000,'میوه فصل','photo-1585059895524-72359e06133a'],['لیمو ترش',72000,'مرکبات','photo-1592321675774-3de57f3ee0dc'],['آناناس طلایی',210000,'میوه استوایی','photo-1550258987-190a2d41a8ba']];for(const [name,price,category,photo]of items)await db.fruit.create({data:{name:String(name),price:Number(price),category:String(category),image:`https://images.unsplash.com/${photo}?w=600&auto=format&fit=crop&q=80`}});console.log('Demo fruits seeded.');}}
main().finally(()=>db.$disconnect());
