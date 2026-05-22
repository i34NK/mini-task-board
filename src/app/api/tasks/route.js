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

// 3. PATCH Method: รองรับการแก้ไขทั้งชื่องาน (title) และสถานะ (status)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, title, status } = body;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),   // ถ้าส่ง title มาให้แก้ title
        ...(status && { status })  // ถ้าส่ง status มาให้แก้ status
      }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'แก้ไขข้อมูลล้มเหลว' }, { status: 500 });
  }
}

// 4. DELETE Method: สำหรับรับรหัสงาน (id) มาลบออกจากฐานข้อมูลจริง
export async function DELETE(request) {
  try {
    const body = await request.json(); // รับ id ของงานที่ต้องการลบ
    const { id } = body;
    // ใช้ Prisma สั่งลบข้อมูลในตาราง Task แบบถาวร
    await prisma.task.delete({
      where: { id: Number(id) } // ค้นหางานด้วย id แล้วลบออกจากฐานข้อมูล
    });
    return NextResponse.json({ message: 'ลบงานสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ error: 'ลบงานจาก Database ล้มเหลว' }, { status: 500 });
  }
}