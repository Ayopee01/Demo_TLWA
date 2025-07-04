require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// === Nodemailer ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === Forgot Password ===
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_token=?, reset_token_expires=? WHERE email=?',
      [resetToken, expires, email]
    );

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your password',
      html: `<p>คลิก <a href="${resetLink}">ลิงก์นี้เพื่อเปลี่ยนรหัสผ่าน</a> (หมดอายุใน 1 ชั่วโมง)</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'ส่งลิงค์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว' });

  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err);
    res.status(500).json({ message: 'ส่งอีเมลไม่สำเร็จ', error: err.message });
  }
});

// === Reset Password ===
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password)
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email=? AND reset_token=? AND reset_token_expires > NOW()',
      [email, token]
    );
    if (rows.length === 0)
      return res.status(400).json({ message: 'ลิงก์หมดอายุหรือไม่ถูกต้อง' });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password=?, reset_token=NULL, reset_token_expires=NULL WHERE email=?',
      [hashed, email]
    );
    res.json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
  } catch (err) {
    console.error('RESET PASSWORD ERROR:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะรีเซ็ตรหัสผ่าน', error: err.message });
  }
});

// === Register ===
app.post('/api/register', async (req, res) => {
  try {
    const {
      prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email, password
    } = req.body;
    if (!prefix || !firstName || !lastName || !firstNameEn || !lastNameEn || !address || !phone || !email || !password) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    const [userByEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (userByEmail.length > 0)
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });

    const [userByPhone] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (userByPhone.length > 0)
      return res.status(400).json({ message: 'เบอร์โทรนี้ถูกใช้ไปแล้ว' });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email, hashed]
    );
    res.json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: err.message });
  }
});

// === Login ===
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: 'User not found' });

    const user = rows[0];
    if (!user.password)
      return res.status(400).json({ message: 'รหัสผ่านผิดพลาด' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

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
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: error.message });
  }
});

// === Get user by id ===
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT id, prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email FROM users WHERE id=?', [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('GET USER ERROR:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// === Update user by id (with check for duplicate phone) ===
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { prefix, firstName, lastName, firstNameEn, lastNameEn, address, phone, email } = req.body;
  try {
    // เช็คเบอร์โทรซ้ำ (ยกเว้น user ตัวเอง)
    const [exist] = await pool.query(
      'SELECT id FROM users WHERE phone=? AND id<>?',
      [phone, id]
    );
    if (exist.length > 0)
      return res.status(400).json({ message: 'เบอร์โทรนี้ถูกใช้งานแล้ว' });

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
    const user = rows[0];
    res.json({ message: 'อัปเดตสำเร็จ', user });
  } catch (err) {
    console.error('UPDATE USER ERROR:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะอัปเดต', error: err.message });
  }
});

// === เช็คเบอร์ซ้ำ ===
app.get('/api/users/check-phone', async (req, res) => {
  const { phone, excludeId } = req.query;
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE phone = ? AND id != ?', [phone, excludeId || 0]
  );
  res.json({ duplicate: rows.length > 0 });
});

// === Start server ===
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
