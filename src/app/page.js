"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; 
import { useRouter } from "next/navigation"; 

export default function Home() {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true); 

  const [userRole, setUserRole] = useState(null); 
  const [currentUserId, setCurrentUserId] = useState(null); 
  const router = useRouter();

  // ดึงข้อมูลจากหลังบ้านเมื่อเปิดหน้าเว็บครั้งแรก และเช็กสิทธิ์ผู้ใช้
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("currentUserId");

    if (!role || !userId) {
      router.push("/loginPage");
      return;
    }

    setUserRole(role);
    setCurrentUserId(userId);
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    router.push("/loginPage"); 
  };

  // ฟังก์ชันสำหรับวิ่งไปเอาข้อมูลจาก API หลังบ้าน
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("โหลดข้อมูลล้มเหลว:", error);
      setLoading(false);
    }
  };

  // ฟังก์ชันส่งข้อมูลงานใหม่ไปบันทึกที่หลังบ้าน
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });

      if (response.ok) {
        fetchTasks();
        setNewTask(""); 
      }
    } catch (error) {
      console.error("เพิ่มงานล้มเหลว:", error);
    }
  };

  // ฟังก์ชันสำหรับสลับสถานะงาน (ทำอยู่ 🔁 เสร็จแล้ว)
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "ทำอยู่" ? "เสร็จแล้ว" : "ทำอยู่";

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, status: nextStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("แก้ไขสถานะล้มเหลว:", error);
    }
  };

  // ฟังก์ชันสำหรับลบงาน
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("ลบงานล้มเหลว:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* ส่วนหัวแสดงการต้อนรับ */}
      <div className="max-w-md mx-auto md:max-w-2xl flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <h2>
          สวัสดี:{" "}
          {userRole === "admin"
            ? <span className="text-emerald-400 font-bold">👑 ผู้ควบคุมระบบ (Admin)</span>
            : <span className="text-amber-400 font-mono">👨‍💻 ผู้ใช้รหัส {currentUserId}</span>}
        </h2>
        <button
          onClick={handleLogout}
          className="text-xs bg-rose-600 hover:bg-rose-700 font-bold px-3 py-2 rounded-lg transition-colors"
        >
          ออกจากระบบ 🚪
        </button>
      </div>

      {/* 🟢 ลบปุ่มทดสอบโบราณตรงนี้ที่เคยฟ้องว่า handleDelete is not defined ออกไปแล้วเรียบร้อย! */}

      <div className="max-w-md mx-auto bg-slate-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 border border-slate-700">
        <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6">
          Mini Task Board
        </h1>

        {/* ฟอร์มเพิ่มงาน */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="เพิ่มงานใหม่ที่ต้องทำ..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white border border-slate-600"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg transition-colors"
          >
            เพิ่มงาน
          </button>
        </form>

        {/* แสดงข้อความระหว่างรอโหลดข้อมูล */}
        {loading ? (
          <p className="text-center text-slate-400 animate-pulse">
            กำลังโหลดข้อมูลจากหลังบ้าน...
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-700 p-4 rounded-lg border border-slate-600 gap-3"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <span
                    className={
                      task.status === "เสร็จแล้ว"
                        ? "line-through text-slate-400"
                        : "text-white font-medium"
                    }
                  >
                    {task.title}
                  </span>

                  {/* ระบบสลับปุ่มความปลอดภัย: แอดมินกดสลับด่วนได้ ยูสเซอร์ดูได้อย่างเดียว */}
                  {userRole === "admin" ? (
                    <button
                      onClick={() => handleToggleStatus(task.id, task.status)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all active:scale-95 ${
                        task.status === "เสร็จแล้ว"
                          ? "bg-slate-600 text-slate-300"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {task.status} 🔁
                    </button>
                  ) : (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.status === "เสร็จแล้ว"
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : "bg-amber-500/10 text-amber-500/70 border border-amber-500/20"
                      }`}
                    >
                      {task.status}
                    </span>
                  )}
                </div>

                {/* 🟢 ซ่อมจุดที่โหว่: เติมปุ่มแก้ไขกับลบที่หุ้มด้วยสิทธิ์การคัดกรอง Admin ชัดเจน 100% */}
                <div className="flex gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t border-slate-600 sm:border-0">
                  {userRole === "admin" ? (
                    <>
                      <Link
                        href={`/detail?id=${task.id}&status=${task.status}`} 
                        className="text-xs bg-slate-600 hover:bg-slate-500 text-emerald-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-slate-500"
                      >
                        ⚙️ แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🗑️ ลบ
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1.5 rounded border border-slate-700/50 italic">
                      👁️ อ่านอย่างเดียว
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}