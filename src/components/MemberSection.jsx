// components/MemberSection.jsx
import React, { useEffect, useState } from "react";
import RegisterMemberModal from "./RegisterMemberModal";
import EditMemberModal from "./EditMemberModal";
import CardMember from "./CardMember";
import { useUser } from "../contexts/UserContext";

// คอมโพเนนต์ตัวกลางแสดง Register, Card, Edit
export default function MemberSection({ open, onClose }) {
  const { user } = useUser();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  // โหลดข้อมูลสมาชิกจาก API ทุกครั้งที่ open หรือ user เปลี่ยน
  useEffect(() => {
    if (!open || !user?.id) return;
    setLoading(true);
    setError("");
    fetch(`${import.meta.env.VITE_API_URL}/api/members/user/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("ไม่พบข้อมูลสมาชิก");
        return res.json();
      })
      .then(data => {
        setMemberData(data || null);
        setLoading(false);
      })
      .catch(() => {
        setMemberData(null);
        setLoading(false);
      });
  }, [open, user]);

  // callback เมื่อกดบันทึกใน Edit หรือ Register เสร็จ
  const handleAfterSave = () => {
    setEditMode(false);
    setLoading(true);
    // Reload ข้อมูล member ใหม่
    fetch(`${import.meta.env.VITE_API_URL}/api/members/user/${user.id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setMemberData(data || null);
        setLoading(false);
        onClose && onClose(); // ปิด modal
      });
  };

  // callback เมื่อกดปิด (reset state)
  const handleClose = () => {
    setEditMode(false);
    setMemberData(null);
    setLoading(false);
    onClose && onClose();
  };

  // Loading
  if (!open) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
        <div className="bg-white rounded-xl p-8 shadow-xl text-lg text-gray-800">
          กำลังโหลดข้อมูล...
        </div>
      </div>
    );
  }

  // ถ้ามีข้อมูล member ในฐานข้อมูล
  if (memberData && !editMode) {
    return (
      <CardMember
        memberData={memberData}
        onEdit={() => setEditMode(true)}
        onClose={handleClose}
      />
    );
  }

  // Edit mode
  if (memberData && editMode) {
    return (
      <EditMemberModal
        open={true}
        onClose={() => setEditMode(false)}
        memberData={memberData}
        afterSave={handleAfterSave}
      />
    );
  }

  // ยังไม่มี member ในระบบนี้ (สมัครใหม่)
  return (
    <RegisterMemberModal
      open={open}
      onClose={handleClose}
      afterSave={handleAfterSave}
    />
  );
}
