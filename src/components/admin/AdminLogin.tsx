import { useState } from "react";
import { motion } from "framer-motion";
import { login } from "../../lib/firebase";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
        className="w-full max-w-sm rounded-[1.75rem] bg-white p-8 shadow-[var(--shadow-lift)] ring-1 ring-espresso-900/[0.04]"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso-900">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-cream-100">
              <path
                d="M4 9h13v5a5.5 5.5 0 0 1-5.5 5.5h-2A5.5 5.5 0 0 1 4 14V9Z"
                fill="currentColor"
                fillOpacity="0.92"
              />
              <path
                d="M17 10.5h1.5a2.5 2.5 0 0 1 0 5H17"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-espresso-900">تسجيل دخول الموظفين</h1>
            <p className="mt-1 text-sm text-espresso-300">لوحة تحكم المتجر</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="rounded-2xl border border-espresso-900/[0.08] bg-cream-50 px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="rounded-2xl border border-espresso-900/[0.08] bg-cream-50 px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
          />

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-espresso-900 px-5 py-3.5 text-sm font-semibold text-cream-50 transition-all duration-150 ease-out active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "جاري تسجيل الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
