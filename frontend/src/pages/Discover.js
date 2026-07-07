import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { PageHead, Avatar, Reputation, Chips } from "@/components/common";
import { ChatCircleDots, Star, MagnifyingGlass } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function Discover() {
  const nav = useNavigate();
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");

  const load = () => api.get("/students").then((r) => setStudents(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const endorse = async (s) => {
    try {
      await api.post(`/students/${s.id}/endorse`);
      toast.success(`You endorsed ${s.name.split(" ")[0]}! 🌟`);
      load();
    } catch { toast.error("Could not endorse."); }
  };

  const shown = students.filter((s) => {
    const hay = `${s.name} ${s.school} ${(s.skills || []).join(" ")} ${(s.interests || []).join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-10 py-8">
      <PageHead label="Discover students" title="Find your people." />

      <div className="nb-card flex items-center gap-2 px-4 mb-6 max-w-md">
        <MagnifyingGlass size={20} weight="bold" className="text-[#4A4A4A]" />
        <input className="flex-1 py-3 outline-none bg-transparent font-medium" placeholder="Search by skill, interest or school…"
          value={q} onChange={(e) => setQ(e.target.value)} data-testid="discover-search" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((s) => (
          <div key={s.id} className="nb-card nb-card-hover p-5 flex flex-col" data-testid={`student-${s.id}`}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={s.avatar} name={s.name} className="w-14 h-14" />
              <div className="min-w-0">
                <div className="font-display text-lg font-bold truncate">{s.name}</div>
                <div className="text-xs text-[#4A4A4A] truncate">{s.grade} · {s.school}</div>
              </div>
            </div>
            <p className="text-sm text-[#4A4A4A] font-medium line-clamp-2 mb-3">{s.bio}</p>
            <div className="mb-2"><Chips items={s.skills} color="bg-[#FFD166]" /></div>
            {s.looking_for?.length > 0 && (
              <div className="mb-3">
                <div className="nb-label mb-1">Looking for</div>
                <Chips items={s.looking_for} color="bg-[#A0C4FF]" />
              </div>
            )}
            <div className="mb-4"><Reputation rep={s.reputation} /></div>
            <div className="mt-auto flex gap-2">
              <button className="nb-btn nb-btn-sec text-sm py-2 flex-1" onClick={() => nav("/app/messages", { state: { to: s } })} data-testid={`message-${s.id}`}>
                <ChatCircleDots size={16} weight="bold" /> Message
              </button>
              <button className="nb-btn nb-btn-ghost text-sm py-2" onClick={() => endorse(s)} data-testid={`endorse-${s.id}`}>
                <Star size={16} weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
