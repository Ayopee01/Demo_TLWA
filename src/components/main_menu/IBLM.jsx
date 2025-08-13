import React, { useState } from "react";
import { FiFileText, FiMessageCircle, FiCheck, FiLayers } from "react-icons/fi";
import { motion, useCycle } from "framer-motion";

// import line decoration
import line from "/src/assets/benefits/line-9.png";

// === Animated วงกลม BG ===
function AnimatedCircle({ className, style, delay = 0, ...rest }) {
  const [animation, cycle] = useCycle({ y: 0 }, { y: 40 }, { y: -30 });
  React.useEffect(() => {
    const timer = setInterval(cycle, 2400 + delay);
    return () => clearInterval(timer);
  }, [cycle, delay]);
  return (
    <motion.div
      className={className}
      style={style}
      animate={animation}
      transition={{ duration: 2.2, ease: "easeInOut" }}
      {...rest}
    />
  );
}

// PDF path
const PDF_FILE = "/iblm/ข้อกำหนดการสมัครสอบ IBLM adjusted 14-6-2025.pdf";
const PDF_TEMPLATE = "/iblm/MDDOCertificationCaseStudyTemplate.pdf";

// --- Pill Language Switcher
function PillLang({ lang, setLang }) {
  return (
    <div className="flex justify-start my-2">
      <div className="flex border border-indigo-200 rounded-full overflow-hidden shadow-sm ml-2 mb-10">
        <button
          className={`cursor-pointer px-5 py-2 text-base font-semibold transition ${
            lang === "th"
              ? "bg-indigo-500 text-white"
              : "text-indigo-500 bg-white hover:bg-indigo-50"
          }`}
          onClick={() => setLang("th")}
        >
          TH
        </button>
        <button
          className={`cursor-pointer px-5 py-2 text-base font-semibold transition ${
            lang === "en"
              ? "bg-indigo-500 text-white"
              : "text-indigo-500 bg-white hover:bg-indigo-50"
          }`}
          onClick={() => setLang("en")}
        >
          EN
        </button>
      </div>
    </div>
  );
}

