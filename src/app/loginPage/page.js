'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // แปลงค่าที่กรอกเข้ามาให้เป็นตัวเลข เพื่อเอาไปเช็กเงื่อนไข ID
    const idNum = Number(userId);

    // 🔒 จำลองระบบตรวจสอบเงื่อนไข 
    if (!userId || !password) {
      setErrorMessage('กรุณากรอก ID และรหัสผ่านให้ครบถ้วน');
      return;
    }

    // สมมติฐาน: รหัสผ่านของทุกคนคือ '1234' เหมือนกันไปก่อนเพื่อความง่าย
    if (password !== '1234') {
      setErrorMessage('รหัสผ่านไม่ถูกต้อง! (ลองใช้ 1234)');
      return;
    }

    // คัดกรองประเภทผู้ใช้ตามเงื่อนไขของเจ้า
    if (idNum === 1) {
      // กรณีเป็น Admin (ID = 1)
      localStorage.setItem('userRole', 'admin'); // บันทึกสิทธิ์ลงเครื่องคอม
      localStorage.setItem('currentUserId', userId);
      router.push('/'); // พาไปหน้าหลัก (หรือหน้าเฉพาะ Admin ที่เจ้าต้องการ)
      router.refresh();
    } 
    else if (idNum >= 10 && idNum <= 99) {
      // กรณีเป็นผู้ใช้ทั่วไป (ID มี 2 หลัก เช่น 11, 12, 99)
      localStorage.setItem('userRole', 'user'); // บันทึกสิทธิ์ลงเครื่องคอม
      localStorage.setItem('currentUserId', userId);
      router.push('/'); // พาไปหน้าหลัก
      router.refresh();
    } 
    else {
      // ถ้ากรอก ID เลขอื่นที่ไม่อยู่ในเงื่อนไข
      setErrorMessage('ไม่พบ ID นี้ในระบบ (Admin ใช้ 1, User ใช้เลข 2 หลัก)');
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-400 mb-2">🔐 ระบบเข้าสู่ระบบ</h1>
          <p className="text-sm text-slate-400">ระบุ ID ของเจ้าเพื่อสวมสิทธิ์ทำงาน</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* ช่องกรอก ID */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">รหัสประจำตัว (ID):</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Admin กรอก 1 / User กรอกเลข 2 หลัก"
              className="w-full px-4 py-2.5 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white border border-slate-600 font-mono"
            />
          </div>

          {/* ช่องกรอก รหัสผ่าน */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">รหัสผ่าน (Password):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน (ใช้ 1234)"
              className="w-full px-4 py-2.5 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white border border-slate-600"
            />
          </div>

          {/* ป้ายแสดง Error */}
          {errorMessage && (
            <p className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 text-center font-medium animate-shake">
              {errorMessage}
            </p>
          )}

          {/* ปุ่มล็อกอิน */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/30 text-lg mt-2"
          >
            เข้าสู่ระบบ 🚀
          </button>
        </form>
      </div>
    </main>
  );
}