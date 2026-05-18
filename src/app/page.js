'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]); // เริ่มต้นให้เป็น Array ว่างๆ
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true); // สเตตสำหรับบอกว่ากำลังโหลดข้อมูลอยู่ไหม

  // ดึงข้อมูลจากหลังบ้านเมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    fetchTasks();
  }, []);

  // ฟังก์ชันสำหรับวิ่งไปเอาข้อมูลจาก API หลังบ้าน
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('โหลดข้อมูลล้มเหลว:', error);
      setLoading(false);
    }
  };

  // ฟังก์ชันส่งข้อมูลงานใหม่ไปบันทึกที่หลังบ้าน
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      // ยิง POST API ไปที่หลังบ้าน
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask })
      });

      if (response.ok) {
        // ถ้าหลังบ้านบอกว่าบันทึกสำเร็จ ให้ดึงข้อมูลใหม่มาแสดงทันที
        fetchTasks();
        setNewTask(''); // ล้างช่องกรอก
      }
    } catch (error) {
      console.error('เพิ่มงานล้มเหลว:', error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-md mx-auto bg-slate-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 border border-slate-700">
        
        <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6">
          📌 Mini Task Board (Full-Stack)
        </h1>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="เพิ่มงานใหม่ที่ต้องทำ..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
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
          <p className="text-center text-slate-400">กำลังโหลดข้อมูลจากหลังบ้าน...</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-slate-700 p-4 rounded-lg border border-slate-600"
              >
                <span className={task.status === 'เสร็จแล้ว' ? 'line-through text-slate-400' : 'text-white'}>
                  {task.title}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                  task.status === 'เสร็จแล้ว' ? 'bg-slate-600 text-slate-300' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}