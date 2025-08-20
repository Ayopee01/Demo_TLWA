// src/components/cart/CartFab.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiShoppingCart,
  FiX,
  FiTrash2,
  FiUpload,
  FiCopy,
  FiGlobe,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { subscribeCart, clearCart, removeFromCart } from "@/utils/cartStorage";
import { useUser } from "@/contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL || "";

/* ====== บัญชีโอนเงิน ====== */
const TH_BANK = {
  bankName: "ธนาคารกสิกรไทย (KBank)",
  accountName: "สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย",
  accountNumber: "170-8-06667-9",
};
const INTL_BANK = {
  type: "Current Account",
  accountNumber: "170-806-3696",
  beneficiary:
    "KASIKORN BANK PUBLIC COMPANY LIMITED, UBAN SQUARE (PRACHA CHUN 12)",
  tel: "(+66)2-591-0677",
  swift: "KASITHBK",
};

/* ---------------- Toast ---------------- */
function Toast({ open, type = "success", title, desc, onClose }) {
  if (!open) return null;
  const Icon = type === "success" ? FiCheckCircle : FiAlertTriangle;
  const tone =
    type === "success"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-rose-600 hover:bg-rose-700";
  return (
    <div className="fixed z-[120] top-6 right-6 w-[360px] rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden bg-white">
      <div className={`h-1 ${type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
      <div className="p-4 flex gap-3 items-start">
        <span className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-white ${tone}`}>
          <Icon />
        </span>
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          {desc && <div className="text-sm text-neutral-600 mt-0.5">{desc}</div>}
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100" aria-label="Close">
          <FiX />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Modal ชำระเงิน ---------------- */
function PaymentModal({ open, onClose, items, onSuccess }) {
  const { user } = useUser();
  const [method, setMethod] = useState("thai");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef(null);
  const total = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price || 0), 0),
    [items]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setMethod("thai");
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFileError("");
      setSubmitting(false);
    }
  }, [open, preview]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const handleFile = (f) => {
    const allow = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allow.includes(f.type)) {
      setFileError("รองรับเฉพาะ jpg, png, webp, gif");
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }
    // ✅ ตรงกับเซิร์ฟเวอร์: 5MB
    if (f.size > 5 * 1024 * 1024) {
      setFileError("ไฟล์ต้องไม่เกิน 5MB");
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }
    setFileError("");
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ---- Submit: สร้างออเดอร์ ---- */
  const handleSubmit = async () => {
    if (!user?.id) return alert("กรุณาเข้าสู่ระบบก่อนยืนยันการชำระเงิน");
    if (!method) return alert("กรุณาเลือกวิธีการชำระเงิน");
    if (!file) return alert("กรุณาอัปโหลดสลิปก่อนยืนยันการชำระเงิน");
    setSubmitting(true);

    try {
      const courseIds = items
        .map((it) => it.id)
        .filter((v) => Number.isFinite(+v));
      if (!courseIds.length) throw new Error("ไม่มีรายการคอร์สในตะกร้า");

      const fd = new FormData();
      fd.append("user_id", String(user.id));
      fd.append("course_ids", JSON.stringify(courseIds));
      fd.append("payment_method", method === "thai" ? "kbank" : "international");
      fd.append("slip", file);

      const res = await fetch(`${API_URL}/api/course_orders`, {
        method: "POST",
        body: fd,
      });

      // อ่าน payload หากมี
      let payload = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      // รองรับเคสไฟล์ใหญ่เกิน 5MB จาก BE
      if (res.status === 413) {
        throw new Error("ไฟล์สลิปใหญ่เกิน 5MB");
      }
      // เผื่อ BE มีป้องกันซื้อซ้ำ
      if (res.status === 409) {
        const dupId = payload?.duplicated_course_id;
        const dupName = items.find((it) => +it.id === +dupId)?.title;
        alert(
          (payload?.message || "คุณซื้อคอร์สนี้ไว้แล้ว") +
            (dupName ? `: ${dupName}` : "")
        );
        return;
      }
      if (!res.ok) {
        const msg =
          payload?.error ||
          payload?.message ||
          `HTTP ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }

      onSuccess?.(payload?.order_id);
      onClose();
    } catch (err) {
      console.error(err);
      alert(
        err.message || "เกิดข้อผิดพลาดระหว่างส่งคำสั่ง กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="w-full max-w-2xl rounded-3xl bg-white shadow-[0_24px_64px_rgba(0,0,0,.25)] ring-1 ring-black/10 overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="text-[18px] font-extrabold tracking-tight">
                Payment
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-rose-100 hover:text-rose-600 transition"
                aria-label="Close"
                title="Close"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>

          {/* body */}
          <div className="grid gap-5 p-6 md:grid-cols-2">
            {/* Left */}
            <div className="space-y-5">
              <div>
                <div className="text-sm font-semibold mb-2">
                  Select Transfer Method
                </div>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 rounded-2xl border p-3 cursor-pointer transition ${
                      method === "thai"
                        ? "border-indigo-500 ring-2 ring-indigo-200"
                        : "hover:bg-neutral-50"
                    }`}
                    onClick={() => setMethod("thai")}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={method === "thai"}
                      onChange={() => setMethod("thai")}
                    />
                    <div className="flex-1 font-medium">
                      Bank Transfer (Recommended)
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 rounded-2xl border p-3 cursor-pointer transition ${
                      method === "intl"
                        ? "border-indigo-500 ring-2 ring-indigo-200"
                        : "hover:bg-neutral-50"
                    }`}
                    onClick={() => setMethod("intl")}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={method === "intl"}
                      onChange={() => setMethod("intl")}
                    />
                    <div className="flex-1 font-medium">
                      International Transfer
                    </div>
                    <FiGlobe className="opacity-70" />
                  </label>
                </div>
              </div>

              {/* Upload + Preview */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  Upload Transfer Slip
                </div>
                {!preview ? (
                  <div
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) handleFile(f);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="rounded-2xl border-2 border-dashed p-6 text-center bg-white hover:bg-neutral-50 transition"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-black/5">
                        <FiUpload />
                      </span>
                      <div className="text-sm text-neutral-600">
                        Drag & drop here or{" "}
                        <button
                          onClick={() => inputRef.current?.click()}
                          className="text-indigo-600 underline underline-offset-2"
                        >
                          choose file
                        </button>{" "}
                        (≤ 5MB)
                      </div>
                      {fileError && (
                        <div className="text-sm text-rose-600">{fileError}</div>
                      )}
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFile(f);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl border bg-white p-2">
                    <img
                      src={preview}
                      alt="slip preview"
                      className="mx-auto max-h-56 object-contain rounded-xl"
                    />
                    <button
                      onClick={removeFile}
                      className="absolute top-2 right-2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/90 text-neutral-700 ring-1 ring-black/10 shadow hover:bg-rose-500 hover:text-white transition"
                      aria-label="Delete Slip Image"
                      title="Delete Slip Image"
                    >
                      <FiX />
                    </button>
                    <div className="px-1.5 py-2 text-xs text-neutral-500 truncate">
                      {file?.name}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div>
                <div className="text-sm font-semibold mb-2">Payment Details</div>
                {method === "thai" && (
                  <div className="rounded-2xl border bg-white p-4 text-sm">
                    <div className="font-semibold text-indigo-700">
                      {TH_BANK.bankName}
                    </div>
                    <div className="mt-1">
                      Account name: {TH_BANK.accountName}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span>
                        Account no.: <b>{TH_BANK.accountNumber}</b>
                      </span>
                      <button
                        onClick={() => copy(TH_BANK.accountNumber)}
                        className="text-xs px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200"
                      >
                        Copy <FiCopy className="inline ml-1" />
                      </button>
                    </div>
                  </div>
                )}
                {method === "intl" && (
                  <div className="rounded-2xl border bg-white p-4 text-sm">
                    <div className="font-semibold text-indigo-700">
                      Current Account - {INTL_BANK.accountNumber}
                    </div>
                    <div className="mt-1">
                      Beneficiary's bank: {INTL_BANK.beneficiary}
                    </div>
                    <div className="mt-1">
                      Tel: {INTL_BANK.tel}, Swift Code:{" "}
                      <b>{INTL_BANK.swift}</b>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => copy(INTL_BANK.accountNumber)}
                        className="text-xs px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200"
                      >
                        Copy account <FiCopy className="inline ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Order Summary</div>
                <div className="max-h-52 overflow-auto rounded-2xl border bg-white">
                  <ul className="divide-y">
                    {items.map((it) => (
                      <li key={it.id} className="p-3 flex items-center gap-3">
                        <img
                          src={it.imageUrl}
                          alt={it.title}
                          className="h-12 w-12 rounded-xl object-cover ring-1 ring-black/5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {it.title}
                          </div>
                          <div className="text-xs text-neutral-500">
                            Qty: 1 × {Number(it.price).toLocaleString()} Baht
                            (THB)
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {Number(it.price).toLocaleString()} ฿
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between text-base">
                <span className="text-neutral-600">Total</span>
                <span className="font-bold">
                  {total.toLocaleString()} Baht (THB)
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!items.length || submitting}
                className="w-full px-4 py-3 rounded-xl text-white font-semibold transition disabled:opacity-60 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {submitting ? "Submitting..." : "Confirm Transfer"}
              </button>

              <div className="text-xs text-neutral-500">
                After confirmation, the system will verify and automatically send
                a confirmation email.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Cart FAB + Mini Cart ---------------- */
export default function CartFab() {
  const [open, setOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    title: "",
    desc: "",
  });

  useEffect(() => subscribeCart(setItems), []);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("cart:open", openHandler);
    return () => window.removeEventListener("cart:open", openHandler);
  }, []);

  const count = useMemo(() => items.length, [items]);
  const total = useMemo(
    () => items.reduce((s, it) => s + Number(it.price || 0), 0),
    [items]
  );

  const handlePaidSuccess = (orderId) => {
    clearCart();
    setPayOpen(false);
    setOpen(false);
    setToast({
      open: true,
      type: "success",
      title: "สั่งซื้อสำเร็จเรียบร้อย!",
      desc: orderId
        ? `หมายเลขออร์เดอร์: ${orderId}`
        : "ระบบได้รับคำสั่งซื้อของคุณแล้ว",
    });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 4500);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-white text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,.15)] ring-1 ring-black/5 flex items-center justify-center hover:shadow-[0_14px_34px_rgba(0,0,0,.2)]"
        aria-label="Cart"
        title="Cart"
      >
        <FiShoppingCart className="text-2xl" />
        <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 text-[11px] bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white">
          {count}
        </span>
      </button>

      {/* Mini Cart */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] rounded-2xl bg-neutral-900 text-white border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="font-semibold">Cart</div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-white/10"
              aria-label="Close cart"
            >
              <FiX />
            </button>
          </div>

          <div className="max-h-[340px] overflow-auto">
            {items.length ? (
              <ul className="divide-y divide-white/10">
                {items.map((it) => (
                  <li key={it.id} className="p-3 flex items-center gap-3">
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{it.title}</div>
                      <div className="text-xs text-gray-300">
                        Qty: 1 • {Number(it.price).toLocaleString()} ฿
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {Number(it.price).toLocaleString()} ฿
                      </div>
                      <button
                        onClick={() => removeFromCart(it.id)}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-red-300 hover:text-red-200"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-sm text-gray-300">Your cart is empty.</div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>Total</span>
              <span className="text-white font-bold">
                {total.toLocaleString()} ฿
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
              >
                <FiTrash2 /> Clear Cart
              </button>
              <button
                onClick={() => items.length && setPayOpen(true)}
                className="flex-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold"
                disabled={!items.length}
              >
                Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup ชำระเงิน */}
      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        items={items}
        onSuccess={handlePaidSuccess}
      />

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        desc={toast.desc}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </>
  );
}
