import React, { useState } from "react";
import { FiFileText, FiMessageCircle } from "react-icons/fi";

// PDF path
const PDF_FILES = {
    en: "/pdf/IBLM_Guide_EN.pdf",
    th: "/pdf/IBLM_Guide_TH.pdf",
};

const LINE_OFFICIAL_NAME = "T.L.W.A.";
const LINE_QR_URL = "https://qr-official.line.me/gs/M_980winmq_BW.png?oat_content=qr";
const LINE_LINK = "https://lin.ee/pd1Bpje";

// --- Pill Language Switcher
function PillLang({ lang, setLang }) {
    return (
        <div className="flex justify-end my-2">
            <div className="flex border border-indigo-200 rounded-full overflow-hidden shadow-sm ml-2 mb-10">
                <button
                    className={`cursor-pointer px-5 py-2 text-base font-semibold transition 
                ${lang === "th" ? "bg-indigo-500 text-white" : "text-indigo-500 bg-white hover:bg-indigo-50"}`}
                    onClick={() => setLang("th")}
                >
                    TH
                </button>
                <button
                    className={`cursor-pointer px-5 py-2 text-base font-semibold transition 
                ${lang === "en" ? "bg-indigo-500 text-white" : "text-indigo-500 bg-white hover:bg-indigo-50"}`}
                    onClick={() => setLang("en")}
                >
                    EN
                </button>
            </div>
        </div>
    );
}

