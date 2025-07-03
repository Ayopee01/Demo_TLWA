// server.js

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

// 1. Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Forgot Password (Send Reset Email)
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });

    // สร้าง token และหมดอายุใน 1 ชั่วโมง
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 ชม.

    // อัปเดต token+expires ลง DB
    await pool.query(
      'UPDATE users SET reset_token=?, reset_token_expires=? WHERE email=?',
      [resetToken, expires, email]
    );

    // สร้างลิงค์ Reset Password (แก้ url ตรงนี้ถ้า deploy จริง)
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // ส่งอีเมล
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

// 3. Reset Password (User ส่ง token + password)
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }

    // ตรวจสอบ token+หมดอายุ
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email=? AND reset_token=? AND reset_token_expires > NOW()',
      [email, token]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: 'ลิงก์หมดอายุหรือไม่ถูกต้อง' });
    }

    // hash password ใหม่
    const hashed = await bcrypt.hash(password, 10);

    // อัปเดตรหัสผ่าน+ล้าง token
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

// 4. Register
app.post('/api/register', async (req, res) => {
  try {
    const { prefix, firstName, lastName, address, phone, email, password } = req.body;
    if (!prefix || !firstName || !lastName || !address || !phone || !email || !password) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    const [user] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (user.length > 0) return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (prefix, firstName, lastName, address, phone, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [prefix, firstName, lastName, address, phone, email, hashed]
    );
    res.json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: err.message });
  }
});

// 5. Login (ปรับปรุง FULL Try-Catch + LOG)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = rows[0];

    // ตรวจสอบ password
    if (!user.password) {
      console.error('User password is empty in DB:', user);
      return res.status(400).json({ message: 'รหัสผ่านผิดพลาด' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in .env');
      return res.status(500).json({ message: 'Server configuration error' });
    }

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
        email: user.email
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: error.message });
  }
});

// 6. Update user by id
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { prefix, firstName, lastName, address, phone, email } = req.body;
  try {
    await pool.query(
      `UPDATE users SET prefix=?, firstName=?, lastName=?, address=?, phone=?, email=? WHERE id=?`,
      [prefix, firstName, lastName, address, phone, email, id]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const user = rows[0];
    delete user.password;
    res.json({ message: 'อัปเดตสำเร็จ', user });
  } catch (err) {
    console.error('UPDATE USER ERROR:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะอัปเดต', error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
