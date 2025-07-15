require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ---------- Register ----------
app.post('/api/register', async (req, res) => {
  try {
    const { prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email, password } = req.body;
    if (!prefix || !firstName || !lastName || !firstNameEn || !lastNameEn || !address || !phone || !email || !password) {
      return res.status(400).json({ message: 'Incomplete data.' });
    }
    const [userByEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (userByEmail.length > 0) return res.status(400).json({ message: 'Email already used.' });
    const [userByPhone] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (userByPhone.length > 0) return res.status(400).json({ message: 'Phone already used.' });
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email, hashed]
    );
    res.json({ message: 'Register successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- Login ----------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Incomplete data.' });
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'User not found' });
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Login success',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        firstNameEn: user.firstNameEn,
        lastNameEn: user.lastNameEn,
        prefix: user.prefix,
        address: user.address,
        phone: user.phone,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---------- Forgot Password ----------
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: 'Email not found.' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query(
      'UPDATE users SET reset_token=?, reset_token_expires=? WHERE email=?',
      [resetToken, expires, email]
    );
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">this link to reset your password</a> (valid for 1 hour)</p>`
    });
    res.json({ message: 'Reset link sent to email.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

// ---------- Reset Password ----------
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password)
      return res.status(400).json({ message: 'Incomplete data.' });
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email=? AND reset_token=? AND reset_token_expires > NOW()',
      [email, token]
    );
    if (rows.length === 0)
      return res.status(400).json({ message: 'Invalid or expired link.' });
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password=?, reset_token=NULL, reset_token_expires=NULL WHERE email=?',
      [hashed, email]
    );
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});

// ---------- Get User by ID ----------
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email FROM users WHERE id=?', [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
});

