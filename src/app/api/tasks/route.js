import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ดึงสะพานเชื่อมฐานข้อมูลมาใช้

// 1. GET Method: ดึงข้อมูลจากฐานข้อมูลจริง SQLite ส่งไปหน้าบ้าน
export async function GET() {
  try {
    // ใช้ Prisma ดึงงานทั้งหมดในฐานข้อมูล และเรียงตามเวลาที่สร้างจากใหม่ไปเก่า
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'ดึงข้อมูลจาก Database ล้มเหลว' }, { status: 500 });
  }
}

// 2. POST Method: รับข้อมูลงานใหม่จากหน้าบ้านไปบันทึกลงฐานข้อมูลจริง
export async function POST(request) {
  try {
    const body = await request.json();
    
    // ใช้ Prisma บันทึกข้อมูลลงตาราง Task บนฮาร์ดดิสก์แบบถาวร
    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        status: 'ทำอยู่'
      }
    });
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'บันทึกลง Database ล้มเหลว' }, { status: 500 });
  }
}