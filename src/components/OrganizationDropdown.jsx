import React, { useState, useRef, useEffect } from "react";

/**
 * OrganizationDropdown Component
 * @param {object} props
 * @param {string[]} props.options - รายชื่อองค์กรทั้งหมด
 * @param {string} props.value - องค์กรที่ถูกเลือก
 * @param {function} props.onChange - ฟังก์ชัน callback เมื่อเลือกองค์กร
 * @param {string} props.placeholder - ข้อความ placeholder
 */
export default function OrganizationDropdown({
  options = [],
  value = "",
  onChange,
  placeholder = "ค้นหาองค์กร...",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef();

  // ปิด dropdown เมื่อคลิกนอก component
  useEffect(() => {
    function handleClick(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Filter องค์กรด้วยคำค้นหา
  const filtered = options.filter(
    (o) => o.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="relative" ref={inputRef}>
      <button
        type="button"
        className="w-full px-4 py-2 text-left bg-white border-2 border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? (
          <span
            className="block font-semibold break-words whitespace-normal"
            style={{
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </span>
        ) : (
          <span className="block text-gray-400">{placeholder}</span>
        )}
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-blue-200 rounded-xl shadow-lg max-h-60 overflow-auto animate-fadein-fast">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder={placeholder}
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul role="listbox">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-gray-400 select-none">ไม่พบองค์กร</li>
            )}
            {filtered.map((org, idx) => (
              <li
                key={org}
                className={`px-4 py-2 cursor-pointer transition font-medium flex items-start gap-2
                  ${org === value ? "bg-blue-100 text-blue-800 font-bold" : "hover:bg-blue-50"}
                `}
                onClick={() => {
                  onChange && onChange(org);
                  setOpen(false);
                  setSearch("");
                }}
                role="option"
                aria-selected={org === value}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange && onChange(org);
                    setOpen(false);
                    setSearch("");
                  }
                }}
              >
                <span className="mt-0.5 text-gray-500 flex-shrink-0">{options.indexOf(org) + 1}.</span>
                <span
                  className="break-words whitespace-normal"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    maxWidth: "calc(100% - 32px)",
                    display: "inline-block",
                  }}
                >
                  {org}
                </span>
                {org === value && (
                  <span className="ml-2 inline-block text-blue-600 text-lg" aria-hidden>
                    ✓
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