// -- Full content
const IBLM_CONTENT = {
    en: (
        <div className="space-y-3 text-base xl:text-lg leading-relaxed text-black">
            <div>Become Certified in Lifestyle Medicine Practice</div>
            <div>
                <b>Pathways for Lifestyle Medicine Certification for :</b>
            </div>
            <div>
                Physicians: Must be credentialled by a reputable university as an MD, DO, MBBS or equivalent.
            </div>
            <div>
                Professionals: Must hold a PhD or Master’s degree in a health related discipline from a reputable institution.
            </div>
            <div>
                Lifestyle medicine physicians and professionals become IBLM Diplomates by
                <ol className="list-decimal pl-6">
                    <li>
                        Gather your prerequisite 30h of CME from an approved course. We recommend the “Foundations of Lifestyle Medicine – the Lifestyle Medicine Board Review Course (LMBRC). The cost for the non-CME version (we only require the certificate of completion for people outside the USA) is $499, and it is available in English, Spanish, Korean, Chinese and Portuguese. You can find the LMBRC here:{" "}
                        <a href="https://www.lifestylemedicine.org/boardreview" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: lifestylemedicine.org/boardreview</a>
                    </li>
                    <li>
                        Gather your prerequisite 20h of CME (in-person or virtual) from an approved event in your region. Countries authorized to run IBLM exam hubs also are authorized to run eligible in-person events and conferences. For physicians and professionals licensed to practice in Thailand, we recommend “Lifestyle Medicine and Wellbeing International Conference Bangkok (LMW Bangkok 2025)” 20 h (in-person) approved event :{" "}
                        <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: tlwa.or.th</a>
                    </li>
                    <li>
                        Submit documentation of completion of your exam prerequisites 30 or more days before the exam date, using the instructions provided by TLWA, after you sign up for the exam. Please note: physicians must also complete and submit a case study, retrievable via{" "}
                        <a href="https://drive.google.com/drive/folders/1Dm8BW5WVgNJsegGQEUBaxzoxaNoaXrDy?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: Case Study Form</a>
                    </li>
                    <li>
                        Attendance of LMW Bangkok 2025 immediately preceding an exam is exempt from the above 30-day rule.
                    </li>
                    <li>
                        Consider registering as a member of Thai Lifestyle Medicine and Wellbeing Association (TLWA) to receive discounts on association’s activities and membership benefits.
                    </li>
                    <li>
                        Register to enroll for the IBLM exam: October 19, 2025, Bangkok, Thailand -{" "}
                        <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: tlwa.or.th</a>
                    </li>
                    <li>
                        <b>For the purpose of the IBLM’s Certification Pricing Matrix, Thailand is considered as a Tier 2 country. Fees are to be paid to TLWA if you are a Thai citizen and would like to become a TLWA member :</b>
                        <ul className="list-disc pl-6">
                            <li>TLWA lifelong membership fee of 1,750 Baht</li>
                            <li>IBLM exam registration fee –non-refundable ($99 for physicians; $49 for professionals)</li>
                            <li>IBLM examination certification fee with TLWA member rebate ($999 – $100 = $899 for physicians; $799- $79 = $ 720 for Professionals)</li>
                            <li>Production and shipment of the diplomate certificates ($30 per certificate)</li>
                        </ul>
                    </li>
                    <li>
                        For the purpose of the IBLM’s Certification Pricing Matrix, the following are considered as Tier 3 countries, e.g. Myanmar, Cambodia, Laos, Vietnam, Bhutan. Fees are to be paid to TLWA if you are a citizen of Tier 3 country as explained above and would like to become a TLWA member :
                        <ul className="list-disc pl-6">
                            <li>TLWA lifelong membership fee of 1,750 Baht</li>
                            <li>IBLM exam registration fee –non-refundable ($49 for physicians; $29 for professionals)</li>
                            <li>IBLM examination certification fee with TLWA member rebate ($699 – $70 = $629 for physicians; $499- $50 = $ 449 for Professionals)</li>
                            <li>Production and shipment of the diplomate certificates ($30 per certificate)</li>
                        </ul>
                    </li>
                </ol>
            </div>
            <div>
                For IBLM candidates, take the exam which consists of 150 for physicians/120 for professionals multiple choice questions of National Board of Medical Examiners (NBME) standard. The 2025 certification exam will be held on Sunday, October 19th , from 1:30 pm to 5:30 pm at Avani Ratchada Bangkok Hotel, Bangkok.
                Pass the exam which is graded “on the curve” based upon psychometric assessment after each exam. Exam results are available just before Christmas 2025.
                Congratulations! Based upon your professional category, you will now be a diplomate of the International Board of Lifestyle Medicine (DipIBLM).
                Consider signing up for the MOC pathway at the beginning of the following year in order to keep your certification current. You will receive an invitation to do so in early January of each year.
            </div>
            <div className="mt-4 text-lg text-red-700">
                “ CLOSE OF IBLM EXAMINATION REGISTRATION ON SEPTEMBER 30th 2025 ”
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
            <ol className="list-decimal pl-6">
                <li>
                    เรียนจากหลักสูตร CME ที่ได้รับอนุมัติจาก IBLM ครบจำนวน 30 ชั่วโมง หลักสูตรที่แนะนำคือ “Foundations of Lifestyle Medicine – the Lifestyle Medicine Board Review Course (LMBRC)” ค่าใช้จ่ายสำหรับโปรแกรมที่ไม่ได้รับ CME คือ 499 ดอลลาร์ (IBLM ต้องการเพียงใบรับรองการจบหลักสูตรสำหรับผู้ที่อยู่นอกสหรัฐอเมริกา) หลักสูตร LMBRC ได้จัดทำไว้ในภาคภาษาอังกฤษ สเปน เกาหลี จีน และโปรตุเกส
                    เว็บไซด์สำหรับค้นหาและสมัครเข้าเรียนในหลักสูตร LMBRC สามารถเข้าดูได้ที่นี่:{" "}
                    <a href="https://www.lifestylemedicine.org/boardreview" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: lifestylemedicine.org/boardreview</a>
                </li>
                <li>
                    เข้าร่วมกิจกรรม CME ที่ได้รับอนุมัติ ครบจำนวน 20 ชั่วโมง (ออนไลน์หรือเข้าร่วมด้วยตัวเอง) จากกิจกรรมที่ได้รับอนุมัติภายในภูมิภาคของท่าน
                    สำหรับแพทย์และโปรเฟชชันนอลที่ได้รับใบอนุญาตประกอบวิชาชีพในประเทศไทย ขอแนะนำให้เข้าร่วมงาน “Lifestyle Medicine and Wellbeing International Conference Bangkok (LMW Bangkok 2025)” ที่ได้รับอนุมัติจาก IBLM แล้วให้ครบ 20 ชั่วโมงแบบที่เข้าร่วมด้วยตนเอง รายละเอียดเพิ่มเติมในเว็บไซด์{" "}
                    <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: tlwa.or.th</a>
                </li>
                <li>
                    ระยะเวลาการส่งหลักฐานตามข้อกำหนดของการสอบคือ อย่างน้อย 30 วันก่อนวันสอบ โดยให้ปฎิบัติตามคำแนะนำของ TLWA ภายหลังจากที่ได้สมัครสอบแล้ว โปรดทราบ: แพทย์จะต้องกรอกและส่งกรณีศึกษาหนึ่งกรณี ซึ่งสามารถใช้แบบฟอร์มสำหรับกรอกกรณีศึกษาได้จาก{" "}
                    <a href="https://drive.google.com/drive/folders/1Dm8BW5WVgNJsegGQEUBaxzoxaNoaXrDy?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: แบบฟอร์มกรณีศึกษา</a>
                </li>
                <li>
                    การเข้าร่วม LMW Bangkok 2025 ก่อนการสอบ จะได้รับการยกเว้นจากกฎ 30 วันดังที่กล่าวข้างต้น
                </li>
                <li>
                    พิจารณาลงทะเบียนเป็นสมาชิกสมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย (TLWA) เพื่อรับส่วนลดในการร่วมกิจกรรมต่างๆของสมาคมและสิทธิประโยชน์ในฐานะสมาชิก
                </li>
                <li>
                    ลงทะเบียนสอบ IBLM  ซึ่งมีกำหนดจัดขึ้นในวันที่ 19 ตุลาคม 2568 เวลา 13.30 – 17.30 น. ณ โรงแรม Avani Ratchada Bangkok กรุงเทพมหานคร ประเทศไทย อ่านข้อมูลเพิ่มเติมได้ในเว็บไซด์{" "}
                    <a href="https://www.tlwa.or.th" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 font-medium">Link: tlwa.or.th</a>
                </li>
                <li>
                    <b>สำหรับ Certification Pricing Matrix ของ IBLM ประเทศไทยถือเป็นประเทศระดับ Tier 2 ผู้สนใจสมัครสอบซึ่งเป็นชาวไทย สามารถพิจารณาค่าธรรมเนียมที่จะต้องชำระให้กับสมาคม TLWA ดังต่อไปนี้ :</b>
                    <ul className="list-disc pl-6">
                        <li>ค่าลงทะเบียนสมาชิกสมาคม TLWA ตลอดชีพ 1,750 บาท</li>
                        <li>ค่าธรรมเนียมการลงทะเบียนสอบ IBLM – $99 สำหรับแพทย์ และ $49 สำหรับโปรเฟชชันนอล (ไม่สามารถคืนเงินได้หากถอนตัวในภายหลัง)</li>
                        <li>ค่าธรรมเนียมการสอบ IBLM โดยสามารถหักส่วนลดหากเป็นสมาชิกสมาคม TLWA สำหรับแพทย์ 999 ดอลลาร์ – 100 ดอลลาร์ = 899 ดอลลาร์ สำหรับโปรเฟชชั่นนอล 799 ดอลลาร์ – 79 ดอลลาร์ = 720 ดอลลาร์</li>
                        <li>ค่าจัดส่งใบรับรอง 30 ดอลลาร์ ต่อ 1 ใบรับรอง</li>
                    </ul>
                </li>
                <li>
                    สำหรับ Certification Pricing Matrix ของ IBLM ประเทศดังต่อไปนี้ถือเป็นประเทศระดับ Tier 3 อาทิ เมียนมาร์ กัมพูชา สปป.ลาว เวียดนาม ภูฏาน ผู้สนใจสมัครสอบซึ่งเป็นพลเมืองของประเทศระดับ Tier 3 สามารถพิจารณาค่าธรรมเนียมที่จะต้องชำระให้กับสมาคม TLWA ดังรายละเอียดที่ปรากฎใน Section ภาคภาษาอังกฤษ (ด้านบน)
                </li>
            </ol>
            <div>
                การสอบ IBLM ในปี 2025 จะมีข้อสอบที่ประกอบด้วยคำถามแบบปรนัย สำหรับแพทย์ 150 ข้อ หรือสำหรับโปรเฟชชันนอล 120 ข้อ ซึ่งจัดทำขึ้นตามมาตรฐานของ National Board of Medical Examiners (NBME) การสอบ IBLM ปี 2025 ณ กรุงเทพมหานคร จะจัดขึ้นในวันอาทิตย์ที่ 19 ตุลาคม เวลา 13.30 น. ถึง 17.30 น.
                การให้เกรดผลสอบ จะพิจารณาจากเส้นโค้งของกราฟผลคะแนน (on the curve) โดยมีพื้นฐานจากการประเมินแบบ psychometric หลังการสอบแต่ละครั้งและจะประกาศผลสอบก่อนวันคริสต์มาสในปีค.ศ. 2025
                ท่านที่สอบผ่าน จะได้รับสถานะเป็น Diplomate ของ International Board of Lifestyle Medicine (DipIBLM)
                แนะนำให้พิจารณาเข้าร่วมแนวทางการต่ออายุการรับรอง (Maintenance of Certification Pathway – MOC pathway) ซึ่งท่านจะได้รับข้อมูลส่งถึงท่านในปีถัดไปหลังจากที่สอบเป็นผลสำเร็จแล้ว เพื่อรักษาสถานะการรับรองให้เป็นปัจจุบัน โดยท่านจะได้รับคำเชิญให้เข้าร่วม MOC ในช่วงต้นเดือนมกราคมของแต่ละปี
            </div>
            <div className="mt-4 font-semibold text-red-700">
                “ ปิดการลงทะเบียนสอบ IBLM วันที่ 30 กันยายน 2568 ”
            </div>
        </div>
    ),
};

export default function IBLM() {
    const [popup, setPopup] = useState(false);
    const [lang, setLang] = useState("en");
    const [showLine, setShowLine] = useState(false);

    return (
        <div className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 py-10 relative">

                {/* Main title */}
                <h1 className="text-pink-400 font-semibold text-xl mb-2">IBLM</h1>
                <h2 className="text-6xl font-bold mb-12 max-w-xl">
                    Become Certified in Lifestyle Medicine Practice
                </h2>
                <p className="text-gray-400 font-semibold text-lg max-w-8xl">
                    Whether you’re a physician or a health professional, the path to becoming an IBLM Diplomate starts here. With accredited courses, hands-on conferences, and a supportive professional community, you can advance your expertise in lifestyle medicine, earn international recognition, and make a lasting impact on health and wellness in Thailand and beyond.
                </p>

                {/* Read More button */}
                <button
                    onClick={() => setPopup(true)}
                    className="cursor-pointer mt-10 bg-indigo-500 text-white font-semibold w-32 h-12 rounded-xl shadow-lg
            hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                    Read More
                </button>

                {/* PDF & Line icons */}
                <div className="flex items-center gap-6 mt-8">
                    {/* PDF */}
                    <a
                        href={PDF_FILES[lang]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
                        title="Open PDF"
                    >
                        <FiFileText className="text-3xl" />
                        <span className="font-medium text-base underline">IBLM Guide PDF</span>
                    </a>
                    {/* Line */}
                    <button
                        onClick={() => setShowLine(true)}
                        className="cursor-pointer flex items-center gap-2 text-green-600 hover:text-green-800 transition"
                        title="Add LINE Official"
                    >
                        <FiMessageCircle className="text-3xl" />
                        <span className="font-medium text-base underline">Add LINE Official</span>
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
                            onClick={e => e.stopPropagation()}
                            style={{ color: "#222" }}
                        >
                            {/* Language Switcher */}
                            <PillLang lang={lang} setLang={setLang} />
                            {/* Full content */}
                            <div>{IBLM_CONTENT[lang]}</div>
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
                        <div
                            className="relative bg-white w-[360px] max-w-[95vw] rounded-2xl shadow-2xl px-8 py-7 animate-fadeIn"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-lg font-semibold text-center mb-3 text-black">LINE Official Account</div>
                            <div className="text-center font-bold text-green-700 mb-3">{LINE_OFFICIAL_NAME}</div>
                            <div className="flex justify-center mb-1">
                                <div className="w-40 h-40 bg-gray-100 flex items-center justify-center rounded-lg shadow-inner border border-gray-200 overflow-hidden">
                                    {/* QR Code (tag img) */}
                                    <img src={LINE_QR_URL} alt="QR Code" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            {/* Link Line Official */}
                            <div className="flex justify-center mt-3">
                                <a
                                    href={LINE_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-600 font-semibold text-base hover:text-blue-800"
                                >
                                    Click Link Line Official
                                </a>
                            </div>
                            <div className="text-center text-sm text-gray-600 mt-2">Scan this QR code to add our official LINE account.</div>
                        </div>
                    </div>
                )}
                {/* Overlay Hover Style */}
                <style>{`
                .animate-fadeIn { animation: fadeIn .35s; }
                @keyframes fadeIn {
                from { opacity: 0; transform: scale(.96);}
                to { opacity: 1; transform: scale(1);}
                }
                .underline.text-blue-600 { color: #2563eb !important; }
                `}</style>
            </div>
        </div>
    );
}
