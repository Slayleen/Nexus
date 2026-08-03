import { useNavigate } from "react-router-dom";
import { useAuth } from "@/AuthContext";
import { DeviceMobile, SignOut } from "@phosphor-icons/react";

export default function TrialExpired() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <header className="bg-[#FDFBF7] border-b-2 border-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Nexus" className="w-9 h-9 rounded-lg border-2 border-[#0A0A0A] object-cover" />
            <span className="font-display text-xl font-black tracking-tight">Nexus</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 font-bold text-sm hover:underline" data-testid="trial-expired-logout">
            <SignOut size={16} weight="bold" /> Log out
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="nb-card max-w-lg w-full p-8 md:p-10 text-center" data-testid="trial-expired-card">
          <div className="w-14 h-14 mx-auto bg-[#FFD166] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center mb-6">
            <DeviceMobile size={28} weight="bold" />
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight mb-3">Your free trial has ended</h1>
          <p className="text-[#4A4A4A] font-medium mb-8">
            The Nexus website is a free 4-week beta. To keep finding teammates, joining
            projects, and building your portfolio, download the Nexus app.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <div className="nb-chip bg-white justify-center py-3 px-5 opacity-70 cursor-not-allowed" data-testid="trial-expired-app-store">
              App Store — coming soon
            </div>
            <div className="nb-chip bg-white justify-center py-3 px-5 opacity-70 cursor-not-allowed" data-testid="trial-expired-play-store">
              Google Play — coming soon
            </div>
          </div>

          <p className="text-xs text-[#4A4A4A] font-medium">
            Questions? Email us at{" "}
            <a href="mailto:support.nexused@gmail.com" className="font-bold underline">support.nexused@gmail.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
