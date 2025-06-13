import React, { useState } from 'react'
import { motion, useAnimation, useCycle } from 'framer-motion'

// import logo benefits
import ben1 from '../assets/benefits/ben1.jpg'
import ben2 from '../assets/benefits/ben2.jpg'
import ben3 from '../assets/benefits/ben3.jpg'
import ben4 from '../assets/benefits/ben4.png'
import ben5 from '../assets/benefits/ben5.jpg'
import ben6 from '../assets/benefits/ben6.webp'

// import line decoration
import line from '../assets/benefits/line-9.png'

// === Animated วงกลม BG ===
function AnimatedCircle({ className, style, delay = 0, ...rest }) {
  // cycle ระหว่าง 2 ค่า ให้ลอยขึ้น/ลง
  const [animation, cycle] = useCycle({ y: 0 }, { y: 40 }, { y: -30 });
  React.useEffect(() => {
    const timer = setInterval(cycle, 2400 + delay)
    return () => clearInterval(timer)
  }, [cycle, delay])
  return (
    <motion.div
      className={className}
      style={style}
      animate={animation}
      transition={{ duration: 2.2, ease: "easeInOut" }}
      {...rest}
    />
  )
}

// ข้อมูล Benefits (ภาษาไทย/อังกฤษ)
const benefits = [
  {
    image: ben1,
    title: 'CHULA BOOK (ศูนย์หนังสือจุฬาฯ)',
    desc: 'สมาชิกสมาคมเวชศาสตร์วิถีชีวิตฯ และสุขภาพจิตไทย (TLWA)',
    details: `รายละเอียดสิทธิพิเศษสำหรับสมาชิก สมาคมเวชศาสตร์วิถีชีวิต และสุขภาวะไทย (TLWA)
        ต่อที่ 1 รับส่วนลด 10 % เมื่อซื้อสินค้าครบ 1,000 บาทขึ้นไป (ยกเว้นสินค้ารหัส N)
        ต่อที่ 2 ลดเพิ่มทันที 20 บาท เมื่อซื้อสินค้าครบ 1,000 บาทขึ้นไป (หลังหักส่วนลดแล้ว)
        – รับสิทธิ์ได้ตั้งแต่วันที่ 1 สิงหาคม – 31 ธันวาคม 2567
        – สามารถใช้สิทธิ์ได้ที่ร้าน CHULABOOK ทุกสาขา
        – สิทธิพิเศษนี้ ไม่สามารถเปลี่ยนแปลงเป็นเงินสดได้
        – สงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งให้ทราบล่วงหน้า`
  },
  {
    image: ben2,
    title: 'Kinokuniya',
    desc: 'แพทย์ พยาบาล สมาชิกฯ รับสิทธิสมัคร Kinokuniya Privilege Card (บัตรสมาชิก Academic Card) ได้ฟรี 1 ปี ไม่มีค่าใช้จ่าย',
    details: `Kinokuniya 
        1. แพทย์ พยาบาล เภสัชกร นักโภชนาการ สามารถสมัคร Kinokuniya Privilege Card ( ประเภท Academic Card ) ได้ฟรี 1 ปี ไม่มีค่าใช้จ่าย 
        2. สำหรับบุคคลทั่วไป มีความสนใจ สมัครบัตรสมาชิก จะมีค่าสมัคร 500 บาท / ปี 
        3. บัตรสมาชิก จะได้รับส่วนลดสำหรับซื้อหนังสือ 10% และ Magazine 5% ( ที่ร้านสาขา) 
        4. บัตรสมาชิก จะได้รับส่วนลด 10% สำหรับ ซื้อสินค้าผ่านทาง Website 
        5. บัตร Kinokuniya Privilege Card ( ประเภท Academic Card ) มีอายุ 1 ปี หลังวันออกบัตร 
        6. เดือนพฤศจิกายน ที่มีการจัดงานประชุม Kinokuniya มอบ Promotion code ส่วนลดพิเศษ 20% (เฉพาะรายการที่เข้าร่วมรายการ) ให้กับผู้ที่เข้าร่วมประชุมในเดือนพฤศจิกายน (จัดส่ง QR Code ส่วนลด ให้ทาง Email ที่ลงทะเบียน – ทาง Kinokuniya จะส่ง Link หรือ QR Code รายการที่ได้รับส่วนลด ให้ทางสมาคม) 
        
        หมายเหตุ 

        – ทางสมาคม เป็นผู้รวบรวมรายชื่อสมาชิก ผู้ได้สิทธิ์ ในการสมัครฟรี ให้ทาง Kinokuniya ทาง Email (ชื่อ-นามสกุล, Email-สถาบัน, เบอร์โทรศัพท์) 
        – สำหรับบุคคลทั่วไป ที่สนใจสมัครสมาชิก สามารถสมัครสมาชิก ได้ตามรายละเอียดด้านล่างครับ ( Scan QR code )`
  },
  {
    image: ben3,
    title: 'ร้านอาหาร Veganerie',
    desc: 'ทางร้านมอบสิทธิพิเศษให้ดังนี้ 1. ฟรี vegan ice-cream 1 scoop เมื่อทานครบ 800 บาท/ใบเสร็จ (สำหรับรายชื่อที่แนบในจดหมายอ้างอิง)',
    details: `ร้านอาหาร Veganerie
        ทางร้านมอบสิทธิพิเศษให้ดังนี้
        1. ฟรี vegan ice-cream 1 scoop เมื่อทานครบ 800 บาท/ใบเสร็จ
        (สามารถใช้ได้ที่วีแกนเนอรีทุกสาขา)

        *หมายเหตุ – ลูกค้าต้องโชว์บัตรสมาคมให้กับพนักงานที่ร้านเพื่อรับสิทธิประโยชน์
        **หมายเหตุ – ระยะเวลา : ตั้งแต่ 1 มีนาคม 2567 – 1 มีนาคม 2568`
  },
  {
    image: ben4,
    title: 'เครือโรงพยาบาลพญาไท / โรงพยาบาลเปาโล',
    desc: 'Privilege สำหรับสมาชิกสมาคม TLWA 1. รับส่วนลด 15% ค่าห้องพักและค่ารักษาพยาบาล (OPD) และผู้ป่วยใน (IPD)',
    details: `เครือโรงพยาบาลพญาไท / โรงพยาบาลเปาโล
        Privilage สำหรับสมาชิกสมาคม TLWA
        1. รับส่วนลด 15% ค่าห้องค่ายาสำหรับผู้ป่วยนอก (OPD) และผู้ป่วยใน (IPD)
        2. รับส่วนลด 10% ทันตกรรม ได้แก่ ขูดหินปูน, อุดฟัน, ถอนฟัน (ยกเว้นค่าแพทย์และค่าบริการ
        3. โปรแกรมให้วิตามินทางหลอดเลือด (IV Treatment) ราคาพิเศษ 2,500 บาท
        4. โปรแกรมตรวจสุขภาพ ราคาพิเศษ 3,999 บาท
        5. วัคซีนไข้หวัดใหญ่ 690 บาท

        *หมายเหตุ – ระยะเวลา 1 เมษายน 2567-31 มกราคม 2568`
  },
  {
    image: ben5,
    title: 'ร้านอาหารในเครือเขียวไข่กา',
    desc: 'รับส่วนลดพิเศษ สำหรับสมาชิก TLWA สำหรับเมนูเฉพาะที่ร้านเขียวไข่กา 10 %',
    details: `ร้านอาหารในเครือเขียวไข่กา
        รับส่วนลดพิเศษ สำหรับสมาชิก TLWA สำหรับส่วนลดค่าอาหาร จำนวน 10 %`
  },
  {
    image: ben6,
    title: 'ร้านหนังสือ Asia Book',
    desc: 'สำหรับผู้ลงทะเบียนเข้าร่วมประชุมวิชาการ Lifestyle Medicine and Wellbeing International Conference Bangkok',
    details: `ร้านหนังสือ Asia Book
        ** สำหรับผู้ลงทะเบียนเข้าร่วมประชุมโครงการ Lifestyle Medicine and Wellbeing International Conference Bangkok
        โดยคูปองส่วนลดนี้ใช้ได้เฉพาะที่ร้าน Asia Books สาขา CentralWorld ชั้น 6 เท่านั้น **

        เงื่อนไขการใช้คูปอง
        – ระยะเวลาการใช้คูปอง: 1 Apr – 31 Dec’24
        – รับส่วนลด 10% สำหรับการซื้อหนังสือภาษาอังกฤษ ในราคาปกติ พร้อมรับสิทธิ์สมัครสมาชิกเอเซียบุ๊คส
        – รับส่วนลด 15% สำหรับการซื้อหนังสือภาษาอังกฤษ ในราคาปกติ ครบ 1,800 บาทขึ้นไป
        *ยกเว้น สินค้า Tarot decks & other related accessories, Charity books, “NETT” price & special ordering items ไม่ร่วมรายการ
        – คูปองส่วนลดนี้ใช้ได้เฉพาะร้าน Asia Books สาขา CentralWorld ชั้น 6 เท่านั้น

        สามารถ Scan QR code เพื่อรับคูปอง
        Click Link Coupon`,
    couponUrl: "https://liff.line.me/1654883387DxN9w07M/c/01HSAZFWDSVKYRSSVBEHENACMJ"
  }
]