// ---------- Update User by ID ----------
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone } = req.body;
    if (!prefix || !firstName || !lastName || !firstNameEn || !lastNameEn || !address) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    // ตรวจสอบว่าซ้ำกับเบอร์ของคนอื่นหรือไม่ (ยกเว้นตัวเอง)
    if (phone) {
      const [dupPhone] = await pool.query('SELECT id FROM users WHERE phone = ? AND id != ?', [phone, id]);
      if (dupPhone.length > 0) return res.status(400).json({ message: 'เบอร์นี้ถูกใช้แล้ว' });
    }
    const [result] = await pool.query(
      `UPDATE users SET prefix=?, firstName=?, lastName=?, firstNameEn=?, lastNameEn=?, address=?, phone=IFNULL(?, phone) WHERE id=?`,
      [prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    const [rows] = await pool.query(
      'SELECT id, prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email FROM users WHERE id=?', [id]
    );
    res.json({ message: 'แก้ไขข้อมูลเรียบร้อย', user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Update error', error: err.message });
  }
});

// ===================== MEMBER PROFILE =========================

const memberFields = [
  "user_id", "prefixTh", "prefixEn", "suffixEn", "nickName", "birthDate", "religion",
  "race", "nationality", "occupation", "address", "lineId", "workPlace", "workPosition",
  "workAddress", "workPhone", "docAddressType", "docAddressOther", "receiptAddressType",
  "receiptAddressOther", "receiptType", "branchName", "taxId", "agreeRule", "agreeConfirm",
  "pdpa1", "pdpa2", "educationLevel", "boardInterest", "boardType"
];

// ===== Update user info from Member (สำคัญ!!!) ====
async function updateUserFromMember(userId, memberData) {
  if (!userId) return;
  await pool.query(
    `UPDATE users SET prefix=?, firstName=?, lastName=?, firstNameEn=?, lastNameEn=?, address=? WHERE id=?`,
    [
      memberData.prefixTh || "",
      memberData.firstName || "",
      memberData.lastName || "",
      memberData.firstNameEn || "",
      memberData.lastNameEn || "",
      memberData.address || "",
      userId
    ]
  );
}

// --------- Create Member (POST) ---------
app.post('/api/members', upload.none(), async (req, res) => {
  try {
    const body = req.body;
    // Validate: ID Line duplicate
    const [dupLine] = await pool.query('SELECT id FROM members WHERE lineId=?', [body.lineId]);
    if (dupLine.length > 0) {
      return res.status(409).json({ message: "ID Line นี้ถูกใช้งานแล้ว" });
    }
    // Validate: TaxID format & duplicate (เลข 13 หลักเท่านั้น, ห้ามมีอักษร)
    if (!/^\d{13}$/.test(body.taxId)) {
      return res.status(400).json({ message: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น" });
    }
    const [dupTax] = await pool.query('SELECT id FROM members WHERE taxId=?', [body.taxId]);
    if (dupTax.length > 0) {
      return res.status(409).json({ message: "เลขบัตร/เลขผู้เสียภาษีนี้ถูกใช้งานแล้ว" });
    }
    const [existRows] = await pool.query('SELECT id FROM members WHERE user_id=?', [body.user_id]);
    if (existRows.length > 0) {
      return res.status(400).json({ message: "Member already exists" });
    }
    const values = memberFields.map(f => {
      if (body[f] === 'true') return 1;
      if (body[f] === 'false') return 0;
      return body[f] ?? null;
    });
    const [result] = await pool.query(
      `INSERT INTO members (${memberFields.join(',')}) VALUES (${memberFields.map(() => '?').join(',')})`, values
    );
    await updateUserFromMember(body.user_id, body); // <-- อัปเดต users ทุกครั้ง
    return res.json({ message: 'Member created', memberId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// --------- Update Member (PUT) ---------
app.put('/api/members', upload.none(), async (req, res) => {
  try {
    const body = req.body;
    if (!body.user_id) return res.status(400).json({ message: "user_id required" });
    // Validate: ID Line duplicate (exclude self)
    const [dupLine] = await pool.query('SELECT id FROM members WHERE lineId=? AND user_id != ?', [body.lineId, body.user_id]);
    if (dupLine.length > 0) {
      return res.status(409).json({ message: "ID Line นี้ถูกใช้งานแล้ว" });
    }
    // Validate: TaxID format & duplicate (exclude self)
    if (!/^\d{13}$/.test(body.taxId)) {
      return res.status(400).json({ message: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น" });
    }
    const [dupTax] = await pool.query('SELECT id FROM members WHERE taxId=? AND user_id != ?', [body.taxId, body.user_id]);
    if (dupTax.length > 0) {
      return res.status(409).json({ message: "เลขบัตร/เลขผู้เสียภาษีนี้ถูกใช้งานแล้ว" });
    }
    const updateFields = memberFields.filter(f => f !== "user_id").map(f => `${f}=?`).join(', ');
    const values = memberFields.filter(f => f !== "user_id").map(f => {
      if (body[f] === 'true') return 1;
      if (body[f] === 'false') return 0;
      return body[f] ?? null;
    });
    const [result] = await pool.query(
      `UPDATE members SET ${updateFields} WHERE user_id=?`,
      [...values, body.user_id]
    );
    await updateUserFromMember(body.user_id, body); // <-- อัปเดต users ทุกครั้ง
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Member not found" });
    }
    const [member] = await pool.query('SELECT id FROM members WHERE user_id=?', [body.user_id]);
    res.json({ message: "Member updated", memberId: member[0]?.id });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
});

// --------- Upload Member File ---------
app.post('/api/member-files', upload.single('file'), async (req, res) => {
  try {
    const { member_id, file_type } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    await pool.query(
      `INSERT INTO member_files (member_id, file_type, file_name, file, uploaded_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         file_name = VALUES(file_name),
         file = VALUES(file),
         uploaded_at = NOW()`,
      [member_id, file_type, file.originalname, file.buffer]
    );
    res.json({ message: "File uploaded or replaced" });
  } catch (err) {
    res.status(500).json({ message: "Upload error", error: err.message });
  }
});

// --------- Get Member Files Meta ---------
app.get('/api/member-files/:member_id', async (req, res) => {
  try {
    const { member_id } = req.params;
    const { file_type } = req.query;
    let rows;
    if (file_type) {
      [rows] = await pool.query('SELECT id, file_type, file_name FROM member_files WHERE member_id=? AND file_type=?', [member_id, file_type]);
    } else {
      [rows] = await pool.query('SELECT id, file_type, file_name FROM member_files WHERE member_id=?', [member_id]);
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Get files error", error: err.message });
  }
});

// --------- Download Member File ---------
app.get('/api/member-files/download/:file_id', async (req, res) => {
  try {
    const { file_id } = req.params;
    const [rows] = await pool.query('SELECT file_name, file FROM member_files WHERE id=?', [file_id]);
    if (rows.length === 0) return res.status(404).json({ message: "File not found" });
    const ext = path.extname(rows[0].file_name).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${rows[0].file_name}"`);
    res.send(rows[0].file);
  } catch (err) {
    res.status(500).json({ message: "Download error", error: err.message });
  }
});

// --------- Delete Member File ---------
app.delete('/api/member-files/:file_id', async (req, res) => {
  try {
    const { file_id } = req.params;
    await pool.query('DELETE FROM member_files WHERE id=?', [file_id]);
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
});

// --------- Get Member by member_id + files meta ---------
app.get('/api/members/:member_id', async (req, res) => {
  try {
    const { member_id } = req.params;
    const [members] = await pool.query('SELECT * FROM members WHERE id=?', [member_id]);
    if (members.length === 0) return res.status(404).json({ message: "Member not found" });
    const [files] = await pool.query('SELECT id, file_type, file_name FROM member_files WHERE member_id=?', [member_id]);
    res.json({ ...members[0], files });
  } catch (err) {
    res.status(500).json({ message: "Get member error", error: err.message });
  }
});

// --------- Get Member by user_id (Join User) ---------
app.get('/api/members/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [members] = await pool.query(`
      SELECT 
        m.*, 
        u.prefix, u.firstName, u.lastName, u.firstNameEn, u.lastNameEn, u.email, u.phone, u.address
      FROM members m
      JOIN users u ON m.user_id = u.id
      WHERE m.user_id = ?
      LIMIT 1
    `, [userId]);
    if (!members.length) return res.status(404).json({ message: "ไม่พบข้อมูลสมาชิกสำหรับบัญชีนี้" });
    const [files] = await pool.query(`
      SELECT id, file_name FROM member_files
      WHERE member_id = ? AND file_type = 'profilePic'
      ORDER BY uploaded_at DESC LIMIT 1
    `, [members[0].id]);
    const profilePicUrl = files.length
      ? `/api/member-files/download/${files[0].id}`
      : null;
    res.json({ ...members[0], profilePicUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// เพิ่มโค้ดนี้ลงไป
app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM members');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Get members error", error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));