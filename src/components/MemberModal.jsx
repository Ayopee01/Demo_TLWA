import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaFileAlt, FaTrash, FaCloudUploadAlt, FaRegEdit } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";

const RELIGIONS = [
  "พุทธ", "คริสต์", "อิสลาม", "ฮินดู", "ซิกข์", "ยูดาย", "เชน", "เต๋า", "ชินโต", "Baháʼí", "ลัทธิขงจื๊อ", "ไม่มีศาสนา"
];

function calculateAgeFromDate(dateStr) {
  if (!dateStr) return "";
  const birthDate = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function formatDateThai(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
}
function getPreviewUrl(file) {
  if (file && file.type && file.type.startsWith("image/")) {
    return URL.createObjectURL(file);
  }
  return null;
}

export default function MemberModal({ open, onClose }) {
  const { user, updateUser, loginUser } = useUser();
  const formRef = useRef(null);
  const localKey = user ? `memberData_${user.id}` : null;

  const defaultForm = {
    prefixTh: "", prefixEn: "", suffixEn: "",
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
    idCard: [], houseReg: [], profilePic: [], educationCert: [], medicalLicense: [],
    educationLevel: "",
    boardInterest: "",
    boardType: "",
    qrImage: "",
    paymentRef: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [memberData, setMemberData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [payMethod, setPayMethod] = useState("qr");
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [cardErr, setCardErr] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [allMembers, setAllMembers] = useState([]);

  // Sync localStorage memberData_x (ตอน edit)
  function syncEditLocal(formObj) {
    if (isEdit && step >= 1 && step <= 6 && user && localKey) {
      localStorage.setItem(localKey, JSON.stringify(formObj));
    }
  }

  // อัปเดตข้อมูล user บน server
  async function updateUserInfoOnServer(userId, form) {
    const userData = {
      prefix: form.prefixTh || "",
      firstName: form.firstName || "",
      lastName: form.lastName || "",
      firstNameEn: form.firstNameEn || "",
      lastNameEn: form.lastNameEn || "",
      address: form.address || ""
    };
    if (form.phone) userData.phone = form.phone;
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
  }

  // โหลดข้อมูลเดิม
  useEffect(() => {
    if (!open || !user) return;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      setForm(f => ({ ...defaultForm, ...JSON.parse(saved) }));
      return;
    }
    setForm(f => ({
      ...defaultForm,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      firstNameEn: user.firstNameEn || "",
      lastNameEn: user.lastNameEn || "",
      prefixTh: user.prefix || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    }));
  }, [user, open, localKey]);

  useEffect(() => {
    async function fetchMember() {
      if (user?.id && open) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/members/user/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setIsMember(true);
            setMemberData(data);
            setIsEdit(false);
            setForm(f => ({ ...f, ...data }));
          } else {
            setIsMember(false);
            setMemberData(null);
            setIsEdit(false);
          }
        } catch {
          setIsMember(false);
          setMemberData(null);
          setIsEdit(false);
        }
      }
      setStep(1);
    }
    fetchMember();
  }, [user, open]);

  useEffect(() => {
    async function fetchAllMembers() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/members`);
        if (res.ok) {
          const arr = await res.json();
          setAllMembers(Array.isArray(arr) ? arr : []);
        }
      } catch {
        setAllMembers([]);
      }
    }
    if (open) fetchAllMembers();
  }, [open]);

  useEffect(() => {
    const newPreviews = {};
    ["idCard", "houseReg", "profilePic", "educationCert", "medicalLicense"].forEach((field) => {
      newPreviews[field] = (form[field] || []).map((file) => getPreviewUrl(file));
    });
    Object.values(previewUrls).flat().forEach(url => url && URL.revokeObjectURL(url));
    setPreviewUrls(newPreviews);
    return () => Object.values(newPreviews).flat().forEach(url => url && URL.revokeObjectURL(url));
  }, [form.idCard, form.houseReg, form.profilePic, form.educationCert, form.medicalLicense]);

  function validateStep(stepToCheck = step, values = form) {
    const err = {};
    if (stepToCheck === 1) {
      if (!values.prefixTh) err.prefixTh = "กรุณากรอกคำนำหน้า (TH)";
      if (!values.firstName) err.firstName = "กรุณากรอกชื่อ (TH)";
      if (!values.lastName) err.lastName = "กรุณากรอกนามสกุล (TH)";
      if (!values.firstNameEn) err.firstNameEn = "กรุณากรอกชื่อ (EN)";
      if (!values.lastNameEn) err.lastNameEn = "กรุณากรอกนามสกุล (EN)";
      if (!values.birthDate) err.birthDate = "กรุณากรอกวันเกิด";
      if (!values.religion) err.religion = "กรุณาเลือกศาสนา";
    }
    if (stepToCheck === 2) {
      if (!values.race) err.race = "กรุณากรอกเชื้อชาติ";
      if (!values.nationality) err.nationality = "กรุณากรอกสัญชาติ";
      if (!values.occupation) err.occupation = "กรุณากรอกอาชีพ";
      if (!values.address) err.address = "กรุณากรอกที่อยู่";
      if (values.email) {
        const hasEmailDup = allMembers.some(m => m.email === values.email && (isEdit ? m.user_id !== user.id : true));
        if (hasEmailDup) err.email = "อีเมลนี้ถูกใช้งานแล้ว";
      }
      const idLineRegex = /^[a-z0-9._-]{3,}$/;
      if (!values.lineId) err.lineId = "กรุณากรอก ID Line";
      else if (!idLineRegex.test(values.lineId)) err.lineId = "ID Line ต้องเป็น a-z 0-9 .-_ และยาวอย่างน้อย 3 ตัว";
      else {
        const hasDup = allMembers.some(m => m.lineId === values.lineId && (isEdit ? m.user_id !== user.id : true));
        if (hasDup) err.lineId = "ID Line นี้มีในระบบแล้ว";
      }
    }
    if (stepToCheck === 3) {
      if (!values.workPlace || values.workPlace.length < 3) err.workPlace = "กรุณากรอกชื่อสถานที่ทำงาน (ไม่น้อยกว่า 3 ตัวอักษร)";
      if (!values.workPosition || values.workPosition.length < 3) err.workPosition = "กรุณากรอกตำแหน่ง (ไม่น้อยกว่า 3 ตัวอักษร)";
      if (!values.workAddress || values.workAddress.length < 3) err.workAddress = "กรุณากรอกที่อยู่ที่ทำงาน (ไม่น้อยกว่า 3 ตัวอักษร)";
      if (!values.workPhone || !/^\d{9,10}$/.test(values.workPhone)) err.workPhone = "กรุณากรอกเบอร์ที่ทำงาน 9-10 หลัก";
    }
    if (stepToCheck === 4) {
      if (!values.docAddressType) err.docAddressType = "เลือกที่อยู่สำหรับเอกสาร";
      if (values.docAddressType === "other" && !values.docAddressOther) err.docAddressOther = "กรุณากรอกที่อยู่ (อื่นๆ)";
      if (!values.receiptAddressType) err.receiptAddressType = "เลือกที่อยู่บนใบเสร็จ";
      if (values.receiptAddressType === "other" && !values.receiptAddressOther) err.receiptAddressOther = "กรุณากรอกที่อยู่ (อื่นๆ)";
      if (!values.taxId) err.taxId = "กรุณากรอกเลขประจำตัวผู้เสียภาษีหรือบัตรประชาชน";
      else if (!/^\d{13}$/.test(values.taxId)) err.taxId = "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก";
      else {
        const hasDup = allMembers.some(m => m.taxId === values.taxId && (isEdit ? m.user_id !== user.id : true));
        if (hasDup) err.taxId = "เลขนี้มีในระบบแล้ว";
      }
    }
    if (stepToCheck === 5) {
      if (!values.agreeRule) err.agreeRule = "กรุณายอมรับข้อตกลง";
      if (!values.agreeConfirm) err.agreeConfirm = "กรุณายืนยันการรับทราบ";
      if (!values.pdpa1) err.pdpa1 = "กรุณายินยอม PDPA";
      if (!values.pdpa2) err.pdpa2 = "กรุณายินยอม PDPA2";
    }
    if (stepToCheck === 6) {
      if (!(values.idCard && values.idCard.length)) err.idCard = "กรุณาแนบไฟล์บัตรประชาชน";
      if (!(values.houseReg && values.houseReg.length)) err.houseReg = "กรุณาแนบไฟล์สำเนาทะเบียนบ้าน";
      if (!(values.profilePic && values.profilePic.length)) err.profilePic = "กรุณาแนบรูปหน้าตรง";
      if (!(values.educationCert && values.educationCert.length)) err.educationCert = "กรุณาแนบไฟล์วุฒิการศึกษา";
      if (!values.educationLevel) err.educationLevel = "กรุณาเลือกวุฒิการศึกษา";
    }
    if (stepToCheck === 7) {
      if (!values.boardInterest) err.boardInterest = "กรุณาเลือกความสนใจสอบบอร์ด";
      if (values.boardInterest === "สนใจ" && !values.boardType) err.boardType = "เลือกประเภทสอบบอร์ด";
    }
    return err;
  }

  useEffect(() => {
    setErrors(validateStep(step, form));
  }, [form, step, allMembers, isEdit, user]);

  function handleChange(e) {
    const { name, value, type, checked, files: fileInput } = e.target;
    let newForm = {};
    if (type === "checkbox") {
      newForm = { ...form, [name]: checked };
    } else if (type === "file") {
      newForm = { ...form, [name]: [...(form[name] || []), ...Array.from(fileInput)] };
    } else {
      newForm = { ...form, [name]: value };
    }
    setForm(newForm);
    setMsg('');
    syncEditLocal(newForm);
  }
  function handleRemoveFile(field, idx) {
    const newForm = { ...form, [field]: form[field].filter((_, i) => i !== idx) };
    setForm(newForm);
    syncEditLocal(newForm);
  }

  function validateCardForm() {
    const errs = {};
    if (!/^\d{16}$/.test(cardForm.number)) errs.number = "กรุณากรอกเลขบัตร 16 หลัก";
    if (!cardForm.name) errs.name = "กรุณากรอกชื่อบนบัตร";
    if (!/^([0-1][0-9])\/([0-9]{2})$/.test(cardForm.expiry)) errs.expiry = "MM/YY ไม่ถูกต้อง";
    if (!/^\d{3,4}$/.test(cardForm.cvc)) errs.cvc = "CVC 3-4 หลัก";
    return errs;
  }

  const maxStep = isEdit || (isMember && memberData) ? 6 : 8;
  const age = useMemo(() => calculateAgeFromDate(form.birthDate), [form.birthDate]);

  async function handleNext() {
    const stepErr = validateStep(step, form);
    setErrors(stepErr);
    if (Object.keys(stepErr).length > 0) return;
    if (user?.id && (step === 1 || step === 2)) {
      await updateUserInfoOnServer(user.id, form);
    }
    syncEditLocal(form);
    if (isEdit && step === 5) {
      setStep(6);
      return;
    }
    setStep(s => s + 1);
  }
  function handleBack() {
    syncEditLocal(form);
    setStep(s => s - 1);
    setErrors({});
    setMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const stepErr = validateStep(step, form);
    setErrors(stepErr);
    if (Object.keys(stepErr).length > 0) return;
    setSaving(true);
    setMsg('');
    try {
      if (user?.id) {
        await updateUserInfoOnServer(user.id, form);
      }
      if ((isEdit && step === 6) || (!isEdit && step === 8)) {
        if (!isEdit && step === 8 && payMethod === "credit") {
          const cErrs = validateCardForm();
          setCardErr(cErrs);
          if (Object.keys(cErrs).length > 0) {
            setSaving(false);
            return;
          }
        }
        const dataToSend = {
          user_id: user?.id,
          prefixTh: form.prefixTh, prefixEn: form.prefixEn || "", suffixEn: form.suffixEn || "",
          firstName: form.firstName, lastName: form.lastName,
          firstNameEn: form.firstNameEn, lastNameEn: form.lastNameEn,
          nickName: form.nickName, birthDate: form.birthDate, religion: form.religion,
          race: form.race, nationality: form.nationality, occupation: form.occupation,
          address: form.address, phone: form.phone, email: form.email, lineId: form.lineId,
          workPlace: form.workPlace, workPosition: form.workPosition, workAddress: form.workAddress, workPhone: form.workPhone,
          docAddressType: form.docAddressType, docAddressOther: form.docAddressOther,
          receiptAddressType: form.receiptAddressType, receiptAddressOther: form.receiptAddressOther,
          receiptType: form.receiptType, branchName: form.branchName,
          taxId: form.taxId, agreeRule: form.agreeRule, agreeConfirm: form.agreeConfirm, pdpa1: form.pdpa1, pdpa2: form.pdpa2,
          educationLevel: form.educationLevel, boardInterest: form.boardInterest, boardType: form.boardType,
          payMethod: payMethod, paymentRef: form.paymentRef || "",
        };
        if (!isEdit && step === 8 && payMethod === "credit") {
          dataToSend.cardNumber = cardForm.number;
          dataToSend.cardName = cardForm.name;
          dataToSend.cardExpiry = cardForm.expiry;
          dataToSend.cardCvc = cardForm.cvc;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/members`, {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const memberId = data.memberId || data.id;
        // upload files
        const fileFields = ["idCard", "houseReg", "profilePic", "educationCert", "medicalLicense"];
        for (const field of fileFields) {
          if (form[field] && form[field].length) {
            for (const file of form[field]) {
              const fd = new FormData();
              fd.append("member_id", memberId);
              fd.append("file_type", field);
              fd.append("file", file);
              const fileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/member-files`, {
                method: "POST",
                body: fd,
              });
              if (!fileRes.ok) throw new Error(await fileRes.text());
            }
          }
        }

        // PATCH สำคัญ: Sync localStorage.memberData_x
        if (user && localKey) {
          localStorage.setItem(localKey, JSON.stringify(form));
        }

        // PATCH สำคัญ: Sync localStorage.user + context user ทุกครั้งหลังบันทึก
        const newUser = {
          ...user,
          prefix: form.prefixTh || "",
          firstName: form.firstName || "",
          lastName: form.lastName || "",
          firstNameEn: form.firstNameEn || "",
          lastNameEn: form.lastNameEn || "",
          address: form.address || "",
          phone: form.phone || "",
          email: form.email || ""
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        if (typeof updateUser === "function") updateUser(newUser);
        if (typeof loginUser === "function") loginUser(newUser);

        if (!isEdit && user && localKey) localStorage.removeItem(localKey);

        setMsg("บันทึกข้อมูลสำเร็จ");
        setTimeout(() => {
          setSaving(false);
          onClose();
        }, 1000);
        return;
      }
    } catch (err) {
      setMsg("เกิดข้อผิดพลาด: " + err.message);
    }
    setSaving(false);
  }

  function handleOverlayClick(e) {
    if (formRef.current && !formRef.current.contains(e.target)) {
      onClose && onClose();
    }
  }

  function MemberIDCard({ memberData, onEdit, onClose }) {
    if (!memberData || memberData.user_id !== user?.id) return null;
    const profilePicUrl = memberData.profilePicUrl
      ? `${import.meta.env.VITE_API_URL}${memberData.profilePicUrl}`
      : "";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl" onMouseDown={handleOverlayClick}>
        <div
          ref={formRef}
          className="relative bg-gradient-to-br from-indigo-100 to-blue-50 border border-indigo-200 shadow-2xl rounded-3xl w-[360px] max-w-[95vw] flex flex-col items-center p-0"
          onMouseDown={e => e.stopPropagation()}
        >
          <button type="button" className="absolute top-3 right-5 text-2xl text-gray-400 hover:text-gray-700" onClick={onClose}>×</button>
          <div className="w-full rounded-t-3xl px-7 pt-8 pb-2 flex flex-col items-center relative bg-white">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200 shadow mb-2 bg-gray-100 flex items-center justify-center">
              {profilePicUrl ? (
                <img src={profilePicUrl} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-6xl text-gray-300">?</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Member ID: <b>{memberData.id || "N/A"}</b>
            </div>
            <div className="text-[18px] font-bold text-indigo-800 mb-1">
              {(memberData.prefixEn || "") + " " + memberData.firstNameEn + " " + memberData.lastNameEn + (memberData.suffixEn ? " " + memberData.suffixEn : "")}
            </div>
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-semibold">Birthdate: </span>
              {formatDateThai(memberData.birthDate)}
            </div>
          </div>
          <div className="bg-indigo-50 w-full rounded-b-3xl px-7 py-4 flex flex-col gap-2 text-[15px] mt-[-4px]">
            <div>
              <span className="font-semibold text-gray-700">Address:</span>{" "}
              <span className="text-gray-700">{memberData.address || "-"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Workplace:</span>{" "}
              <span className="text-gray-700">{memberData.workPlace || "-"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Position:</span>{" "}
              <span className="text-gray-700">{memberData.occupation || "-"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Phone:</span>{" "}
              <span className="text-gray-700">{memberData.phone || "-"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email:</span>{" "}
              <span className="text-gray-700">{memberData.email || "-"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (memberData?.user_id !== user?.id) {
                alert("ไม่สามารถแก้ไขข้อมูลของผู้อื่นได้");
                return;
              }
              setIsEdit(true);
              setStep(1);
              setForm(f => ({ ...f, ...memberData }));
            }}
            className="mt-4 mb-5 flex items-center gap-2 py-2 px-7 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow transition-all"
          >
            <FaRegEdit /> Edit Profile
          </button>
        </div>
      </div>
    );
  }

  if (!open || !user || !user.id) return null;
  if (isMember && memberData && !isEdit) {
    return (
      <MemberIDCard
        memberData={memberData}
        onEdit={() => {
          if (memberData?.user_id !== user?.id) {
            alert("ไม่สามารถแก้ไขข้อมูลของผู้อื่นได้");
            return;
          }
          setIsEdit(true);
          setStep(1);
          setForm(f => ({ ...f, ...memberData }));
        }}
        onClose={onClose}
      />
    );
  }

  // ---------- Main Form -------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl">
      <form
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white border py-6 px-8 overflow-y-auto max-h-[90dvh]"
        onSubmit={handleSubmit}
        autoComplete="off"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute right-4 top-4 text-2xl text-gray-400 cursor-pointer" onClick={onClose}>×</div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          สมัครสมาชิก (ขั้นตอนที่ {step} / {maxStep})
        </h2>
        {msg && (
          <div className={`mb-3 text-center text-${msg.includes('สำเร็จ') ? 'green' : 'red'}-500 font-semibold`}>
            {msg}
          </div>
        )}
        <div className="flex mb-6 justify-center gap-2">
          {[...Array(maxStep)].map((_, n) => (
            <div key={n} className={`h-2 w-10 rounded-full ${step >= n + 1 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
          ))}
        </div>

        {/* ================== STEP 1 ================== */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">คำนำหน้า (TH) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="prefixTh"
                  value={form.prefixTh}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.prefixTh && 'border-red-400'}`}
                  placeholder="นาย, นางสาว, ดร., ..."
                />
                {errors.prefixTh && <div className="text-xs text-red-500">{errors.prefixTh}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">
                  คำนำหน้า (EN) <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="prefixEn"
                    value={form.prefixEn}
                    onChange={handleChange}
                    className={`border px-3 py-2 rounded-xl w-full ${errors.prefixEn && 'border-red-400'}`}
                    placeholder="Mr., Mrs., Dr., ..."
                  />
                  <span className="mx-2 self-center"> </span>
                  <input
                    type="text"
                    name="suffixEn"
                    value={form.suffixEn}
                    onChange={handleChange}
                    className={`border px-3 py-2 rounded-xl w-32 ${errors.suffixEn && 'border-red-400'}`}
                    placeholder="Jr., Sr., ... (ถ้ามี)"
                  />
                </div>
                <div className="flex gap-2">
                  {errors.prefixEn && <div className="text-xs text-red-500">{errors.prefixEn}</div>}
                  {errors.suffixEn && <div className="text-xs text-red-500">{errors.suffixEn}</div>}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span>ตัวอย่าง: <b>Dr.</b> John Smith <b>Jr.</b> (คำนำหน้า EN + คำต่อท้าย EN)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">ชื่อ (TH)</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.firstName && 'border-red-400'}`} placeholder="ชื่อภาษาไทย" />
                {errors.firstName && <div className="text-xs text-red-500">{errors.firstName}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">ชื่อ (EN)</label>
                <input type="text" name="firstNameEn" value={form.firstNameEn} onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.firstNameEn && 'border-red-400'}`} placeholder="First Name (EN)" />
                {errors.firstNameEn && <div className="text-xs text-red-500">{errors.firstNameEn}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">นามสกุล (TH)</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.lastName && 'border-red-400'}`} placeholder="นามสกุลภาษาไทย" />
                {errors.lastName && <div className="text-xs text-red-500">{errors.lastName}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">นามสกุล (EN)</label>
                <input type="text" name="lastNameEn" value={form.lastNameEn} onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.lastNameEn && 'border-red-400'}`} placeholder="Last Name (EN)" />
                {errors.lastNameEn && <div className="text-xs text-red-500">{errors.lastNameEn}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">ชื่อเล่น</label>
                <input type="text" name="nickName" value={form.nickName} onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.nickName && 'border-red-400'}`} placeholder="กรอกชื่อเล่น" />
                {errors.nickName && <div className="text-xs text-red-500">{errors.nickName}</div>}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">วัน/เดือน/ปี เกิด</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate ? form.birthDate.split('T')[0] : ''}
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
                <input type="text" name="age" value={age ? `${age} ปี` : ""} disabled
                  className="border px-3 py-2 rounded-xl w-full bg-gray-100 text-gray-500" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">ศาสนา</label>
                <select name="religion" value={form.religion} onChange={handleChange}
                  className={`border px-3 py-2 rounded-xl w-full ${errors.religion && 'border-red-400'}`}>
                  <option value="">เลือกศาสนา</option>
                  {RELIGIONS.map(r => (<option key={r} value={r}>{r}</option>))}
                </select>
                {errors.religion && <div className="text-xs text-red-500">{errors.religion}</div>}
              </div>
            </div>
          </div>
        )}

        {/* ================== STEP 2 ================== */}
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

        {/* ================== STEP 3 ================== */}
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

        {/* ================== STEP 4 ================== */}
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

        {/* ================== STEP 5 ================== */}
        {step === 5 && (
          <div className="flex flex-col">
            <label className="block font-semibold mb-2">
              หากไม่ระบุข้อมูลทางสมาคมขอสงวนสิทธิ์ที่จะไม่รับเป็นสมาชิกเนื่องจากไม่สามารถออกใบเสร็จรับเงินให้ได้ กรุณาเลือกยินยอมเพื่อรับรองและรับทราบตามรายละเอียดดังนี้
            </label>
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                name="agreeRule"
                checked={form.agreeRule}
                onChange={handleChange}
                className="mt-1.5"
              />
              <div>
                <span>
                  ข้าพเจ้าขอรับรองว่าจะปฏิบัติตามกฎระเบียบและข้อบังคับของสมาคมทุกประการ
                </span>
                <div className="font-semibold mt-1">
                  (อ่านรายละเอียดข้อบังคับที่{" "}
                  <a
                    href="https://www.TLWA.or.th"
                    className="text-blue-500 hover:text-blue-800 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website TLWA
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
                className="mt-1.5 accent-blue-600"
              />
              <span>
                ข้าพเจ้ารับทราบว่าการสมัครเป็นสมาชิกสามัญจะเสร็จสมบูรณ์เมื่อข้าพเจ้าได้รับการรับรองจากคณะกรรมการของสมาคมและสมาคมได้แจ้งยืนยันให้ชำระค่าธรรมเนียมจำนวน 1,750 บาทโดยชำระเงินให้แล้วเสร็จภายใน 30 วันนับจากการแจ้งรับเป็นสมาชิกสามัญ หากเกินกำหนดดังกล่าวข้าพเจ้ายินดีให้สมาคมยกเลิกการรับเป็นสมาชิกสามัญ
              </span>
            </div>
            {errors.agreeConfirm && (
              <div className="text-xs text-red-500">{errors.agreeConfirm}</div>
            )}
            <div className="mt-4">
              <label className="block font-semibold mb-2">การคุ้มครองข้อมูลส่วนบุคคล
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="pdpa1"
                    checked={form.pdpa1}
                    onChange={handleChange}
                    className="mb-24 accent-blue-600"
                  />
                  ข้าพเจ้าขอให้ความยินยอมแก่สมาคมในการเก็บรวบรวมข้อมูลเพื่อใช้เปิดเผยและโอนไปในหน่วยงานที่เกี่ยวข้องสำหรับการเป็นสมาชิกและการดำเนินกิจกรรมของสมาคมทั้งนี้ในกรณีที่ข้าพเจ้าไม่ได้ให้ความยินยอมข้างต้นข้าพเจ้ารับทราบว่ามีผลต่อการพิจารณาใบสมัครสมาชิกสามัญของข้าพเจ้าและอาจเป็นผลให้สมาคมวัยสามารถดำเนินการหรือให้บริการแก่ข้าพเจ้าได้ทั้งหมดหรือบางส่วน
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

        {/* ================== STEP 6 ================== */}
        {step === 6 && (
          <div className="flex flex-col gap-5">
            {[
              { name: "idCard", label: "สำเนาบัตรประชาชน (JPG/JPEG/PNG/WEBP)", accept: ".jpg,.jpeg,.png,.webp" },
              { name: "houseReg", label: "สำเนาทะเบียนบ้าน (JPG/JPEG/PNG/WEBP)", accept: ".jpg,.jpeg,.png,.webp" },
              { name: "profilePic", label: "รูปหน้าตรง (JPG/JPEG/PNG/WEBP)", accept: ".jpg,.jpeg,.png,.webp" },
              { name: "educationCert", label: "สำเนาวุฒิการศึกษาสูงสุด (JPG/JPEG/PNG/WEBP)", accept: ".jpg,.jpeg,.png,.webp" },
              { name: "medicalLicense", label: "ใบประกอบวิชาชีพเวชกรรม (ถ้ามี/เฉพาะแพทย์)", accept: ".jpg,.jpeg,.png,.webp" }
            ].map(({ name, label, accept }) => (
              <div key={name} className="flex items-start gap-4">
                <label className="block font-medium flex-shrink-0 w-64">{label}</label>
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex flex-row flex-wrap gap-3 mb-1">
                    {(form[name] || []).map((file, idx) => (
                      <div key={idx} className="relative group border rounded-lg p-1 bg-gray-50 flex items-center shadow hover:shadow-md transition">
                        {previewUrls[name]?.[idx] ? (
                          <img
                            src={previewUrls[name][idx]}
                            alt={file.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <FaFileAlt className="w-10 h-10 text-indigo-400" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(name, idx)}
                          className="absolute -top-2 -right-2 bg-white border border-gray-300 hover:bg-red-500 hover:text-white rounded-full p-1 shadow transition"
                          aria-label="ลบไฟล์"
                          tabIndex={0}
                        >
                          <FaTrash className="w-4 h-4 text-red-500 group-hover:text-white" />
                        </button>
                        <span className="text-xs block mt-1 max-w-[70px] truncate text-gray-700">{file?.name}</span>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-violet-600 font-semibold transition-all text-base w-fit">
                    <FaCloudUploadAlt className="mr-1" />
                    เพิ่มไฟล์
                    <input
                      type="file"
                      name={name}
                      accept={accept}
                      multiple
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
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

        {/* ================== STEP 7 ================== */}
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

        {/* ================== STEP 8: PAYMENT ================== */}
        {step === 8 && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-lg text-center mb-1">
              <span className="font-bold">จำนวนเงินที่ต้องชำระ: </span>
              <span className="font-bold text-green-600">1,750 บาท</span>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                className={`px-5 py-2 rounded-xl font-semibold border transition ${payMethod === "qr" ? "bg-indigo-500 text-white" : "bg-white text-gray-700 border-indigo-400"}`}
                onClick={() => setPayMethod("qr")}
              >จ่ายผ่าน QR</button>
              <button
                type="button"
                className={`px-5 py-2 rounded-xl font-semibold border transition ${payMethod === "credit" ? "bg-indigo-500 text-white" : "bg-white text-gray-700 border-indigo-400"}`}
                onClick={() => setPayMethod("credit")}
              >บัตรเครดิต/เดบิต</button>
            </div>
            {payMethod === "qr" ? (
              !form.qrImage ? (
                <button
                  type="button"
                  className="rounded-xl px-6 py-2 bg-gradient-to-r from-blue-400 to-violet-600 text-white text-lg font-bold shadow-lg"
                  onClick={async () => {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/gbprimepay-qr`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        amount: "1750.00",
                        referenceNo: `MEMBER_${user?.id}_${Date.now()}`,
                        user_id: user?.id,
                      }),
                    });
                    const data = await res.json();
                    setForm(f => ({ ...f, qrImage: data.qrImage, paymentRef: data.referenceNo }));
                  }}
                >ชำระเงินผ่าน QR (GB PrimePay)</button>
              ) : (
                <div>
                  <img src={form.qrImage} alt="QR Pay" className="mx-auto mb-2" style={{ width: 240 }} />
                  <div className="text-gray-700 mb-1 text-center">สแกนเพื่อชำระเงิน</div>
                  <div className="text-xs text-gray-400 text-center">เลข ref: {form.paymentRef}</div>
                </div>
              )
            ) : (
              <div className="w-full max-w-xs mx-auto border rounded-xl p-5 bg-gray-50 shadow-lg">
                <div className="text-md font-semibold mb-3">ชำระเงินด้วยบัตรเครดิต/เดบิต</div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm">เลขบัตร (16 หลัก)</label>
                    <input
                      type="text"
                      maxLength={16}
                      name="number"
                      value={cardForm.number}
                      onChange={e => setCardForm(f => ({ ...f, number: e.target.value.replace(/\D/g, '') }))}
                      className={`mt-1 border px-3 py-2 rounded-xl w-full ${cardErr.number ? "border-red-400" : ""}`}
                      placeholder="0000 0000 0000 0000"
                    />
                    {cardErr.number && <div className="text-xs text-red-500">{cardErr.number}</div>}
                  </div>
                  <div>
                    <label className="text-sm">ชื่อบนบัตร</label>
                    <input
                      type="text"
                      name="name"
                      value={cardForm.name}
                      onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                      className={`mt-1 border px-3 py-2 rounded-xl w-full ${cardErr.name ? "border-red-400" : ""}`}
                      placeholder="NAME SURNAME"
                    />
                    {cardErr.name && <div className="text-xs text-red-500">{cardErr.name}</div>}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm">หมดอายุ (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        name="expiry"
                        value={cardForm.expiry}
                        onChange={e => {
                          let val = e.target.value.replace(/[^\d/]/g, '').slice(0, 5);
                          if (val.length === 2 && cardForm.expiry.length === 1) val += '/';
                          setCardForm(f => ({ ...f, expiry: val }));
                        }}
                        className={`mt-1 border px-3 py-2 rounded-xl w-full ${cardErr.expiry ? "border-red-400" : ""}`}
                        placeholder="MM/YY"
                      />
                      {cardErr.expiry && <div className="text-xs text-red-500">{cardErr.expiry}</div>}
                    </div>
                    <div className="w-24">
                      <label className="text-sm">CVC</label>
                      <input
                        type="text"
                        maxLength={4}
                        name="cvc"
                        value={cardForm.cvc}
                        onChange={e => setCardForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, '') }))}
                        className={`mt-1 border px-3 py-2 rounded-xl w-full ${cardErr.cvc ? "border-red-400" : ""}`}
                        placeholder="123"
                      />
                      {cardErr.cvc && <div className="text-xs text-red-500">{cardErr.cvc}</div>}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">* Demo เท่านั้น ยังไม่ตัดเงินจริง</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ปุ่ม Next/Back/Submit */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button type="button"
              className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              onClick={handleBack} disabled={saving}>Back</button>
          ) : <div />}
          {isEdit ? (
            step < 6 ? (
              <button type="button"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
                onClick={handleNext} disabled={saving}>Next</button>
            ) : (
              <button type="submit"
                className="px-8 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
                disabled={saving}>
                {saving ? "Saving..." : "บันทึก"}
              </button>
            )
          ) : (
            step < maxStep ? (
              <button type="button"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
                onClick={handleNext} disabled={saving}>Next</button>
            ) : (
              <button type="submit"
                className="px-8 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
                disabled={saving}>
                {saving ? "Saving..." : "บันทึก"}
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}