function Benefits() {
  const [openIdx, setOpenIdx] = useState(null)

  // ปุ่ม Find out more + เส้นซ้าย เฉพาะ hover/isOpen
  function FindOutMoreButton({ onClick, isOpen }) {
    return (
      <motion.button
        onClick={onClick}
        className="flex items-center gap-2 mt-5 focus:outline-none group cursor-pointer"
        initial="rest"
        whileHover="hover"
        animate={isOpen ? "hover" : "rest"}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        tabIndex={0}
      >
        {/* เส้นซ้าย - เฉพาะ hover/isOpen */}
        <motion.span
          className="h-[2px] rounded-full bg-pink-300"
          variants={{
            rest: { width: 0, opacity: 0 },
            hover: { width: "48px", opacity: 1, backgroundColor: "#f8bbd0" },
          }}
          transition={{ duration: 0.25 }}
        />
        {/* ข้อความ */}
        <motion.span
          className="text-pink-300 font-semibold text-base"
          variants={{
            rest: { color: "#e9aebc", x: 0, opacity: 1 },
            hover: { color: "#ffb6c1", x: 4, opacity: 1 },
          }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? "Hide details" : "Find out more"}
        </motion.span>
      </motion.button>
    )
  }

  // ฟังก์ชันเดิม renderDetails
  function renderDetails(item, idx) {
    if (!item.details) return null
    if (item.couponUrl) {
      const parts = item.details.split(/(Link Coupon)/)
      return parts.map((part, i) =>
        part === 'Link Coupon' ? (
          <a
            key={`coupon-link-${i}`}
            href={item.couponUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300 transition underline-offset-4 font-semibold"
          >
            Link Coupon
          </a>
        ) : (
          <span key={`text-${i}`}>{part}</span>
        )
      )
    }
    return item.details
  }

  // === Variants สำหรับ Card/ข้อความ ===
  const cardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.97 },
    visible: idx => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: 0.09 * idx, type: "spring", stiffness: 60, damping: 13 }
    })
  }
  const textVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: idx => ({
      opacity: 1, x: 0,
      transition: { delay: 0.19 + 0.09 * idx, type: "spring", stiffness: 80, damping: 14 }
    })
  }

  return (
    <section className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden">
      {/* Animated BG decor */}
      <AnimatedCircle className="absolute -left-32 bottom-0 w-72 h-72 bg-gray-800 opacity-60 rounded-full" delay={0} />
      <AnimatedCircle className="absolute left-32 top-96 w-6 h-6 bg-gray-800 opacity-40 rounded-full" delay={1400} />
      <img className='absolute right-0' src={line} alt="" />

      <div className="max-w-6xl mx-auto relative pt-12">
        {/* Heading Motion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, type: "spring" }}
          className="flex flex-col text-start mb-16"
        >
          <h5 className="text-pink-400 font-semibold text-xl mb-2">Benefits</h5>
          <h2 className="text-6xl font-bold mb-12 max-w-sm">
            Benefits we <br className="md:hidden" /> offer to you
          </h2>
          <p className="text-gray-400 font-semibold text-lg max-w-8xl">
            With personalized services and rewards, being a member enhances your overall experience and ensures you get the most value from your association with the organization.
          </p>
        </motion.div>

        {/* Cards Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-stretch">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              className={`
                group bg-gray-800/70 text-white rounded-2xl shadow-md p-6 w-full
                flex flex-col justify-between transition duration-300 hover:bg-gray-700/90
                ${idx === 4 ? 'lg:col-start-2' : ''}
              `}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={cardVariants}
              style={{
                minHeight: "280px",
                height: "100%"
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-contain" />
                  <h3 className="font-semibold text-lg transition-all duration-300 group-hover:text-blue-300">{item.title}</h3>
                </div>
                <motion.div
                  variants={textVariants}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <p className="text-gray-300 text-sm whitespace-pre-line">
                    {openIdx === idx ? renderDetails(item, idx) : item.desc}
                  </p>
                </motion.div>
              </div>
              <div>
                <FindOutMoreButton
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  isOpen={openIdx === idx}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits