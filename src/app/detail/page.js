"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function EditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // ดึงค่า ID ที่พ่วงมาจากหน้าแรก
  const initialStatus = searchParams.get("status"); // ดึงค่า Status มาจากหน้าแรก

  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState(initialStatus || 'ทำอยู่'); // เริ่มต้นสถานะเป็น "ทำอยู่"
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลงานเก่าจากหลังบ้านมาใส่ในช่องกรอกทันทีที่เปิดหน้านี้
  useEffect(() => {
    if (!id) return;

    const fetchCurrentTask = async () => {
      try {
        const response = await fetch(`/api/tasks?id=${id}`);
        const data = await response.json();
        if (data) {
          setTaskTitle(data.title); // เอาชื่องานเก่าไปลงใน Input
        }
        setLoading(false);
      } catch (error) {
        console.error("ดึงข้อมูลงานล้มเหลว:", error);
        setLoading(false);
      }
    };

    fetchCurrentTask();
  }, [id]);

  // ฟังก์ชันสำหรับสลับสถานะงานในฟอร์มนี้เลย (ทำอยู่ 🔁 เสร็จแล้ว)
  const toggleStatusInForm = () => {
    setTaskStatus((prevStatus) =>
      prevStatus === "ทำอยู่" ? "เสร็จแล้ว" : "ทำอยู่",
    );
  };

  // ฟังก์ชันยิงข้อมูลไปกดบันทึกที่หลังบ้าน
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, title: taskTitle, status: taskStatus }), // ส่ง id, ชื่องาน , สเตตัสใหม่ไปให้หลังบ้าน
      });

      if (response.ok) {
        alert("🎉 แก้ไขชื่องานสำเร็จ!");
        router.push("/"); // บันทึกเสร็จแล้วสั่งให้เด้งกลับหน้าแรกทันที
        router.refresh();
      }
    } catch (error) {
      console.error("อัปเดตงานล้มเหลว:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-400 animate-pulse">กำลังอ่านสถานะจากฐานข้อมูล...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdateSubmit} className="space-y-4">
      {/* // ช่องกรอกสำหรับแก้ไขชื่องาน */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          แก้ไขชื่องาน':
        </label>
        <input  
          type="text"
          value={taskTitle || ""} // ป้องกันค่า undefined ในกรณีที่ยังไม่โหลดข้อมูล
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white border border-slate-600"
          placeholder="พิมพ์ชื่องานใหม่..."
        />
      </div>
      <div className="flex items-center gap-4">
        สถานะ: {taskStatus}
        {/* // แสดงสถานะเดิม */}
        <button
          type="button"
          onClick={toggleStatusInForm}
          className={`text-m px-4 py-2 rounded-lg transition-colors ${taskStatus === "เสร็จแล้ว" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600 text-white"}`}
        >
          {taskStatus === "เสร็จแล้ว" ? '"ทำอยู่"' : "เสร็จ"}
        </button>
      </div>

      {/* // ปุ่มบันทึกและยกเลิก */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition-colors"
        >
          💾 บันทึกการแก้ไข
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

// ห่อหุ้มด้วย Suspense เพื่อให้ Next.js ถอดรหัส URL พารามิเตอร์ได้อย่างปลอดภัย
export default function EditDetailPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6">
          📝 หน้าแก้ไขรายละเอียดงาน
        </h1>
        <Suspense
          fallback={
            <p className="text-center text-slate-400">กำลังจัดเตรียมฟอร์ม...</p>
          }
        >
          <EditForm />
        </Suspense>
      </div>
    </main>
  );
}
