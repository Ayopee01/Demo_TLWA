import React, { useState, useRef, useEffect } from 'react'

const RulesAndRegulations = () => {
  const [showFull, setShowFull] = useState(false)
  const [maxHeight, setMaxHeight] = useState('400px')
  const contentRef = useRef(null)

  useEffect(() => {
    if (showFull && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setMaxHeight('400px')
    }
  }, [showFull])

  return (
    <section className="bg-[#0B1120] text-white py-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-pink-400 mb-4">
          ข้อบังคับสมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย
        </h1>

        <p className="text-gray-300 text-lg">
          สมาคมนี้มีชื่อว่า "สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย" (THAI LIFESTYLE MEDICINE AND WELLBEING ASSOCIATION - TLWA) จัดตั้งขึ้นเพื่อส่งเสริมวิชาการและการปฏิบัติตามแนวทางเวชศาสตร์วิถีชีวิตในประเทศไทย
        </p>

        {/* กล่องเนื้อหาพร้อมเบลอ */}
        <div
          className="relative transition-all duration-500 ease-in-out overflow-hidden"
          style={{ maxHeight }}
          ref={contentRef}
        >
          <div className="space-y-8">
            {/* หมวดที่ 1-8 (ย่อไว้บางส่วนเพื่อความกระชับ) */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 1 ความทั่วไป</h2>
              <p>ข้อ 1 - 4: กล่าวถึงชื่อสมาคม เครื่องหมายสำนักงาน และวัตถุประสงค์ที่เกี่ยวกับการส่งเสริมวิชาการ การศึกษา การวิจัย และการป้องกันโรคด้วยเวชศาสตร์วิถีชีวิต</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 2 สมาชิก</h2>
              <p>ข้อ 5 - 12: ระบุประเภทสมาชิก เงื่อนไขการสมัคร คุณสมบัติ ค่าลงทะเบียน สิทธิและหน้าที่ของสมาชิก และกระบวนการอนุมัติ</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 3 การดำเนินการสมาคม</h2>
              <p>ข้อ 13 - 21: กำหนดโครงสร้างคณะกรรมการสมาคม หน้าที่ อำนาจ การประชุม และข้อกำหนดพิเศษสำหรับการดำเนินงานสมาคม</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 4 การประชุมใหญ่</h2>
              <p>ข้อ 22 - 29: อธิบายการประชุมใหญ่สามัญและวิสามัญ วิธีการเรียกประชุม องค์ประชุม และกระบวนการลงมติ</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 5 การเงินและทรัพย์สิน</h2>
              <p>ข้อ 30 - 37: ว่าด้วยการจัดการด้านการเงิน อำนาจในการเบิกจ่าย เงินสดในสมาคม การตรวจสอบบัญชีและบทบาทของเหรัญญิก</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 6 การเปลี่ยนแปลงแก้ไขข้อบังคับและการเลิกสมาคม</h2>
              <p>ข้อ 38 - 40: เงื่อนไขการแก้ไขข้อบังคับและการเลิกสมาคม พร้อมกระบวนการและมติที่ใช้ในการดำเนินการ</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 7 บทเบ็ดเสร็จ</h2>
              <p>ข้อ 41 - 43: การตีความข้อบังคับ การใช้ประมวลกฎหมายแพ่งและพาณิชย์ และข้อกำหนดไม่แสวงหาผลกำไร</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">หมวดที่ 8 บทเฉพาะกาล</h2>
              <p>ข้อ 44 - 45: ข้อบังคับเริ่มมีผลบังคับใช้ตั้งแต่วันที่สมาคมได้รับการจดทะเบียนเป็นนิติบุคคล และถือว่าสมาชิกเริ่มมีผลนับแต่วันนั้นเป็นต้นไป</p>
            </div>

            {/* ลิงก์ PDF */}
            <div className="mt-10">
              <a
                href="https://www.tlwa.or.th/wp-content/uploads/2024/07/ข้อบังคับสมาคม-ฉบับแก้ไขครั้งที่-1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-md transition"
              >
                ดูข้อบังคับฉบับเต็ม (PDF)
              </a>
            </div>
          </div>

          {/* เอฟเฟกต์เบลอ */}
          {!showFull && (
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0B1120] to-transparent pointer-events-none" />
          )}
        </div>

        {/* ปุ่ม Read More / Show Less */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowFull(!showFull)}
            className="cursor-pointer mt-6 px-6 py-2 text-white bg-pink-500 hover:bg-pink-600 transition-all duration-300 rounded-lg"
          >
            {showFull ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default RulesAndRegulations
