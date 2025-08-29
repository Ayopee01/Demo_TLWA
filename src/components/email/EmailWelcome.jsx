// EmailWelcome.jsx — Full Version (FE only, ไม่แตะ backend)
// - ส่งออกเมตาเมล (replyTo/cc/bcc) เพื่อให้ Register.jsx ใช้ตอน POST /api/email/send
// - ส่งออกฟังก์ชัน buildWelcomeEmail() เพื่อสร้าง subject/html/text

// ปรับค่าตามโปรเจกต์ของคุณได้ (หรือกำหนดผ่าน .env ของ Vite)
export const WELCOME_MAIL_META = {
  // fromName จะไม่ถูก backend ใช้ (เพราะฝั่ง server ล็อก from เป็น EMAIL_USER)
  fromName: "TLWA",
  replyTo: import.meta.env.VITE_SIGNUP_REPLYTO || "contact@tlwa.or.th",
  cc: import.meta.env.VITE_SIGNUP_CC || "",
  bcc: import.meta.env.VITE_SIGNUP_BCC || "",
};

// ป้องกัน XSS / ใส่ลง HTML safely
const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// ตัวช่วยตัดช่องว่างซ้ายขวาแบบนิ่ม ๆ
const trim = (v) => (typeof v === "string" ? v.trim() : v);

// สร้างอีเมลต้อนรับ
export function buildWelcomeEmail({
  prefix = "",
  firstName = "",
  lastName = "",
  firstNameEn = "",
  lastNameEn = "",
} = {}) {
  const thFullName = `${trim(prefix) || ""}${trim(firstName)} ${trim(lastName)}`.trim();
  const enFullName = `${trim(firstNameEn)} ${trim(lastNameEn)}`.trim();

  const subject = "ยินดีต้อนรับสู่ TLWA 🎉";

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.65;color:#111;background:#fff;padding:0;margin:0">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto">
      <tr>
        <td style="padding:24px 20px 12px">
          <h2 style="margin:0 0 6px 0;font-size:22px">สวัสดีคุณ ${escapeHtml(thFullName)}</h2>
          <div style="font-size:14px;color:#475569">Welcome to TLWA</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 20px 0">
          <p style="margin:0 0 10px">ขอบคุณที่สมัครสมาชิก TLWA</p>
          ${
            enFullName
              ? `<p style="margin:0 0 14px"><strong>ข้อมูลของคุณ (EN):</strong> ${escapeHtml(
                  enFullName
                )}</p>`
              : ""
          }
          <p style="margin:0 0 12px">คุณสามารถเข้าสู่ระบบเพื่อเริ่มใช้งานได้ทันที</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 20px 18px">
          <a href="${escapeHtml(
            import.meta.env.VITE_CLIENT_URL || "https://www.tlwa.or.th"
          )}" target="_blank" rel="noopener" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:600">
            ไปที่เว็บไซต์ TLWA
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 20px 24px">
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0" />
          <div style="font-size:12px;color:#64748b">
            อีเมลนี้เป็นการแจ้งอัตโนมัติ กรุณาอย่าตอบกลับ หากต้องการติดต่อทีมงาน โปรดส่งอีเมลมาที่
            <a href="mailto:${escapeHtml(WELCOME_MAIL_META.replyTo)}" style="color:#2563eb;text-decoration:none">${escapeHtml(
    WELCOME_MAIL_META.replyTo
  )}</a>
          </div>
        </td>
      </tr>
    </table>
  </div>`.trim();

  // เผื่อ SMTP บางเจ้า/บาง client ใช้เนื้อหา text fallback
  const text = [
    `สวัสดีคุณ ${thFullName}`,
    `ยินดีต้อนรับสู่ TLWA`,
    enFullName ? `ชื่อ (EN): ${enFullName}` : "",
    `ไปที่เว็บไซต์: ${import.meta.env.VITE_CLIENT_URL || "https://www.tlwa.or.th"}`,
    `อีเมลนี้เป็นการแจ้งอัตโนมัติ กรุณาอย่าตอบกลับ`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}
