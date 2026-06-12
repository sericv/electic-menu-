import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-espresso-900/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-cream-50 p-6 shadow-[var(--shadow-lift)] sm:max-w-lg sm:rounded-[1.75rem] sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-espresso-900 sm:text-2xl">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso-50 text-espresso-500 transition-transform duration-150 ease-out hover:text-espresso-900 active:scale-[0.94]"
                aria-label="إغلاق"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
