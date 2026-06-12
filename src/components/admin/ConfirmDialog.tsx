import { AnimatePresence, motion } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "حذف",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onCancel}
            className="absolute inset-0 bg-espresso-900/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-sm rounded-[1.5rem] bg-cream-50 p-6 text-center shadow-[var(--shadow-lift)]"
          >
            <h3 className="font-display text-lg font-semibold text-espresso-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso-500">{description}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-full bg-espresso-50 px-4 py-3 text-sm font-semibold text-espresso-700 transition-transform duration-150 ease-out active:scale-[0.97]"
              >
                إلغاء
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.97]"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
