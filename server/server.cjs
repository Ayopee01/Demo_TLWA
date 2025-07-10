// server.cjs

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const { fileTypeFromBuffer } = require('file-type');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json());

// ====================== Nodemailer (Reset Password) =======================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================== Forgot Password ================================
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: 'Email not found.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

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
    console.error('FORGOT PASSWORD ERROR:', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

// ========================== Reset Password =================================
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
    console.error('RESET PASSWORD ERROR:', err);
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});

// ============================= Register ====================================
app.post('/api/register', async (req, res) => {
  try {
    const {
      prefix, firstName, lastName, firstNameEn, lastNameEn,
      address, phone, email, password
    } = req.body;

    if (
      !prefix || !firstName || !lastName || !firstNameEn ||
      !lastNameEn || !address || !phone || !email || !password
    ) {
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
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ================================ Login ====================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Incomplete data.' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = rows[0];
    if (!user.password) return res.status(400).json({ message: 'Invalid password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: 'Server configuration error' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============================ Get User by ID ===============================
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email FROM users WHERE id=?', [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('GET USER ERROR:', err);
    res.status(500).json({ message: 'Error', error: err.message });
  }
});

// ========================= Update User by ID ===============================
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email } = req.body;
    const [exist] = await pool.query(
      'SELECT id FROM users WHERE phone=? AND id<>?',
      [phone, id]
    );
    if (exist.length > 0) return res.status(400).json({ message: 'Phone already used.' });

    await pool.query(
      `UPDATE users 
        SET prefix=?, firstName=?, lastName=?, firstNameEn=?, lastNameEn=?, address=?, phone=?, email=?
      WHERE id=?`,
      [prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email, id]
    );
    const [rows] = await pool.query(
      'SELECT id, prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email FROM users WHERE id=?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Update successful.', user: rows[0] });
  } catch (err) {
    console.error('UPDATE USER ERROR:', err);
    res.status(500).json({ message: 'Update error', error: err.message });
  }
});

// ========================= Check Duplicate Phone ============================
app.get('/api/users/check-phone', async (req, res) => {
  const { phone, excludeId } = req.query;
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE phone = ? AND id != ?', [phone, excludeId || 0]
  );
  res.json({ duplicate: rows.length > 0 });
});

// ========================== Member Upload/Update ============================
const toBool = v => v === 'true' || v === true || v === 1 ? 1 : 0;
const MEMBER_FIELDS = [
  "user_id", "nickName", "birthDate", "religion", "race", "nationality", "occupation",
  "address", "lineId", "workPlace", "workPosition", "workAddress", "workPhone",
  "docAddressType", "docAddressOther", "receiptAddressType", "receiptAddressOther",
  "receiptType", "branchName", "taxId", "agreeRule", "agreeConfirm", "pdpa1", "pdpa2",
  "idCard", "houseReg", "profilePic", "educationLevel", "educationCert", "medicalLicense",
  "boardInterest", "boardType", "payment_status", "payment_ref"
];
app.post('/api/members', upload.fields([
  { name: 'idCard' }, { name: 'houseReg' }, { name: 'profilePic' },
  { name: 'educationCert' }, { name: 'medicalLicense' }
]), async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || {};
    const values = MEMBER_FIELDS.map(field => {
      if (["agreeRule", "agreeConfirm", "pdpa1", "pdpa2"].includes(field)) {
        return toBool(body[field]);
      }
      if (["idCard", "houseReg", "profilePic", "educationCert", "medicalLicense"].includes(field)) {
        return files[field]?.[0]?.buffer || null;
      }
      return body[field] ?? null;
    });

    const [existRows] = await pool.query('SELECT id FROM members WHERE user_id=?', [body.user_id]);
    if (existRows.length > 0) {
      const updateFields = MEMBER_FIELDS.filter(f => f !== "user_id").map(f => `${f}=?`).join(', ');
      await pool.query(
        `UPDATE members SET ${updateFields} WHERE user_id=?`,
        [...values.slice(1), body.user_id]
      );
      res.json({ message: "Member updated successfully." });
    } else {
      const sql = `INSERT INTO members (${MEMBER_FIELDS.join(', ')}) VALUES (${MEMBER_FIELDS.map(() => '?').join(', ')})`;
      const [result] = await pool.query(sql, values);
      res.json({ message: "Member created successfully.", memberId: result.insertId });
    }
  } catch (err) {
    console.error("ADD/UPDATE MEMBER ERROR:", err);
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// ========================== Get Member Info ================================
app.get('/api/members/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM members WHERE user_id=?', [user_id]);
    if (rows.length === 0) return res.status(404).json({ message: "Member not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// ========== Download BLOB File (png/jpg/webp to jpg only) ===================
const ALL_FIELDS = ["idCard", "houseReg", "profilePic", "educationCert", "medicalLicense"];
ALL_FIELDS.forEach(field => {
  app.get(`/api/members/:user_id/${field}`, async (req, res) => {
    try {
      const { user_id } = req.params;
      const [rows] = await pool.query(`SELECT ${field} FROM members WHERE user_id=?`, [user_id]);
      const fileBuffer = rows[0]?.[field];
      if (!fileBuffer) return res.status(404).json({ message: "File not found." });

      const typeResult = await fileTypeFromBuffer(fileBuffer);

      // รองรับเฉพาะ png, jpg, jpeg, webp
      if (['png', 'jpg', 'jpeg', 'webp'].includes(typeResult?.ext)) {
        const jpgBuffer = await sharp(fileBuffer).jpeg().toBuffer();
        res.set('Content-Type', 'image/jpeg');
        res.set('Content-Disposition', `attachment; filename="${field}_${user_id}.jpg"`);
        res.send(jpgBuffer);
        return;
      } else {
        return res.status(415).json({ message: "Only png, jpg, jpeg, webp are supported." });
      }
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ message: "Error", error: err.message });
      }
    }
  });
});

// =========================== Start Server ===================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

