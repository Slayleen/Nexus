import { useState } from "react";
import { api } from "@/api";
import { PageHead, Avatar, Reputation, Chips } from "@/components/common";
import { Sparkle, ArrowRight, ChatCircleDots } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EXAMPLES = [
  "I want to build a robotics project for the science fair",
  "I need two teammates for an AI hackathon",
  "I want to publish a biology research paper",
  "I need a frontend developer for my startup",
  "I want friends interested in neuroscience",
];

export default function Match() {
  const nav = useNavigate();
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);

  const run = async (g) => {
    const query = g ?? goal;
    if (!query.trim()) return;
    setGoal(query);
    setLoading(true);
    setMatches(null);
    try {
      const { data } = await api.post("/match", { goal: query });
      setMatches(data.matches);
      if (!data.matches.length) toast.info("No strong matches yet — try rephrasing your goal.");
    } catch {
      toast.error("Matching failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
      <PageHead label="Nexus AI Matchmaker" title="Tell me your goal." />

      <div className="nb-card p-3 mb-4">
        <div className="flex items-center gap-2 px-2 py-1 mb-2">
          <Sparkle size={18} weight="fill" className="text-[#FF7B54]" />
          <span className="nb-label">Describe what you want to build or who you need</span>
        </div>
        <textarea
          className="nb-input min-h-[90px] resize-none"
          placeholder="e.g. I'm building a medical AI app and need a frontend developer + a biology researcher…"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          data-testid="match-input"
        />
        <button className="nb-btn w-full justify-center mt-3" onClick={() => run()} disabled={loading} data-testid="match-submit">
          {loading ? "Thinking…" : <>Find my matches <ArrowRight size={18} weight="bold" /></>}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {EXAMPLES.map((ex) => (
          <button key={ex} className="nb-chip bg-white nb-card-hover" onClick={() => run(ex)} data-testid="match-example">
            {ex}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="font-display text-2xl font-black animate-pulse">Nexus is finding your team…</div>
        </div>
      )}

      {matches && (
        <div className="space-y-4" data-testid="match-results">
          <h2 className="font-display text-2xl font-bold tracking-tight">{matches.length} great matches</h2>
          {matches.map((m) => (
            <div key={m.student.id} className="nb-card nb-card-hover p-5 fade-up" data-testid={`match-card-${m.student.id}`}>
              <div className="flex items-start gap-4">
                <Avatar src={m.student.avatar} name={m.student.name} className="w-14 h-14" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-display text-xl font-bold">{m.student.name}</div>
                      <div className="text-xs text-[#4A4A4A]">{m.student.grade} · {m.student.school}</div>
                    </div>
                    <span className="nb-chip bg-[#2ECC71] text-white">{m.score}% match</span>
                  </div>

                  <div className="nb-card bg-[#A0C4FF] p-3 mt-3 flex gap-2">
                    <Sparkle size={18} weight="fill" className="text-[#FF7B54] shrink-0 mt-0.5" />
                    <p className="text-sm font-bold">{m.reason}</p>
                  </div>

                  <div className="mt-3"><Chips items={m.student.skills} color="bg-[#FFD166]" /></div>
                  <div className="mt-2"><Reputation rep={m.student.reputation} /></div>

                  <button
                    className="nb-btn nb-btn-sec text-sm mt-4"
                    onClick={() => nav("/app/messages", { state: { to: m.student } })}
                    data-testid={`match-message-${m.student.id}`}
                  >
                    <ChatCircleDots size={16} weight="bold" /> Message {m.student.name.split(" ")[0]}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
