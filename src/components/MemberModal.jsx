import React, { useState, useEffect, useMemo } from "react";
import { FaFileAlt, FaTrash, FaCloudUploadAlt } from "react-icons/fa";

const RELIGIONS = [
  "พุทธ", "คริสต์", "อิสลาม", "ฮินดู", "ซิกข์", "ยูดาย", "เชน", "เต๋า", "ชินโต", "Baháʼí", "ลัทธิขงจื๊อ", "ไม่มีศาสนา"
];

function calculateAgeFromDate(dateStr) {
  if (!dateStr) return "";
  const today = new Date();
  const birthDate = new Date(dateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

const lineIdRegex = /^[a-z0-9._-]{3,}$/;
const thRegex = /^[ก-๏]+$/;
const enRegex = /^[a-zA-Z]+$/;
const thMin3 = /^[ก-๏]{3,}$/;
const enMin3 = /^[a-zA-Z]{3,}$/;

export default function MemberModal({ open, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (open) {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    }
  }, [open]);

  const [form, setForm] = useState({
    prefix: "", prefixEn: "",
    firstName: "", lastName: "",
    firstNameEn: "", lastNameEn: "",
    nickName: "", birthDate: "",
    religion: "", race: "", nationality: "", occupation: "",
    address: "", phone: "", email: "", lineId: "",
    workPlace: "", workPosition: "", workAddress: "", workPhone: "",
    docAddressType: "", docAddressOther: "",
    receiptAddressType: "", receiptAddressOther: "",
    receiptType: "", branchName: "",
    taxId: "", agreeRule: false, agreeConfirm: false, pdpa1: false, pdpa2: false,
    idCard: null, houseReg: null, profilePic: null,
    educationLevel: "",
    educationCert: null,
    medicalLicense: null,
    boardInterest: "",
    boardType: "",
    gbprimepayMock: "",
  });

  useEffect(() => {
    if (user && open) {
      setForm(f => ({
        ...f,
        prefix: "",
        prefixEn: user.prefixEn || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        firstNameEn: user.firstNameEn || "",
        lastNameEn: user.lastNameEn || "",
        nickName: user.nickName || "",
        birthDate: user.birthDate || "",
        religion: user.religion || "",
        race: user.race || "",
        nationality: user.nationality || "",
        occupation: user.occupation || "",
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || "",
        lineId: user.lineId || "",
        workPlace: user.workPlace || "",
        workPosition: user.workPosition || "",
        workAddress: user.workAddress || "",
        workPhone: user.workPhone || "",
        docAddressType: user.docAddressType || "",
        docAddressOther: user.docAddressOther || "",
        receiptAddressType: user.receiptAddressType || "",
        receiptAddressOther: user.receiptAddressOther || "",
        receiptType: user.receiptType || "",
        branchName: user.branchName || "",
        taxId: user.taxId || "",
        agreeRule: user.agreeRule || false,
        agreeConfirm: user.agreeConfirm || false,
        pdpa1: user.pdpa1 || false,
        pdpa2: user.pdpa2 || false,
        idCard: user.idCard || null,
        houseReg: user.houseReg || null,
        profilePic: user.profilePic || null,
        educationLevel: user.educationLevel || "",
        educationCert: user.educationCert || null,
        medicalLicense: user.medicalLicense || null,
        boardInterest: user.boardInterest || "",
        boardType: user.boardType || "",
        gbprimepayMock: user.gbprimepayMock || "",
      }));
    }
  }, [user, open]);

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [files, setFiles] = useState({
    idCard: null, houseReg: null, profilePic: null, educationCert: null, medicalLicense: null,
  });

  const age = useMemo(() => calculateAgeFromDate(form.birthDate), [form.birthDate]);

  function handleChange(e) {
    const { name, value, type, checked, files: fileInput } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      const file = fileInput[0];
      setForm(f => ({ ...f, [name]: file }));
      setFiles(f => ({ ...f, [name]: file }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors({});
    setMsg('');
  }

  function handleRemoveFile(field) {
    setForm(f => ({ ...f, [field]: null }));
    setFiles(f => ({ ...f, [field]: null }));
  }

  function validateStep() {
    const errs = {};
    if (step === 1) {
      if (!form.prefix) errs.prefix = "กรุณากรอกคำนำหน้า (TH)";
      else if (!thRegex.test(form.prefix)) errs.prefix = "คำนำหน้าต้องเป็นอักษรไทยเท่านั้น";
      if (!form.prefixEn) errs.prefixEn = "กรุณากรอกคำนำหน้า (EN)";
      else if (!enRegex.test(form.prefixEn)) errs.prefixEn = "คำนำหน้าต้องเป็นอักษรอังกฤษเท่านั้น";
      if (!form.firstName) errs.firstName = "กรุณากรอกชื่อภาษาไทย";
      else if (!thMin3.test(form.firstName)) errs.firstName = "ต้องเป็นอักษรไทย ไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.lastName) errs.lastName = "กรุณากรอกนามสกุลภาษาไทย";
      else if (!thMin3.test(form.lastName)) errs.lastName = "ต้องเป็นอักษรไทย ไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.firstNameEn) errs.firstNameEn = "กรุณากรอกชื่อภาษาอังกฤษ";
      else if (!enMin3.test(form.firstNameEn)) errs.firstNameEn = "ต้องเป็นอักษรอังกฤษ ไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.lastNameEn) errs.lastNameEn = "กรุณากรอกนามสกุลภาษาอังกฤษ";
      else if (!enMin3.test(form.lastNameEn)) errs.lastNameEn = "ต้องเป็นอักษรอังกฤษ ไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.nickName) errs.nickName = "กรุณากรอกชื่อเล่น";
      else if (form.nickName.length < 2) errs.nickName = "ชื่อเล่นต้องมีอย่างน้อย 2 ตัวอักษร";
      if (!form.birthDate) errs.birthDate = "กรุณาเลือกวันเกิด";
      if (!form.religion) errs.religion = "เลือกศาสนา";
      else if (!RELIGIONS.includes(form.religion) || form.religion === "") errs.religion = "เลือกศาสนาให้ถูกต้อง";
    }
    if (step === 2) {
      if (!form.race) errs.race = "กรุณากรอกเชื้อชาติ";
      else if (form.race.length < 3) errs.race = "เชื้อชาติต้องไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.nationality) errs.nationality = "กรุณากรอกสัญชาติ";
      else if (form.nationality.length < 3) errs.nationality = "สัญชาติต้องไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.occupation) errs.occupation = "กรุณากรอกอาชีพ";
      else if (form.occupation.length < 3) errs.occupation = "อาชีพต้องไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.address) errs.address = "กรุณากรอกที่อยู่ (บ้าน)";
      else if (form.address.length < 3) errs.address = "ที่อยู่ต้องไม่น้อยกว่า 3 ตัวอักษร";
      if (!form.phone) errs.phone = "เบอร์โทร (ดึงอัตโนมัติ)";
      if (!form.email) errs.email = "อีเมล (ดึงอัตโนมัติ)";
      if (!form.lineId) errs.lineId = "กรุณากรอกไลน์ไอดี";
      else if (!lineIdRegex.test(form.lineId))
        errs.lineId = "ต้องมี 3 ตัวขึ้นไป(ใช้ได้เฉพาะ a-z, 0-9 และอักษรพิเศษเท่านั้น)";
    }
    if (step === 3) {
      if (!form.workPlace) errs.workPlace = "กรุณากรอกชื่อสถานที่ทำงาน";
      else if (form.workPlace.length < 3) errs.workPlace = "ชื่อสถานที่ทำงานต้องไม่ต่ำกว่า 3 ตัวอักษร";
      if (!form.workPosition) errs.workPosition = "กรุณากรอกตำแหน่งงาน";
      else if (form.workPosition.length < 3) errs.workPosition = "ตำแหน่งงานต้องไม่ต่ำกว่า 3 ตัวอักษร";
      if (!form.workAddress) errs.workAddress = "กรุณากรอกที่อยู่ที่ทำงาน";
      else if (form.workAddress.length < 3) errs.workAddress = "ที่อยู่ที่ทำงานต้องไม่ต่ำกว่า 3 ตัวอักษร";
      if (!form.workPhone) errs.workPhone = "กรุณากรอกเบอร์โทรที่ทำงาน";
      else if (!/^\d{9,10}$/.test(form.workPhone))
        errs.workPhone = "กรอกเฉพาะตัวเลข 9-10 หลัก";
    }
    if (step === 4) {
      if (!form.docAddressType) {
        errs.docAddressType = "เลือกที่อยู่สำหรับรับเอกสาร";
      }
      if (form.docAddressType === "other") {
        if (!form.docAddressOther) {
          errs.docAddressOther = "กรุณากรอกที่อยู่";
        } else if (form.docAddressOther.length < 3) {
          errs.docAddressOther = "ที่อยู่ต้องไม่ต่ำกว่า 3 ตัวอักษร";
        }
      }
      if (!form.receiptAddressType) {
        errs.receiptAddressType = "เลือกที่อยู่สำหรับใบเสร็จ";
      }
      if (form.receiptAddressType === "other") {
        if (!form.receiptAddressOther) {
          errs.receiptAddressOther = "กรุณากรอกที่อยู่";
        } else if (form.receiptAddressOther.length < 3) {
          errs.receiptAddressOther = "ที่อยู่ต้องไม่ต่ำกว่า 3 ตัวอักษร";
        }
      }
      if (!form.receiptType) {
        errs.receiptType = "เลือกประเภทผู้รับใบเสร็จ";
      } else if (form.receiptType === "branch") {
        if (!form.branchName) {
          errs.branchName = "กรุณากรอกชื่อสาขา";
        } else if (form.branchName.length < 3) {
          errs.branchName = "ชื่อสาขาต้องไม่ต่ำกว่า 3 ตัวอักษร";
        }
      }
      if (!form.taxId) {
        errs.taxId = "กรุณาระบุเลขประจำตัวผู้เสียภาษี/บัตรประชาชน";
      } else if (!/^\d{10,13}$/.test(form.taxId)) {
        errs.taxId = "กรอกตัวเลข 10-13 หลักเท่านั้น";
      }
    }
    if (step === 5) {
      if (!form.agreeRule) errs.agreeRule = "โปรดติ๊กรับรองกฎระเบียบ";
      if (!form.agreeConfirm) errs.agreeConfirm = "โปรดติ๊กรับทราบเงื่อนไข";
      if (!form.pdpa1) errs.pdpa1 = "โปรดยินยอมการใช้ข้อมูล";
      if (!form.pdpa2) errs.pdpa2 = "โปรดยินยอมการใช้ข้อมูล";
    }
    if (step === 6) {
      if (!form.idCard) errs.idCard = "กรุณาอัปโหลดสำเนาบัตรประชาชน";
      if (!form.houseReg) errs.houseReg = "กรุณาอัปโหลดสำเนาทะเบียนบ้าน";
      if (!form.profilePic) errs.profilePic = "กรุณาอัปโหลดรูปหน้าตรง";
      if (!form.educationLevel) errs.educationLevel = "เลือกวุฒิการศึกษาสูงสุด";
      if (!form.educationCert) errs.educationCert = "กรุณาอัปโหลดวุฒิการศึกษา";
    }
    if (step === 7) {
      if (!form.boardInterest) errs.boardInterest = "โปรดเลือกความสนใจ";
      if (form.boardInterest === "สนใจ" && !form.boardType) errs.boardType = "เลือกประเภทการสอบ";
    }
    return errs;
  }

  function handleNext() {
    const errs = validateStep();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(s => s + 1);
  }
  function handleBack() {
    setStep(s => s - 1);
    setErrors({});
    setMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setTimeout(() => {
      setMsg("บันทึกข้อมูลสำเร็จ (DEMO)");
      setSaving(false);
    }, 1200);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl">
      <form
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white backdrop-blur-xl border border-gray-200 py-6 px-8 transition-all duration-200 overflow-y-auto max-h-[90dvh]"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {/* ปุ่มปิด */}
        <button
          type="button"
          className="absolute top-3 right-3 bg-gray-200 hover:bg-red-400 text-gray-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition"
          onClick={onClose}
          aria-label="Close"
          disabled={saving}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight text-center">
          สมัครสมาชิก (ขั้นตอนที่ {step} / 8)
        </h2>
        {msg && (
          <div className={`mb-3 text-center text-${msg.includes('สำเร็จ') ? 'green' : 'red'}-500 font-semibold`}>
            {msg}
          </div>
        )}
        <div className="flex mb-6 justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className={`h-2 w-10 rounded-full ${step >= n ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">คำนำหน้า (TH)</label>
                <input
                  type="text"
                  name="prefix"
                  value={form.prefix}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.prefix && 'border-red-400'}`}
                  placeholder="นาย, นางสาว, ดร., ..."
                />
                {errors.prefix && <div className="text-xs text-red-500">{errors.prefix}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">คำนำหน้า (EN)</label>
                <input
                  type="text"
                  name="prefixEn"
                  value={form.prefixEn}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.prefixEn && 'border-red-400'}`}
                  placeholder="Mr., Mrs., Dr., ..."
                />
                {errors.prefixEn && <div className="text-xs text-red-500">{errors.prefixEn}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">ชื่อ (TH)</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.firstName && 'border-red-400'}`}
                  placeholder="ชื่อภาษาไทย"
                />
                {errors.firstName && <div className="text-xs text-red-500">{errors.firstName}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">ชื่อ (EN)</label>
                <input
                  type="text"
                  name="firstNameEn"
                  value={form.firstNameEn}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.firstNameEn && 'border-red-400'}`}
                  placeholder="First Name (EN)"
                />
                {errors.firstNameEn && <div className="text-xs text-red-500">{errors.firstNameEn}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">นามสกุล (TH)</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.lastName && 'border-red-400'}`}
                  placeholder="นามสกุลภาษาไทย"
                />
                {errors.lastName && <div className="text-xs text-red-500">{errors.lastName}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">นามสกุล (EN)</label>
                <input
                  type="text"
                  name="lastNameEn"
                  value={form.lastNameEn}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.lastNameEn && 'border-red-400'}`}
                  placeholder="Last Name (EN)"
                />
                {errors.lastNameEn && <div className="text-xs text-red-500">{errors.lastNameEn}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">ชื่อเล่น</label>
                <input
                  type="text"
                  name="nickName"
                  value={form.nickName}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.nickName && 'border-red-400'}`}
                  placeholder="กรอกชื่อเล่น"
                />
                {errors.nickName && <div className="text-xs text-red-500">{errors.nickName}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">วัน/เดือน/ปี เกิด</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.birthDate && 'border-red-400'}`}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.birthDate && <div className="text-xs text-red-500">{errors.birthDate}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">อายุ</label>
                <input
                  type="text"
                  name="age"
                  value={age ? `${age} ปี` : ""}
                  disabled
                  className="border px-3 py-2 rounded-xl w-full bg-gray-100 text-gray-500"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">ศาสนา</label>
                <select
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.religion && 'border-red-400'}`}
                >
                  <option value="">เลือกศาสนา</option>
                  {RELIGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.religion && <div className="text-xs text-red-500">{errors.religion}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">เชื้อชาติ</label>
                <input
                  type="text"
                  name="race"
                  value={form.race}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.race && 'border-red-400'}`}
                  placeholder="ระบุเชื้อชาติ"
                />
                {errors.race && <div className="text-xs text-red-500">{errors.race}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">สัญชาติ</label>
                <input
                  type="text"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.nationality && 'border-red-400'}`}
                  placeholder="ระบุสัญชาติ"
                />
                {errors.nationality && <div className="text-xs text-red-500">{errors.nationality}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">อาชีพ</label>
                <input
                  type="text"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.occupation && 'border-red-400'}`}
                  placeholder="ระบุอาชีพ"
                />
                {errors.occupation && <div className="text-xs text-red-500">{errors.occupation}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  disabled
                  className="border px-3 py-2 rounded-xl w-full bg-gray-100 text-gray-500"
                />
                {errors.phone && <div className="text-xs text-red-500">{errors.phone}</div>}
              </div>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">ที่อยู่ (บ้าน)</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={`border px-3 py-2 rounded-xl w-full ${errors.address && 'border-red-400'}`}
                placeholder="กรอกที่อยู่บ้าน"
              />
              {errors.address && <div className="text-xs text-red-500">{errors.address}</div>}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  className="border px-3 py-2 rounded-xl w-full bg-gray-100 text-gray-500"
                />
                {errors.email && <div className="text-xs text-red-500">{errors.email}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">ID Line</label>
                <input
                  type="text"
                  name="lineId"
                  value={form.lineId}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.lineId && 'border-red-400'}`}
                  placeholder="ระบุไลน์ไอดี"
                />
                {errors.lineId && <div className="text-xs text-red-500">{errors.lineId}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-medium mb-1">ชื่อสถานที่ทำงาน (ปัจจุบัน)</label>
              <input
                type="text"
                name="workPlace"
                value={form.workPlace}
                onChange={handleChange}
                className={`border px-3 py-2 rounded-xl w-full ${errors.workPlace && 'border-red-400'}`}
                placeholder="เช่น โรงพยาบาล ABC"
              />
              {errors.workPlace && <div className="text-xs text-red-500">{errors.workPlace}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">ตำแหน่งงาน</label>
              <input
                type="text"
                name="workPosition"
                value={form.workPosition}
                onChange={handleChange}
                className={`border px-3 py-2 rounded-xl w-full ${errors.workPosition && 'border-red-400'}`}
                placeholder="ระบุตำแหน่ง เช่น แพทย์, ผู้ช่วย, ..."
              />
              {errors.workPosition && <div className="text-xs text-red-500">{errors.workPosition}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">ที่อยู่ที่ทำงาน</label>
              <input
                type="text"
                name="workAddress"
                value={form.workAddress}
                onChange={handleChange}
                className={`border px-3 py-2 rounded-xl w-full ${errors.workAddress && 'border-red-400'}`}
                placeholder="กรอกที่อยู่"
              />
              {errors.workAddress && <div className="text-xs text-red-500">{errors.workAddress}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">เบอร์โทรศัพท์ (ที่ทำงาน)</label>
              <input
                type="text"
                name="workPhone"
                value={form.workPhone}
                onChange={handleChange}
                className={`border px-3 py-2 rounded-xl w-full ${errors.workPhone && 'border-red-400'}`}
                placeholder="กรอกเบอร์ที่ทำงาน"
              />
              {errors.workPhone && <div className="text-xs text-red-500">{errors.workPhone}</div>}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block font-semibold mb-1">ที่อยู่สำหรับรับเอกสารจากสมาคม</label>
              <div className="flex flex-col gap-2">
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="docAddressType"
                    value="home"
                    checked={form.docAddressType === "home"}
                    onChange={handleChange}
                  />
                  ที่อยู่บ้าน ({form.address || "---"})
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="docAddressType"
                    value="work"
                    checked={form.docAddressType === "work"}
                    onChange={handleChange}
                  />
                  ที่อยู่ที่ทำงาน ({form.workAddress || "---"})
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="docAddressType"
                    value="other"
                    checked={form.docAddressType === "other"}
                    onChange={handleChange}
                  />
                  อื่นๆ
                  {form.docAddressType === "other" && (
                    <input
                      type="text"
                      name="docAddressOther"
                      value={form.docAddressOther}
                      onChange={handleChange}
                      className={`border px-3 py-1 rounded-lg ml-2 ${errors.docAddressOther ? "border-red-400" : ""}`}
                      placeholder="กรอกที่อยู่"
                    />
                  )}
                </label>
                {errors.docAddressType && (
                  <div className="text-xs text-red-500">{errors.docAddressType}</div>
                )}
                {errors.docAddressOther && (
                  <div className="text-xs text-red-500">{errors.docAddressOther}</div>
                )}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">ที่อยู่สำหรับแสดงบนใบเสร็จ</label>
              <div className="flex flex-col gap-2">
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="receiptAddressType"
                    value="home"
                    checked={form.receiptAddressType === "home"}
                    onChange={handleChange}
                  />
                  ที่อยู่บ้าน ({form.address || "---"})
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="receiptAddressType"
                    value="work"
                    checked={form.receiptAddressType === "work"}
                    onChange={handleChange}
                  />
                  ที่อยู่ที่ทำงาน ({form.workAddress || "---"})
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="receiptAddressType"
                    value="other"
                    checked={form.receiptAddressType === "other"}
                    onChange={handleChange}
                  />
                  อื่นๆ
                  {form.receiptAddressType === "other" && (
                    <input
                      type="text"
                      name="receiptAddressOther"
                      value={form.receiptAddressOther}
                      onChange={handleChange}
                      className={`border px-3 py-1 rounded-lg ml-2 ${errors.receiptAddressOther ? "border-red-400" : ""}`}
                      placeholder="กรอกที่อยู่"
                    />
                  )}
                </label>
                {errors.receiptAddressType && (
                  <div className="text-xs text-red-500">{errors.receiptAddressType}</div>
                )}
                {errors.receiptAddressOther && (
                  <div className="text-xs text-red-500">{errors.receiptAddressOther}</div>
                )}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">ประเภทใบเสร็จรับเงิน</label>
              <div className="flex flex-col gap-2">
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="receiptType"
                    value="person"
                    checked={form.receiptType === "person"}
                    onChange={handleChange}
                  />
                  บุคคลธรรมดา
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="receiptType"
                    value="company"
                    checked={form.receiptType === "company"}
                    onChange={handleChange}
                  />
                  นิติบุคคล (สาขาใหญ่)
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="receiptType"
                    value="branch"
                    checked={form.receiptType === "branch"}
                    onChange={handleChange}
                  />
                  นิติบุคคล (สาขาย่อย)
                  {form.receiptType === "branch" && (
                    <input
                      type="text"
                      name="branchName"
                      value={form.branchName}
                      onChange={handleChange}
                      className={`border px-3 py-1 rounded-lg ml-2 ${errors.branchName ? "border-red-400" : ""}`}
                      placeholder="ระบุชื่อสาขา"
                    />
                  )}
                </label>
                {errors.receiptType && (
                  <div className="text-xs text-red-500">{errors.receiptType}</div>
                )}
                {errors.branchName && (
                  <div className="text-xs text-red-500">{errors.branchName}</div>
                )}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">
                เลขประจำตัวผู้เสียภาษี หรือเลขบัตรประชาชน
              </label>
              <input
                type="text"
                name="taxId"
                value={form.taxId}
                onChange={handleChange}
                className={`border px-3 py-2 rounded-xl w-full ${errors.taxId ? "border-red-400" : ""}`}
                placeholder="กรอกเลขประจำตัวผู้เสียภาษี หรือบัตรประชาชน"
              />
              {errors.taxId && (
                <div className="text-xs text-red-500">{errors.taxId}</div>
              )}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <label className="block font-semibold mb-2">
              หากไม่ระบุข้อมูลทางสมาคมขอสงวนสิทธิ์ที่จะไม่รับเป็นสมาชิกเนื่องจากไม่สามารถออกใบเสร็จรับเงินให้ได้ กรุณาเลือกยินยอมเพื่อรับรองและรับทราบตามรายละเอียดดังนี้
            </label>
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                name="agreeRule"
                checked={form.agreeRule}
                onChange={handleChange}
                className="mt-2 accent-blue-600 w-5 h-5"
              />
              <div>
                <span>
                  ข้าพเจ้าขอรับรองว่าจะปฏิบัติตามกฎระเบียบและข้อบังคับของสมาคมทุกประการ
                </span>
                <div className="text-sm mt-1">
                  (อ่านรายละเอียดข้อบังคับที่{" "}
                  <a
                    href="https://www.TLWA.or.th"
                    className="text-blue-500 underline hover:text-violet-700 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    เว็บไซต์ TLWA
                  </a>
                  )
                </div>
              </div>
            </div>
            {errors.agreeRule && (
              <div className="text-xs text-red-500">{errors.agreeRule}</div>
            )}
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                name="agreeConfirm"
                checked={form.agreeConfirm}
                onChange={handleChange}
                className="mt-2 accent-blue-600 w-5 h-5"
              />
              <span>
                ข้าพเจ้ารับทราบว่าการสมัครเป็นสมาชิกสามัญจะเสร็จสมบูรณ์เมื่อข้าพเจ้าได้รับการรับรองจากคณะกรรมการของสมาคมและสมาคมได้แจ้งยืนยันให้ชำระค่าธรรมเนียมจำนวน 1,750 บาทโดยชำระเงินให้แล้วเสร็จภายใน 30 วันนับจากการแจ้งรับเป็นสมาชิกสามัญ หากเกินกำหนดดังกล่าวข้าพเจ้ายินดีให้สมาคมยกเลิกการรับเป็นสมาชิกสามัญ
              </span>
            </div>
            {errors.agreeConfirm && (
              <div className="text-xs text-red-500">{errors.agreeConfirm}</div>
            )}
            <div className="mt-4">
              <label className="block font-semibold mb-2">การคุ้มครองข้อมูลส่วนบุคคล</label>
              <div className="flex flex-col gap-2">
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="pdpa1"
                    checked={form.pdpa1}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  ยินยอมให้สมาคมใช้ข้อมูลสำหรับการเป็นสมาชิกและกิจกรรมของสมาคม
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="pdpa2"
                    checked={form.pdpa2}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  ยินยอมให้สมาคมใช้ข้อมูลในการประสานงานกับหน่วยงานที่เกี่ยวข้อง
                </label>
                {errors.pdpa1 && (
                  <div className="text-xs text-red-500">{errors.pdpa1}</div>
                )}
                {errors.pdpa2 && (
                  <div className="text-xs text-red-500">{errors.pdpa2}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="flex flex-col gap-5">
            {[
              { name: "idCard", label: "สำเนาบัตรประชาชน (PDF/JPG/PNG)", accept: ".pdf,.jpg,.jpeg,.png" },
              { name: "houseReg", label: "สำเนาทะเบียนบ้าน (PDF/JPG/PNG)", accept: ".pdf,.jpg,.jpeg,.png" },
              { name: "profilePic", label: "รูปหน้าตรง (PDF/JPG/PNG)", accept: ".pdf,.jpg,.jpeg,.png" },
              { name: "educationCert", label: "สำเนาวุฒิการศึกษาสูงสุด (PDF/JPG/PNG)", accept: ".pdf,.jpg,.jpeg,.png" },
              { name: "medicalLicense", label: "ใบประกอบวิชาชีพเวชกรรม (ถ้ามี/เฉพาะแพทย์)", accept: ".pdf,.jpg,.jpeg,.png" }
            ].map(({ name, label, accept }) => (
              <div key={name} className="flex items-center gap-4">
                <label className="block font-medium flex-shrink-0 w-64">{label}</label>
                <div className="flex items-center gap-3 flex-1">
                  {!form[name] ? (
                    <label className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-violet-600 font-semibold transition-all text-base">
                      <FaCloudUploadAlt className="mr-1" />
                      อัปโหลดไฟล์
                      <input
                        type="file"
                        name={name}
                        accept={accept}
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2 shadow border">
                      <FaFileAlt className="text-indigo-500" />
                      <span className="truncate max-w-[180px]">{form[name]?.name || "เลือกไฟล์แล้ว"}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(name)}
                        className="hover:bg-red-100 rounded-full p-2"
                        aria-label="ลบไฟล์"
                        tabIndex={0}
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  )}
                  {errors[name] && <div className="text-xs text-red-500">{errors[name]}</div>}
                </div>
              </div>
            ))}
            <div>
              <label className="block font-medium mb-1">วุฒิการศึกษาสูงสุด</label>
              <div className="flex gap-3">
                <label>
                  <input type="radio" name="educationLevel" value="ปริญญาตรี" checked={form.educationLevel === "ปริญญาตรี"} onChange={handleChange} />
                  ปริญญาตรี
                </label>
                <label>
                  <input type="radio" name="educationLevel" value="ปริญญาโท" checked={form.educationLevel === "ปริญญาโท"} onChange={handleChange} />
                  ปริญญาโท
                </label>
                <label>
                  <input type="radio" name="educationLevel" value="ปริญญาเอก" checked={form.educationLevel === "ปริญญาเอก"} onChange={handleChange} />
                  ปริญญาเอก
                </label>
              </div>
              {errors.educationLevel && <div className="text-xs text-red-500">{errors.educationLevel}</div>}
            </div>
          </div>
        )}

        {/* Step 7 */}
        {step === 7 && (
          <div className="flex flex-col gap-4">
            <label className="block font-medium mb-1">ท่านมีความสนใจในการสอบบอร์ดนานาชาติหรือไม่?</label>
            <div className="flex gap-4">
              <label>
                <input type="radio" name="boardInterest" value="สนใจ" checked={form.boardInterest === "สนใจ"} onChange={handleChange} /> สนใจ
              </label>
              <label>
                <input type="radio" name="boardInterest" value="ไม่สนใจ" checked={form.boardInterest === "ไม่สนใจ"} onChange={handleChange} /> ไม่สนใจ
              </label>
              <label>
                <input type="radio" name="boardInterest" value="ลงสอบแล้ว" checked={form.boardInterest === "ลงสอบแล้ว"} onChange={handleChange} /> ลงสอบแล้ว
              </label>
            </div>
            {form.boardInterest === "สนใจ" && (
              <div className="mt-2">
                <label className="block font-medium mb-1">ประเภทที่ต้องการลงสอบ</label>
                <div className="flex gap-4">
                  <label>
                    <input type="radio" name="boardType" value="Physician" checked={form.boardType === "Physician"} onChange={handleChange} /> Physician (แพทย์)
                  </label>
                  <label>
                    <input type="radio" name="boardType" value="Professional" checked={form.boardType === "Professional"} onChange={handleChange} /> Professional (ป.โท Health)
                  </label>
                </div>
                {errors.boardType && <div className="text-xs text-red-500">{errors.boardType}</div>}
              </div>
            )}
            {errors.boardInterest && <div className="text-xs text-red-500">{errors.boardInterest}</div>}
          </div>
        )}

        {/* Step 8 */}
        {step === 8 && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg text-center mb-3">
              <span className="font-bold">จำนวนเงินที่ต้องชำระ: </span>
              <span className="font-bold text-green-600">1,750 บาท</span>
            </div>
            <div className="mb-6 text-gray-500">
              * จำลองระบบชำระเงินจริง (GB PrimePay API) จะพัฒนาในอนาคต
            </div>
            <button type="button"
              className="rounded-xl px-6 py-2 bg-gradient-to-r from-blue-400 to-violet-600 text-white text-lg font-bold shadow-lg"
              disabled
            > ชำระเงินผ่าน GB PrimePay (DEMO) </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              onClick={handleBack}
              disabled={saving}
            >
              Back
            </button>
          ) : <div />}
          {step < 8 ? (
            <button
              type="button"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
              onClick={handleNext}
              disabled={saving}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
              disabled={saving}
            >
              {saving ? "Saving..." : "บันทึก"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
