import React from "react";
import { WarningCircle } from "@phosphor-icons/react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Deseja continuar?",
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bolt-yellow-100 text-bolt-yellow-700">
            <WarningCircle size={26} weight="fill" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-bolt-neutral-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-bolt-neutral-600">{description}</p>}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-bolt-neutral-200 px-4 py-3 font-semibold text-bolt-neutral-700 transition hover:bg-bolt-neutral-50"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-bolt-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-bolt-primary-700 disabled:opacity-60"
          >
            {loading ? "Processando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