/** ===== Pricing Cards (แบบ Plus/Pro) ===== */
function PriceLine({ children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 rounded-full bg-emerald-500/20 p-1">
        <FiCheck className="h-4 w-4 text-emerald-400" />
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function PriceBlock({ title, tierBadge, original, member, details, onAddLine }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-8">
      {/* หัวข้อ */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
          {tierBadge}
        </span>
      </div>

      {/* ราคาโปรโมชัน */}
      <div className="mt-4">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold tracking-tight">${member}</span>
          <span className="text-sm text-gray-300 mb-1">certification fee</span>
        </div>
        <div className="mt-1 text-gray-300">
          <span className="line-through opacity-70 mr-2">${original}</span>
          <span className="inline-flex items-center rounded-md bg-emerald-500/20 px-2 py-0.5 text-emerald-300 text-xs font-semibold">
            Member
          </span>
        </div>
      </div>

      {/* รายการ */}
      <ul className="mt-6 space-y-3 text-gray-100">
        {details.map((line, idx) => (
          <PriceLine key={idx}>{line}</PriceLine>
        ))}
      </ul>

      {/* ปุ่ม Add LINE Official */}
      <div className="mt-8">
        <button
          onClick={onAddLine}
          className="cursor-pointer w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3 transition inline-flex items-center justify-center gap-2"
        >
          <FiMessageCircle className="text-lg" />
          Add LINE Official
        </button>
      </div>
    </div>
  );
}

function PricingTiers({ onAddLine }) {
  const [tier, setTier] = useState("T2"); // T2 | T3

  // ----- Data -----
  const T2 = {
    left: {
      title: "Physicians",
      original: 999,
      member: 899,
      details: [
        "TLWA lifelong membership fee of 1,750 Baht",
        "IBLM exam registration fee – non-refundable $99",
        "IBLM examination certification fee with TLWA member rebate $999 → $899 (discount $100)",
        "Production and shipment of the diplomate certificates ($30 per certificate)",
      ],
    },
    right: {
      title: "Professionals",
      original: 799,
      member: 720,
      details: [
        "TLWA lifelong membership fee of 1,750 Baht",
        "IBLM exam registration fee – non-refundable $49",
        "IBLM examination certification fee with TLWA member rebate $799 → $720 (discount $79)",
        "Production and shipment of the diplomate certificates ($30 per certificate)",
      ],
    },
  };

  const T3 = {
    left: {
      title: "Physicians",
      original: 699,
      member: 629,
      details: [
        "TLWA lifelong membership fee of 1,750 Baht",
        "IBLM exam registration fee – non-refundable $49",
        "IBLM examination certification fee with TLWA member rebate $699 → $629 (discount $70)",
        "Production and shipment of the diplomate certificates ($30 per certificate)",
      ],
    },
    right: {
      title: "Professionals",
      original: 499,
      member: 449,
      details: [
        "TLWA lifelong membership fee of 1,750 Baht",
        "IBLM exam registration fee – non-refundable $29",
        "IBLM examination certification fee with TLWA member rebate $499 → $449 (discount $50)",
        "Production and shipment of the diplomate certificates ($30 per certificate)",
      ],
    },
  };

  const data = tier === "T2" ? T2 : T3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mt-10"
    >
      {/* Toggle Tier */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-white/5 p-1 border border-white/10">
          <button
            onClick={() => setTier("T2")}
            className={`cursor-pointer px-5 py-2 text-sm font-semibold rounded-full transition ${
              tier === "T2" ? "bg-white text-gray-900" : "text-white/80 hover:text-white"
            }`}
          >
            Tier 2
          </button>
          <button
            onClick={() => setTier("T3")}
            className={`cursor-pointer px-5 py-2 text-sm font-semibold rounded-full transition ${
              tier === "T3" ? "bg-white text-gray-900" : "text-white/80 hover:text-white"
            }`}
          >
            Tier 3
          </button>
        </div>
      </div>

      {/* การ์ดซ้าย-ขวา */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <PriceBlock
          title={data.left.title}
          tierBadge={tier === "T2" ? "Tier 2" : "Tier 3"}
          original={data.left.original}
          member={data.left.member}
          details={data.left.details}
          onAddLine={onAddLine}
        />
        <PriceBlock
          title={data.right.title}
          tierBadge={tier === "T2" ? "Tier 2" : "Tier 3"}
          original={data.right.original}
          member={data.right.member}
          details={data.right.details}
          onAddLine={onAddLine}
        />
      </div>

      <p className="mt-4 text-center text-sm text-gray-400">
        * Exchange to THB depends on the rate at the time of payment.
      </p>
    </motion.div>
  );
}

// -- Full content
const IBLM_CONTENT = (pdfLink) => ({
    en: (
        <div className="space-y-3 text-base xl:text-lg leading-relaxed text-black">
            {/* Header EN*/}
            <div>Become Certified in Lifestyle Medicine Practice</div>
            <div>
                <b>Pathways for Lifestyle Medicine Certification for :</b>
            </div>
            <div>
                <li>Physicians: Must be credentialled by a reputable university as an MD, DO, MBBS or equivalent.</li>
            </div>
            <div>
                <li>Professionals: Must hold a PhD or Master’s degree in a health related discipline from a reputable institution.</li>
            </div>
            <div>
                {/* Title */}
                <b>Lifestyle medicine physicians and professionals become IBLM Diplomates by</b>
                <ol className="list-decimal pl-6 space-y-4">
                    {/* 1 */}
                    <li className="space-y-2">
                        <p>Gather your prerequisite 30h of CME from an approved course. We recommend the “Foundations of Lifestyle Medicine – the Lifestyle Medicine Board Review Course (LMBRC) of the American College of Lifestyle Medicine (ACLM) – eBook format. The cost for the non-CME version (we only require the certificate of completion for people outside the USA) for a Thai citizen is $449.</p>
                        <p>For the purpose of the IBLM’s Tiered Pricing Matrix, the following are considered as Tier 3 countries, e.g. Myanmar, Cambodia, Laos, Vietnam, Bhutan, and for a citizen of a Tier 3 country, the cost for the non-CME version of LMBRC eBook is $399.</p>
                        <p>It is available in English, Spanish, Korean, Chinese and Portuguese. Please note that ACLM no longer sends a printed LMBRC manual to purchasers. Anyone signing up for the LMBRC may now print one copy of the eBook.</p>
                        <p>You can find the LMBRC here : <a href="https://lifestylemedicine.org/education-certification/course-catalog/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Click Link</a></p>
                    </li>

                    {/* 2 */}
                    <li>
                        <p>Gather your prerequisite 20h of CME (in-person or virtual) from an approved event in your region. Countries authorized to run IBLM exam hubs also are authorized to run eligible in-person events and conferences. For physicians and professionals licensed to practice in Thailand, we recommend “Lifestyle Medicine and Wellbeing International Conference Bangkok (LMW Bangkok 2025)” 20 h (in-person) approved event :{" "}
                            <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">tlwa.or.th</a></p>
                    </li>

                    {/* 3 */}
                    <li>
                        <p>Submit documentation of completion of your exam prerequisites 30 or more days before the exam date, using the instructions provided by TLWA, after you sign up for the exam. Please note: physicians must also complete and submit a case study, retrievable via{" "}</p>
                        <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: Case Study Form</a>
                    </li>
                </ol>
                {/* • */}
                <li>
                    Attendance of LMW Bangkok 2025 immediately preceding an exam is exempt from the above 30-day rule.
                </li>
                <li>
                    Consider registering as a member of Thai Lifestyle Medicine and Wellbeing Association (TLWA) to receive discounts on association’s activities and membership benefits.
                </li>
                <li>
                    Register to enroll for the IBLM exam: October 19, 2025, Bangkok, Thailand :{" "}
                    <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">tlwa.or.th</a>
                </li>
                {/* Title */}
                <div className="pt-5">
                    <b>For the purpose of the IBLM’s Certification Pricing Matrix, Thailand is considered as a Tier 2 country.  Fees are to be paid to TLWA if you are a Thai citizen and would like to become a TLWA member :</b>
                    <ol className="list-decimal pl-6 space-y-4">
                        {/* 1 */}
                        <li>TLWA lifelong membership fee of 1,750 Baht</li>
                        {/* 2 */}
                        <li>IBLM exam registration fee –non-refundable ($99 for physicians; $49 for professionals)</li>
                        {/* 3 */}
                        <li>IBLM examination certification fee with TLWA member rebate ($999 – $100 = $899 for physicians; $799- $79 = $ 720 for Professionals)</li>
                        {/* 4 */}
                        <li>Production and shipment of the diplomate certificates ($30 per certificate)</li>
                    </ol>

                    {/* Title */}
                    <b>For the purpose of the IBLM’s Certification Pricing Matrix, the following are considered as Tier 3 countries, e.g. Myanmar, Cambodia, Laos, Vietnam, Bhutan. Fees are to be paid to TLWA if you are a citizen of Tier 3 country as explained above and would like to become a TLWA member :</b>
                    <ol className="list-decimal pl-6 space-y-4">
                        {/* 1 */}
                        <li>TLWA lifelong membership fee of 1,750 Baht</li>
                        {/* 2 */}
                        <li>IBLM exam registration fee –non-refundable ($49 for physicians; $29 for professionals)</li>
                        {/* 3 */}
                        <li>IBLM examination certification fee with TLWA member rebate ($699 – $70 = $629 for physicians; $499- $50 = $ 449 for Professionals)</li>
                        {/* 4 */}
                        <li>Production and shipment of the diplomate certificates ($30 per certificate)</li>
                    </ol>
                </div>
                {/* Detail */}
                <div>
                    <ol className="list-disc pl-6 space-y-4">
                        <li>For IBLM candidates, take the exam which consists of 150 for physicians/120 for professionals multiple choice questions of National Board of Medical Examiners (NBME) standard. The 2025 certification exam will be held on Sunday, October 19th , from 1:30 pm to 5:30 pm at Avani Ratchada Bangkok Hotel, Bangkok.</li>
                        <li>Pass the exam which is graded “on the curve” based upon psychometric assessment after each exam. Exam results are available just before Christmas 2025.</li>
                        <li>Congratulations! Based upon your professional category, you will now be a diplomate of the International Board of Lifestyle Medicine (DipIBLM).</li>
                        <li>Consider signing up for the MOC pathway at the beginning of the following year in order to keep your certification current. You will receive an invitation to do so in early January of each year.</li>
                    </ol>
                </div>
                <div className="mt-4 font-semibold text-red-500">
                    “ CLOSE OF IBLM EXAMINATION REGISTRATION ON SEPTEMBER 30th 2025 ”
                </div>
            </div>
        </div>
    ),
    th: (
        <div className="space-y-3 text-base xl:text-lg leading-relaxed text-black">
            <div>การสอบประกาศนียบัตรของ International Board of Lifestyle Medicine หรือ IBLM</div>
            <div>
                <b>เส้นทางการสอบประกาศนียบัตรของ IBLM สำหรับบุคลากรทางการแพทย์สองประเภท ดังนี้ :</b>
            </div>
            <ul className="list-disc pl-6">
                <li>แพทย์ : ต้องได้รับปริญญาแพทยศาสตร์บัณฑิตย์จากมหาวิทยาลัยที่มีชื่อเสียง (ปริญญา เช่น MD, DO, MBBS หรือเทียบเท่า)</li>
                <li>โปรเฟชชันนอล (บุคลากรสายวิชาชีพด้านการแพทย์และสุขภาพ) : ต้องสำเร็จการศึกษาระดับปริญญาเอกหรือปริญญาโทในสาขาวิชาที่เกี่ยวข้องกับสุขภาพจากสถาบันการศึกษาที่มีชื่อเสียง</li>
            </ul>
            <div>
                <b>ข้อกำหนดของการสมัครสอบ IBLM สำหรับแพทย์และโปรเฟชชันนอล</b>
            </div>
            <ol className="list-decimal pl-6 space-y-4">
                {/* 1 */}
                <li className="space-y-2">
                    <p>เรียนจากหลักสูตร CME ที่ได้รับอนุมัติจาก IBLM ครบจำนวน 30 ชั่วโมง หลักสูตรที่แนะนำคือ “Foundations of Lifestyle Medicine – the Lifestyle Medicine Board Review Course (LMBRC)” ของ American College of Lifestyle Medicine (ACLM) ค่าใช้จ่ายสำหรับโปรแกรมที่ไม่ได้รับ CME คือ 449 ดอลลาร์สหรัฐ สำหรับพลเมืองไทย (IBLM ต้องการเพียงใบรับรองการจบหลักสูตรสำหรับผู้ที่อยู่นอกสหรัฐอเมริกา)</p>
                    <p>สำหรับ Tiered Pricing Matrix ของ IBLM ประเทศดังต่อไปนี้ถือเป็นประเทศระดับ Tier 3 อาทิ เมียนมาร์ กัมพูชา สปป.ลาว เวียดนาม ภูฏาน ค่าใช้จ่ายสำหรับโปรแกรมที่ไม่ได้รับ CME คือ 399 ดอลล่าร์สหรัฐ สำหรับพลเมืองของประเทศระดับ Tier 3 (IBLM ต้องการเพียงใบรับรองการจบหลักสูตรสำหรับผู้ที่อยู่นอกสหรัฐอเมริกา)</p>
                    <p>หลักสูตร LMBRC ได้จัดทำไว้ในภาคภาษาอังกฤษ สเปน เกาหลี จีน และโปรตุเกส  โปรดทราบว่า ACLM จะไม่จัดส่งคู่มือ LMBRC ฉบับพิมพ์ให้แก่ผู้ซื้ออีกต่อไป ผู้ที่สมัครเข้าร่วมหลักสูตร LMBRC สามารถพิมพ์สำเนาหนังสืออิเล็กทรอนิกส์ (eBook) ได้ 1 ฉบับ</p>
                    <p>เว็บไซด์สำหรับค้นหาและสมัครเข้าเรียนในหลักสูตร LMBRC สามารถเข้าดูได้ที่นี่ : <a href="https://lifestylemedicine.org/education-certification/course-catalog/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">คลิกลิงค์</a></p>
                </li>
                {/* 2 */}
                <li>
                    <p>เข้าร่วมกิจกรรม CME ที่ได้รับอนุมัติ ครบจำนวน 20 ชั่วโมง (ออนไลน์หรือเข้าร่วมด้วยตัวเอง) จากกิจกรรมที่ได้รับอนุมัติภายในภูมิภาคของท่าน ประเทศที่ได้รับอนุญาตให้เป็นศูนย์การจัดสอบ IBLM จะได้รับอนุญาตให้จัดกิจกรรมหรือการประชุมแบบที่เข้าร่วมด้วยตนเอง สำหรับแพทย์และโปรเฟชชันนอลที่ได้รับใบอนุญาตประกอบวิชาชีพในประเทศไทย ขอแนะนำให้เข้าร่วมงาน “Lifestyle Medicine and Wellbeing International Conference Bangkok (LMW Bangkok 2025)” ที่ได้รับอนุมัติจาก IBLM แล้วให้ครบ 20 ชั่วโมงแบบที่เข้าร่วมด้วยตนเอง รายละเอียดเพิ่มเติมในเว็บไซด์{" "}
                        <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">tlwa.or.th</a></p>

                </li>
                {/* 3 */}
                <li>
                    <p>ระยะเวลาการส่งหลักฐานตามข้อกำหนดของการสอบคือ อย่างน้อย 30 วันก่อนวันสอบ โดยให้ปฎิบัติตามคำแนะนำของ TLWA ภายหลังจากที่ได้สมัครสอบแล้ว โปรดทราบ: แพทย์จะต้องกรอกและส่งกรณีศึกษาหนึ่งกรณี ซึ่งสามารถใช้แบบฟอร์มสำหรับกรอกกรณีศึกษาได้จาก{" "}
                        <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">ลิงค์: แบบฟอร์ม</a></p>
                    <p className="text-red-500">*** หรือสอบถามทางไลน์ OA ***</p>
                </li>
            </ol>
            {/* • */}
            <li>การเข้าร่วม LMW Bangkok 2025 ก่อนการสอบ จะได้รับการยกเว้นจากกฎ 30 วันดังที่กล่าวข้างต้น</li>
            <li>พิจารณาลงทะเบียนเป็นสมาชิกสมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย (TLWA) เพื่อรับส่วนลดในการร่วมกิจกรรมต่างๆของสมาคมและสิทธิประโยชน์ในฐานะสมาชิก</li>
            <li>ลงทะเบียนสอบ IBLM  ซึ่งมีกำหนดจัดขึ้นในวันที่ 19 ตุลาคม 2568 เวลา 13.30 – 17.30 น. ณ โรงแรม Avani Ratchada Bangkok กรุงเทพมหานคร ประเทศไทย อ่านข้อมูลเพิ่มเติมได้ในเว็บไซด์{" "}
                <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">tlwa.or.th</a></li>

            {/* Title */}
            <b>สำหรับ Certification Pricing Matrix ของ IBLM ประเทศไทยถือเป็นประเทศระดับ Tier 2 ผู้สนใจสมัครสอบซึ่งเป็นชาวไทย สามารถพิจารณาค่าธรรมเนียมที่จะต้องชำระให้กับสมาคม TLWA ดังต่อไปนี้ :</b>
            <ol className="list-decimal pl-6 space-y-4">
                {/* 1 */}
                <li>ค่าลงทะเบียนสมาชิกสมาคม TLWA ตลอดชีพ 1,750 บาท</li>
                {/* 2 */}
                <li>ค่าธรรมเนียมการลงทะเบียนสอบ IBLM – $99 สำหรับแพทย์ และ $49 สำหรับโปรเฟชชันนอล (ไม่สามารถคืนเงินได้หากถอนตัวในภายหลัง)</li>
                {/* 3 */}
                <li>ค่าธรรมเนียมการสอบ IBLM โดยสามารถหักส่วนลดหากเป็นสมาชิกสมาคม TLWA
                    สำหรับแพทย์ 999 ดอลลาร์ – 100 ดอลลาร์ = 899 ดอลลาร์
                    สำหรับโปรเฟชชั่นนอล 799 ดอลลาร์ – 79 ดอลลาร์ = 720 ดอลลาร์
                    <p className="text-red-500">(จำนวนเงินเป็นสกุลเงินบาท จะขึ้นอยู่กับอัตราแลกเปลี่ยนในวันที่ชำระเงิน)</p></li>
                {/* 4 */}
                <li>ค่าจัดส่งใบรับรอง 30 ดอลลาร์ ต่อ 1 ใบรับรอง
                    <p className="text-red-500">(จำนวนเงินเป็นสกุลเงินบาท จะขึ้นอยู่กับอัตราแลกเปลี่ยนในวันที่ชำระเงิน)</p></li>
            </ol>
            {/* Title */}
            <b>สำหรับ Certification Pricing Matrix ของ IBLM ประเทศดังต่อไปนี้ถือเป็นประเทศระดับ Tier 3 อาทิ เมียนมาร์ กัมพูชา สปป.ลาว เวียดนาม ภูฏาน ผู้สนใจสมัครสอบซึ่งเป็นพลเมืองของประเทศระดับ Tier 3 สามารถพิจารณาค่าธรรมเนียมที่จะต้องชำระให้กับสมาคม TLWA ดังรายละเอียดที่ปรากฎใน Section ภาคภาษาอังกฤษ (EN)</b>
            {/* Detail */}
            <div>
                <ol className="list-disc pl-6 space-y-4">
                    <li>การสอบ IBLM ในปี 2025 จะมีข้อสอบที่ประกอบด้วยคำถามแบบปรนัย สำหรับแพทย์ 150 ข้อ หรือสำหรับโปรเฟชชันนอล 120 ข้อ ซึ่งจัดทำขึ้นตามมาตรฐานของ National Board of Medical Examiners (NBME) การสอบ IBLM ปี 2025 ณ กรุงเทพมหานคร จะจัดขึ้นในวันอาทิตย์ที่ 19 ตุลาคม เวลา 13.30 น. ถึง 17.30 น.</li>
                    <li>การให้เกรดผลสอบ จะพิจารณาจากเส้นโค้งของกราฟผลคะแนน (on the curve) โดยมีพื้นฐานจากการประเมินแบบ psychometric หลังการสอบแต่ละครั้งและจะประกาศผลสอบก่อนวันคริสตมาสในปีค.ศ. 2025</li>
                    <li>ท่านที่สอบผ่าน จะได้รับสถานะเป็น Diplomate ของ International Board of Lifestyle Medicine (DipIBLM)</li>
                    <li>แนะนำให้พิจารณาเข้าร่วมแนวทางการต่ออายุการรับรอง (Maintenance of Certification Pathway – MOC pathway) ซึ่งท่านจะได้รับข้อมูลส่งถึงท่านในปีถัดไปหลังจากที่สอบเป็นผลสำเร็จแล้ว เพื่อรักษาสถานะการรับรองให้เป็นปัจจุบัน โดยท่านจะได้รับคำเชิญให้เข้าร่วม MOC ในช่วงต้นเดือนมกราคมของแต่ละปี</li>
                </ol>
                <div className="mt-4 font-semibold text-red-500">
                    “ ปิดการลงทะเบียนสอบ IBLM วันที่ 30 กันยายน 2568 ”
                </div>
            </div>
        </div>
    ),
});

const LINE_OFFICIAL_NAME = "T.L.W.A.";
const LINE_QR_URL = "https://qr-official.line.me/gs/M_980winmq_BW.png?oat_content=qr";
const LINE_LINK = "https://lin.ee/pd1Bpje";

export default function IBLM() {
  const [popup, setPopup] = useState(false);
  const [lang, setLang] = useState("en");
  const [showLine, setShowLine] = useState(false);

  // ฟังก์ชันเปิด LINE popup ใช้ร่วมกับปุ่มในการ์ด
  const openLine = () => setShowLine(true);

  return (
    <section id="iblm" className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden">
      {/* BG decor */}
      <AnimatedCircle className="absolute -left-32 bottom-0 w-72 h-72 bg-gray-500 opacity-60 rounded-full" delay={0} />
      <AnimatedCircle className="absolute left-32 top-96 w-6 h-6 bg-gray-500 opacity-40 rounded-full" delay={1400} />
      <img className="absolute right-0" src={line} alt="" />

      <div className="max-w-6xl mx-auto px-4 py-10 relative">
        {/* Main title */}
        <h1 className="text-pink-400 font-semibold text-xl mb-2">IBLM</h1>
        <h2 className="text-6xl font-bold mb-12 max-w-xl">
          Become Certified in Lifestyle Medicine Practice
        </h2>

        {/* Intro */}
        <p className="text-gray-400 font-semibold text-lg max-w-8xl">
          Whether you’re a physician or a health professional, the path to becoming an IBLM Diplomate starts here. With accredited courses,
          hands-on conferences, and a supportive professional community, you can advance your expertise in lifestyle medicine, earn international
          recognition, and make a lasting impact on health and wellness in Thailand and beyond.
        </p>

        {/* Pricing Cards */}
        <PricingTiers onAddLine={openLine} />

        {/* แถวล่าง: PDF + Read More (ย้ายลงมาแทน Add LINE เดิม) */}
        <div className="flex flex-wrap items-center gap-6 mt-8">
          {/* PDF link */}
          <a
            href={PDF_FILE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
            title="Open PDF"
          >
            <FiFileText className="text-3xl" />
            <span className="font-medium text-base underline">IBLM Guide PDF</span>
          </a>

          {/* Read More button (ไอคอนนำหน้า, ตัวอักษรสีขาว) */}
          <button
            onClick={() => setPopup(true)}
            className="cursor-pointer flex items-center gap-2 text-gray-100 hover:text-gray-500 transition"
            title="Read More"
          >
            {/* FiMessageCircle, FiCheck */}
            <FiLayers className="text-3xl" />
            <span className="font-medium text-base underline">Read More</span>
          </button>
        </div>

        {/* Main Info Popup */}
        {popup && (
          <div
            className="fixed z-50 inset-0 bg-black/60 flex items-center justify-center"
            onClick={() => setPopup(false)}
            style={{ cursor: "pointer" }}
          >
            <div
              className="relative bg-white max-w-2xl w-[95vw] max-h-[90vh] rounded-2xl shadow-2xl p-6 xl:p-8 overflow-y-auto animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
              style={{ color: "#222" }}
            >
              {/* ปุ่มปิด */}
              <button
                onClick={() => setPopup(false)}
                className="cursor-pointer absolute top-8 right-3 bg-gray-200 hover:bg-red-400 text-gray-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition z-10"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Language Switcher */}
              <PillLang lang={lang} setLang={setLang} />
              {/* Full content */}
              <div>{IBLM_CONTENT(PDF_TEMPLATE)[lang]}</div>
            </div>
          </div>
        )}

        {/* LINE Official Popup */}
        {showLine && (
          <div
            className="fixed z-50 inset-0 bg-black/60 flex items-center justify-center"
            onClick={() => setShowLine(false)}
            style={{ cursor: "pointer" }}
          >
            <div className="relative bg-white w-[360px] max-w-[95vw] rounded-2xl shadow-2xl px-8 py-7 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
              <div className="text-lg font-semibold text-center mb-3 text-black">LINE Official Account</div>
              <div className="text-center font-bold text-green-700 mb-3">T.L.W.A.</div>
              <div className="flex justify-center mb-1">
                <div className="w-40 h-40 bg-gray-100 flex items-center justify-center rounded-lg shadow-inner border border-gray-200 overflow-hidden">
                  <img src="https://qr-official.line.me/gs/M_980winmq_BW.png?oat_content=qr" alt="QR Code" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex justify-center mt-3">
                <a
                  href="https://lin.ee/pd1Bpje"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500 font-semibold text-base hover:text-blue-800"
                >
                  Line Official
                </a>
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">Scan this QR code to add our official LINE account.</div>
            </div>
          </div>
        )}

        {/* Styles */}
        <style>{`
          .animate-fadeIn { animation: fadeIn .35s; }
          @keyframes fadeIn { from { opacity: 0; transform: scale(.96);} to { opacity: 1; transform: scale(1);} }
          .underline.text-blue-600 { color: #2563eb !important; }
        `}</style>
      </div>
    </section>
  );
}
