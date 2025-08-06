import React, { useState } from "react";
//import line
import line1 from "/src/assets/news/line-1.png";

// ===== 6 กรกฎาคม 2024 =====
import logo1_6_7_2024 from "/src/assets/partners/6_July_2024/1.png";
import logo2_6_7_2024 from "/src/assets/partners/6_July_2024/2.png";
import logo3_6_7_2024 from "/src/assets/partners/6_July_2024/3.jpg";
import logo4_6_7_2024 from "/src/assets/partners/6_July_2024/4.png";
import logo5_6_7_2024 from "/src/assets/partners/6_July_2024/5.png";
import logo6_6_7_2024 from "/src/assets/partners/6_July_2024/6.png";
import logo7_6_7_2024 from "/src/assets/partners/6_July_2024/7.jpg";
import logo8_6_7_2024 from "/src/assets/partners/6_July_2024/8.png";
import logo9_6_7_2024 from "/src/assets/partners/6_July_2024/9.png";
import logo10_6_7_2024 from "/src/assets/partners/6_July_2024/10.png";
import logo11_6_7_2024 from "/src/assets/partners/6_July_2024/11.png";
import logo12_6_7_2024 from "/src/assets/partners/6_July_2024/12.png";
import logo13_6_7_2024 from "/src/assets/partners/6_July_2024/13.png";
import logo14_6_7_2024 from "/src/assets/partners/6_July_2024/14.jpg";
import logo15_6_7_2024 from "/src/assets/partners/6_July_2024/15.png";
import logo16_6_7_2024 from "/src/assets/partners/6_July_2024/16.png";
import logo17_6_7_2024 from "/src/assets/partners/6_July_2024/17.jpg";
import logo18_6_7_2024 from "/src/assets/partners/6_July_2024/18.jpg";
import logo19_6_7_2024 from "/src/assets/partners/6_July_2024/19.jpg";
import logo20_6_7_2024 from "/src/assets/partners/6_July_2024/20.jpg";
import logo21_6_7_2024 from "/src/assets/partners/6_July_2024/21.png";
import logo22_6_7_2024 from "/src/assets/partners/6_July_2024/22.jpg";

// ===== 21 กุมภาพันธ์ 2025 =====
import logo1_21_2_2025 from "/src/assets/partners/21_February_2025/1.สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย TLWA.png";
import logo2_21_2_2025 from "/src/assets/partners/21_February_2025/2.สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง.png";
import logo3_21_2_2025 from "/src/assets/partners/21_February_2025/3.มหามกุฏราชวิทยาลัย.jpg";
import logo4_21_2_2025 from "/src/assets/partners/21_February_2025/4.สถาบันวิจัยพุทธศาสตร์ มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย.png";
import logo5_21_2_2025 from "/src/assets/partners/21_February_2025/5.สถาบันการขนส่ง จุฬาลงกรณ์มหาวิทยาลัย.png";
import logo6_21_2_2025 from "/src/assets/partners/21_February_2025/6.คณะครุศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย.jpg";
import logo7_21_2_2025 from "/src/assets/partners/21_February_2025/7.บัณฑิตวิทยาลัย มหาลัยจุฬา.png";
import logo8_21_2_2025 from "/src/assets/partners/21_February_2025/8.วิทยาลัยประชากรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย.png";
import logo9_21_2_2025 from "/src/assets/partners/21_February_2025/9.คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยจุฬา.jpg";
import logo10_21_2_2025 from "/src/assets/partners/21_February_2025/10.คณะศิลปกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย.jpg";
import logo11_21_2_2025 from "/src/assets/partners/21_February_2025/11.คณะสหเวชศาสตร์ จุฬาลงกรณ์ มหาวิทยาลัย.jpg";
import logo12_21_2_2025 from "/src/assets/partners/21_February_2025/12.เทคโนโลยีราชมงคลรัตนโกสินทร์.png";
import logo13_21_2_2025 from "/src/assets/partners/21_February_2025/13.มหาวิทยาลัยมหิดล สถาบันแห่งชาติเพื่อการพัฒนาเด็กและครอบครัว.jpg";
import logo14_21_2_2025 from "/src/assets/partners/21_February_2025/14.มหาวิทยาลัยสงขลานครินทร์.png";
import logo15_21_2_2025 from "/src/assets/partners/21_February_2025/15.กรมสนับสนุนบริการสุขภาพ กระทรวงสาธารณสุข.png";
import logo16_21_2_2025 from "/src/assets/partners/21_February_2025/16.กองทุนประชากรแห่งสหประชาชาติ.png";
import logo17_21_2_2025 from "/src/assets/partners/21_February_2025/17.ทันตแพทยสภา.png";
import logo18_21_2_2025 from "/src/assets/partners/21_February_2025/18.สภาเทคนิคการแพทย์.png";
import logo19_21_2_2025 from "/src/assets/partners/21_February_2025/19.มหาวิทยาลัยเกษตรศาสตร์ กลม.png";
import logo20_21_2_2025 from "/src/assets/partners/21_February_2025/20.มหาวิยยาลัยขอนแก่น.png";
import logo21_21_2_2025 from "/src/assets/partners/21_February_2025/21.มหาลัยเชียงใหม่ มอเชียงใหม่.png";
import logo22_21_2_2025 from "/src/assets/partners/21_February_2025/22.สถาบันบัณฑิตบริหารธุรกิจศศินทร์แห่งจุฬาลงกรณ์มหาวิทยาลัย.png";
import logo23_21_2_2025 from "/src/assets/partners/21_February_2025/23.วิทยาลัยแพทยศาสตร์นานาชาติจุฬาภรณ์ มหาวิทยาลัยธรรมศาสตร์.jpg";
import logo24_21_2_2025 from "/src/assets/partners/21_February_2025/24.สหเวชศาสตร์ มหาวิทยาลัยบูรพา.jpg";
import logo25_21_2_2025 from "/src/assets/partners/21_February_2025/25.สภาผู้ปกครองและครูแห่งประเทศไทย.JPG";
import logo26_21_2_2025 from "/src/assets/partners/21_February_2025/26.สำนักงานบรรเทาทุกข์และประชานามัยพิทักษ์ สภากาชาดไทย.png";
import logo27_21_2_2025 from "/src/assets/partners/21_February_2025/27.สถาบันการสร้างชาติ.png";
import logo28_21_2_2025 from "/src/assets/partners/21_February_2025/28.มูลนิธิอนุสรณ์ หม่อมงามจิตต์ บุรฉัตร ในพระราชูปถัม.png";
import logo29_21_2_2025 from "/src/assets/partners/21_February_2025/29.มูลนิธิตะวันฉาย.png";
import logo30_21_2_2025 from "/src/assets/partners/21_February_2025/30.มูลนิธิธรรมดี PNG.png";
import logo31_21_2_2025 from "/src/assets/partners/21_February_2025/31.มูลนิธิสถาบันพลังจิตตานุภาพหลวงพ่อวิริยังค์ สิรินุธโร.png";
import logo32_21_2_2025 from "/src/assets/partners/21_February_2025/32.มูลนิธิเสถียรธรรมสถาน.jpg";
import logo33_21_2_2025 from "/src/assets/partners/21_February_2025/33.One love.jpg";
import logo34_21_2_2025 from "/src/assets/partners/21_February_2025/34.Spiritual Health Foundation.jpg";
import logo35_21_2_2025 from "/src/assets/partners/21_February_2025/35.สมาพันธ์สมาคมสปาแอนด์เวลเนสไทย.jpg";
import logo36_21_2_2025 from "/src/assets/partners/21_February_2025/36.สมาคมคณะกรรมการสถานศึกษา.jpg";
import logo37_21_2_2025 from "/src/assets/partners/21_February_2025/37.สมาคมนักธุรกิจจีนโพ้นทะเล.jpg";
import logo38_21_2_2025 from "/src/assets/partners/21_February_2025/38.สมาคมนิทราเวชศาสตร์ TASM.png";
import logo39_21_2_2025 from "/src/assets/partners/21_February_2025/39.สมาคมพัฒนาประชากรและชุมชน.jpg";
import logo40_21_2_2025 from "/src/assets/partners/21_February_2025/40.สมาคมเพศวิทยาคลินิกและเวชศาสตร์ทางเพศ.jpg";
import logo41_21_2_2025 from "/src/assets/partners/21_February_2025/41.สมาคมโรคจากการการหลับแห่งประเทศไทย png.png";
import logo42_21_2_2025 from "/src/assets/partners/21_February_2025/42.สมาคมวัยหมดระดูแห่งประเทศไทย.jpg";
import logo43_21_2_2025 from "/src/assets/partners/21_February_2025/43.สมาคมศิษย์เก่าศูนย์ฝึกอาชีพและพัฒนาสมรรถภาพคนตาบอด.jpg";
import logo44_21_2_2025 from "/src/assets/partners/21_February_2025/44.สมาคมอนามัยเจริญพันธุ์ (ไทย).jpg";
import logo45_21_2_2025 from "/src/assets/partners/21_February_2025/45.กองทุนพัฒนาสื่อปลอดภัยและสร้างสรรค์.jpg";
import logo46_21_2_2025 from "/src/assets/partners/21_February_2025/46.โรงพยาบาลปิยะเวท.jpg";
import logo47_21_2_2025 from "/src/assets/partners/21_February_2025/47.โรงพยาบาลวิมุตเทพธารินทร์ Jpg (Thai).jpg";
import logo48_21_2_2025 from "/src/assets/partners/21_February_2025/48.สมิติเวช.jpg";

import logo49_21_2_2025 from "/src/assets/partners/21_February_2025/49.บริษัท_บำรุงราษฎร์_เซอร์วิสเซส_จำกัด.jpg";
import logo50_21_2_2025 from "/src/assets/partners/21_February_2025/50.บริษัท ไอ.ซี.ซี.อินเตอร์เนชั่นแนล จำกัด (มหาชน).jpg";

// ===== 6 มิถุนายน 2025 : Oxford Mindfulness =====
import logo1_6_June_2025_Oxford from "/src/assets/partners/6_June_2025_Oxford/1.Oxford_Mindfulness_logo.png";
import logo2_6_June_2025_Oxford from "/src/assets/partners/6_June_2025_Oxford/2.สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย TLWA.png";

// ===== 6 มิถุนายน 2025 =====
import logo1_6_June_2025 from "/src/assets/partners/6_June_2025/1.สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย TLWA.png";
import logo2_6_June_2025 from "/src/assets/partners/6_June_2025/2.UDDC LOGO.png";
import logo3_6_June_2025 from "/src/assets/partners/6_June_2025/3.File LOGO TWA(1).jpg";
import logo4_6_June_2025 from "/src/assets/partners/6_June_2025/4.Green Standard black.png";
import logo5_6_June_2025 from "/src/assets/partners/6_June_2025/5.586506.jpg";
import logo6_6_June_2025 from "/src/assets/partners/6_June_2025/6.PCA_LOGO.png";

// ====== GROUPS Array ======
const GROUPS = [
  {
    title: "6 July 2024",
    boxes: [
      [logo1_6_7_2024, logo2_6_7_2024, logo3_6_7_2024, logo4_6_7_2024, logo5_6_7_2024, logo6_6_7_2024, logo7_6_7_2024],
      [logo8_6_7_2024, logo9_6_7_2024, logo10_6_7_2024, logo11_6_7_2024, logo12_6_7_2024, logo13_6_7_2024, logo14_6_7_2024, logo15_6_7_2024],
      [logo16_6_7_2024, logo17_6_7_2024, logo18_6_7_2024, logo19_6_7_2024, logo20_6_7_2024, logo21_6_7_2024, logo22_6_7_2024],
    ],
  },
  {
    title: "21 February 2025",
    boxes: [
      [logo1_21_2_2025, logo2_21_2_2025, logo3_21_2_2025, logo4_21_2_2025, logo5_21_2_2025],
      [logo6_21_2_2025, logo7_21_2_2025, logo8_21_2_2025, logo9_21_2_2025],
      [logo10_21_2_2025, logo11_21_2_2025, logo12_21_2_2025, logo13_21_2_2025, logo14_21_2_2025],
      [logo15_21_2_2025, logo16_21_2_2025, logo17_21_2_2025, logo18_21_2_2025, logo19_21_2_2025],
      [logo20_21_2_2025, logo21_21_2_2025, logo22_21_2_2025, logo23_21_2_2025, logo24_21_2_2025],
      [logo25_21_2_2025, logo26_21_2_2025, logo27_21_2_2025, logo28_21_2_2025, logo29_21_2_2025],
      [logo30_21_2_2025, logo31_21_2_2025, logo32_21_2_2025, logo33_21_2_2025, logo34_21_2_2025],
      [logo35_21_2_2025, logo36_21_2_2025, logo37_21_2_2025, logo38_21_2_2025, logo39_21_2_2025],
      [logo40_21_2_2025, logo41_21_2_2025, logo42_21_2_2025, logo43_21_2_2025, logo44_21_2_2025, logo45_21_2_2025],
      [logo46_21_2_2025, logo47_21_2_2025, logo48_21_2_2025, logo49_21_2_2025, logo50_21_2_2025],
    ],
  },
  // *** สองกล่องสุดท้ายจะเป็น custom layout ไม่ต้องรวมใน GROUPS ***
];

// ===== 6 มิถุนายน 2025 : Oxford Mindfulness =====
const GROUP_OXFORD = {
  title: "6 June 2025 : Oxford Mindfulness",
  boxes: [
    [logo1_6_June_2025_Oxford, logo2_6_June_2025_Oxford],
  ],
  // สำหรับจัด layout (ฝั่งซ้าย)
  customClass: "max-w-[400px] w-full min-w-[300px]",
};

// ===== 6 มิถุนายน 2025 =====
const GROUP_JUNE = {
  title: "6 June 2025",
  boxes: [
    [
      logo1_6_June_2025,
      logo2_6_June_2025,
      logo3_6_June_2025,
      logo4_6_June_2025,
      logo5_6_June_2025,
      logo6_6_June_2025,
    ],
  ],
  // สำหรับจัด layout (ฝั่งขวา)
  customClass: "flex-1 min-w-[380px]",
};

export default function Partners() {
  const [showAll, setShowAll] = useState(false);

  // เฉพาะ 6 July 2024
  const mainGroups = [GROUPS[0]];
  // ทั้งหมด (รวม custom 2 กล่องสุดท้าย)
  const allGroups = [...GROUPS, "CUSTOM_JUNE"]; // ใช้ string เป็น flag เฉย ๆ

  return (
    <section id="partners" className="relative bg-white text-gray-900 py-10 px-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-pink-300 opacity-30 rounded-full z-0 -translate-x-2/5 -translate-y-2/5"></div>
      <img className="absolute right-0" src={line1} alt="" />

      {/* Header */}
      <div className="max-w-6xl mx-auto relative pt-12">
        <div className="flex flex-col text-start mb-16">
          <h3 className="text-pink-400 font-semibold text-xl mb-2">Partners</h3>
          <h2 className="text-6xl font-bold mb-12 max-w-sm">Mutual understanding and joint goals……</h2>
          <p className="text-gray-800 font-semibold text-lg max-w-6xl">
            Our partners are a diverse group of industry leaders, innovative startups, and dedicated organizations
            committed to excellence and collaboration. Together, we drive forward-thinking solutions, share valuable
            insights, and achieve mutual success through shared goals and resources.
          </p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          {/* --- แสดงเฉพาะกลุ่มที่ต้องการ --- */}
          {(showAll ? GROUPS : mainGroups).map((group, groupIdx) => (
            <div
              key={group.title}
              className="relative rounded-2xl border-[3px] border-sky-300 bg-white py-6 px-1 md:px-8"
              style={{
                boxShadow: "0 2px 16px 0 rgba(80,173,255,0.12)",
              }}
            >
              <div className="absolute left-0 top-0 w-full flex justify-center -translate-y-1/2">
                <div className="bg-white px-6">
                  <h2 className="text-xl md:text-2xl font-bold text-black text-center tracking-tight">
                    {group.title}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col gap-6 pt-8">
                {group.boxes.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex flex-row justify-center items-center gap-4 md:gap-8"
                  >
                    {row.map((logo, idx) => (
                      <div
                        key={idx}
                        className="bg-transparent flex items-center justify-center"
                        style={{
                          padding: "10px",
                          minWidth: 64,
                          minHeight: 64,
                          maxWidth: 120,
                          maxHeight: 100,
                        }}
                      >
                        <img
                          src={logo}
                          alt=""
                          className="object-contain w-full h-16 md:h-20 max-h-24"
                          style={{
                            margin: "auto",
                            background: "none",
                            boxShadow: "none",
                          }}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* --- 2 กล่องสุดท้าย แสดงเฉพาะตอน showAll --- */}
          {showAll && (
            <div className="flex flex-row gap-2 w-full justify-center items-stretch mt-2">
              {/* --- ซ้าย: Oxford Mindfulness --- */}
              <div
                className={`${GROUP_OXFORD.customClass} rounded-2xl border-[3px] border-sky-300 bg-white flex flex-col justify-center items-center py-6 px-3 relative`}
                style={{
                  boxShadow: "0 2px 16px 0 rgba(80,173,255,0.12)",
                  alignSelf: "stretch",
                }}
              >
                <div className="absolute left-0 top-0 w-full flex justify-center -translate-y-1/2">
                  <div className="bg-white px-4">
                    <span className="text-base md:text-lg font-bold text-black tracking-tight">
                      {GROUP_OXFORD.title}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center pt-8 w-full">
                  {/* โลโก้อันที่ 1 */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      padding: "10px",
                      minWidth: 64,
                      minHeight: 64,
                      maxWidth: 120,
                      maxHeight: 100,
                    }}
                  >
                    <img
                      src={GROUP_OXFORD.boxes[0][0]}
                      alt=""
                      className="object-contain w-full h-16 md:h-20 max-h-24"
                      style={{ margin: "auto", background: "none", boxShadow: "none" }}
                      loading="lazy"
                    />
                  </div>

                  {/* เส้นคั่นแนวตั้ง */}
                  <div className="mx-6 h-14 md:h-20 border-l-2 border-gray-400" />

                  {/* โลโก้อันที่ 2 */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      padding: "10px",
                      minWidth: 64,
                      minHeight: 64,
                      maxWidth: 120,
                      maxHeight: 100,
                    }}
                  >
                    <img
                      src={GROUP_OXFORD.boxes[0][1]}
                      alt=""
                      className="object-contain w-full h-16 md:h-20 max-h-24"
                      style={{ margin: "auto", background: "none", boxShadow: "none" }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* --- ขวา: 6 June 2025 --- */}
              <div
                className={`${GROUP_JUNE.customClass} rounded-2xl border-[3px] border-sky-300 bg-white flex flex-col justify-center items-center py-6 px-3 relative`}
                style={{
                  boxShadow: "0 2px 16px 0 rgba(80,173,255,0.12)",
                  alignSelf: "stretch",
                }}
              >
                <div className="absolute left-0 top-0 w-full flex justify-center -translate-y-1/2">
                  <div className="bg-white px-4">
                    <span className="text-base md:text-lg font-bold text-black tracking-tight">
                      {GROUP_JUNE.title}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2 pt-8 justify-center items-center w-full">
                  {GROUP_JUNE.boxes[0].map((logo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center"
                      style={{
                        padding: "10px",
                        minWidth: 64,
                        minHeight: 64,
                        maxWidth: 120,
                        maxHeight: 100,
                      }}
                    >
                      <img
                        src={logo}
                        alt=""
                        className="object-contain w-full h-16 md:h-20 max-h-24"
                        style={{ margin: "auto", background: "none", boxShadow: "none" }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setShowAll((val) => !val)}
              className="cursor-pointer bg-indigo-500 text-white font-semibold w-32 h-12 rounded-xl shadow-lg
            hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}