import React, { useState, useRef, useEffect } from 'react'

// Import logo1
import logo1 from '../assets/partners/logo1/1.webp'
import logo2 from '../assets/partners/logo1/2.webp'
import logo3 from '../assets/partners/logo1/3.webp'
import logo4 from '../assets/partners/logo1/4.webp'
import logo5 from '../assets/partners/logo1/5.webp'
import logo6 from '../assets/partners/logo1/6.webp'
import logo7 from '../assets/partners/logo1/7.webp'
import logo8 from '../assets/partners/logo1/8.webp'
import logo9 from '../assets/partners/logo1/9.webp'
import logo10 from '../assets/partners/logo1/10.webp'
import logo11 from '../assets/partners/logo1/11.webp'
import logo12 from '../assets/partners/logo1/12.webp'
import logo13 from '../assets/partners/logo1/13.webp'
import logo14 from '../assets/partners/logo1/14.webp'
import logo15 from '../assets/partners/logo1/15.webp'
import logo16 from '../assets/partners/logo1/16.webp'
import logo17 from '../assets/partners/logo1/17.webp'
import logo18 from '../assets/partners/logo1/18.webp'
import logo19 from '../assets/partners/logo1/19.webp'
import logo20 from '../assets/partners/logo1/20.webp'
import logo21 from '../assets/partners/logo1/21.webp'
import logo22 from '../assets/partners/logo1/22.webp'
import logo23 from '../assets/partners/logo1/23.webp'
import logo24 from '../assets/partners/logo1/24.webp'
import logo25 from '../assets/partners/logo1/25.webp'
import logo26 from '../assets/partners/logo1/26.webp'
import logo27 from '../assets/partners/logo1/27.webp'
import logo28 from '../assets/partners/logo1/28.webp'
import logo29 from '../assets/partners/logo1/29.webp'
import logo30 from '../assets/partners/logo1/30.webp'

// Import logo2
import logo2_1 from '../assets/partners/logo2/1.สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย-TLWA.webp'
import logo2_2 from '../assets/partners/logo2/2.สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง.webp'
import logo2_3 from '../assets/partners/logo2/3.มหามกุฏราชวิทยาลัย.webp'
import logo2_4 from '../assets/partners/logo2/4.สถาบันวิจัยพุทธศาสตร์-มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย.webp'
import logo2_5 from '../assets/partners/logo2/5.สถาบันการขนส่ง-จุฬาลงกรณ์มหาวิทยาลัย.webp'
import logo2_6 from '../assets/partners/logo2/6.คณะครุศาสตร์-จุฬาลงกรณ์มหาวิทยาลัย.webp'
import logo2_7 from '../assets/partners/logo2/7.บัณฑิตวิทยาลัย-มหาลัยจุฬา.webp'
import logo2_8 from '../assets/partners/logo2/8.คณะวิทยาศาสตร์การกีฬา-มหาวิทยาลัยจุฬา.webp'
import logo2_9 from '../assets/partners/logo2/9.วิทยาลัยประชากรศาสตร์-จุฬาลงกรณ์มหาวิทยาลัย.webp'
import logo2_10 from '../assets/partners/logo2/10.คณะศิลปกรรมศาสตร์-จุฬาลงกรณ์มหาวิทยาลัย.webp'
import logo2_11 from '../assets/partners/logo2/11.คณะสหเวชศาสตร์-จุฬาลงกรณ์-มหาวิทยาลัย.webp'
import logo2_12 from '../assets/partners/logo2/12.เทคโนโลยีราชมงคลรัตนโกสินทร์.png'
import logo2_13 from '../assets/partners/logo2/13.มหาวิทยาลัยมหิดล-สถาบันแห่งชาติเพื่อการพัฒนาเด็กและครอบครัว.png'
import logo2_14 from '../assets/partners/logo2/14.มหาวิทยาลัยสงขลานครินทร์.webp'
import logo2_15 from '../assets/partners/logo2/15.กรมสนับสนุนบริการสุขภาพ-กระทรวงสาธารณสุข.webp'
import logo2_16 from '../assets/partners/logo2/16.กองทุนประชากรแห่งสหประชาชาติ.webp'
import logo2_17 from '../assets/partners/logo2/17.ทันตแพทยสภา.webp'
import logo2_18 from '../assets/partners/logo2/18.สภาเทคนิคการแพทย์.webp'
import logo2_19 from '../assets/partners/logo2/19.มหาวิทยาลัยเกษตรศาสตร์.webp'
import logo2_20 from '../assets/partners/logo2/20.มหาวิยยาลัยขอนแก่น.png'
import logo2_21 from '../assets/partners/logo2/21.มหาลัยเชียงใหม่.webp'
import logo2_22 from '../assets/partners/logo2/22.สถาบันบัณฑิตบริหารธุรกิจศศินทร์แห่งจุฬาลงกรณ์มหาวิทยาลัย.png'
import logo2_23 from '../assets/partners/logo2/23.วิทยาลัยแพทยศาสตร์นานาชาติจุฬาภรณ์-มหาวิทยาลัยธรรมศาสตร์.webp'
import logo2_24 from '../assets/partners/logo2/24.สหเวชศาสตร์-มหาวิทยาลัยบูรพา.webp'
import logo2_25 from '../assets/partners/logo2/25.สภาผู้ปกครองและครูแห่งประเทศไทย.webp'
import logo2_26 from '../assets/partners/logo2/26.สำนักงานบรรเทาทุกข์และประชานามัยพิทักษ์-สภากาชาดไทย.webp'
import logo2_27 from '../assets/partners/logo2/27.สถาบันการสร้างชาติ.webp'
import logo2_28 from '../assets/partners/logo2/28.มูลนิธิอนุสรณ์-หม่อมงามจิตต์-บุรฉัตร-ในพระราชูปถัม.webp'
import logo2_29 from '../assets/partners/logo2/29.มูลนิธิตะวันฉาย.png'
import logo2_30 from '../assets/partners/logo2/30.มูลนิธิธรรมดี.webp'
import logo2_31 from '../assets/partners/logo2/31.มูลนิธิสถาบันพลังจิตตานุภาพหลวงพ่อวิริยังค์-สิรินุธโร.webp'
import logo2_32 from '../assets/partners/logo2/32.มูลนิธิเสถียรธรรมสถาน.webp'
import logo2_33 from '../assets/partners/logo2/33.มูลนิธิหนึ่งน้ำใจ-ONE LOVE FOUNDATION.webp'
import logo2_34 from '../assets/partners/logo2/34.Spiritual-Health-Foundation.webp'
import logo2_35 from '../assets/partners/logo2/35.สมาพันธ์สมาคมสปาแอนด์เวลเนสไทย.webp'
import logo2_36 from '../assets/partners/logo2/36.สมาคมคณะกรรมการสถานศึกษา.webp'
import logo2_37 from '../assets/partners/logo2/37.สมาคมนักธุรกิจจีนโพ้นทะเล.webp'
import logo2_38 from '../assets/partners/logo2/38.สมาคมนิทราเวชศาสตร์-TASM.webp'
import logo2_39 from '../assets/partners/logo2/39.สมาคมพัฒนาประชากรและชุมชน.webp'
import logo2_40 from '../assets/partners/logo2/40.สมาคมเพศวิทยาคลินิกและเวชศาสตร์ทางเพศ.webp'
import logo2_41 from '../assets/partners/logo2/41.สมาคมโรคจากการการหลับแห่งประเทศไทย-png.webp'
import logo2_42 from '../assets/partners/logo2/42.สมาคมวัยหมดระดูแห่งประเทศไทย.webp'
import logo2_43 from '../assets/partners/logo2/43.สมาคมศิษย์เก่าศูนย์ฝึกอาชีพและพัฒนาสมรรถภาพคนตาบอด.webp'
import logo2_44 from '../assets/partners/logo2/44.สมาคมอนามัยเจริญพันธุ์-ไทย.webp'
import logo2_45 from '../assets/partners/logo2/45.กองทุนพัฒนาสื่อปลอดภัยและสร้างสรรค์.webp'
import logo2_46 from '../assets/partners/logo2/46.โรงพยาบาลปิยะเวท.webp'
import logo2_47 from '../assets/partners/logo2/47.โรงพยาบาลวิมุตเทพธารินทร์.webp'
import logo2_48 from '../assets/partners/logo2/48.สมิติเวช.webp'
import logo2_49 from '../assets/partners/logo2/49.บริษัท-บำรุงราษฎร์-เซอร์วิสเซส-จำกัด.webp'
import logo2_50 from '../assets/partners/logo2/50.บริษัท-ไอ.ซี.ซี.อินเตอร์เนชั่นแนล-จำกัด-มหาชน.webp'

// ✅ Import sister_logo
import sister1 from '../assets/partners/sister_logo/1.American college of lifestyle medicine.png'
import sister2 from '../assets/partners/sister_logo/2.webp'
import sister3 from '../assets/partners/sister_logo/3.webp'
import sister4 from '../assets/partners/sister_logo/4.webp'
import sister5 from '../assets/partners/sister_logo/5.webp'
import sister6 from '../assets/partners/sister_logo/6.webp'
import sister7 from '../assets/partners/sister_logo/7.webp'
import sister8 from '../assets/partners/sister_logo/8.webp'
import sister9 from '../assets/partners/sister_logo/9.webp'
import sister10 from '../assets/partners/sister_logo/10.webp'
import sister11 from '../assets/partners/sister_logo/11.webp'
import sister12 from '../assets/partners/sister_logo/12.webp'
import sister13 from '../assets/partners/sister_logo/13.webp'
import sister14 from '../assets/partners/sister_logo/14.webp'
import sister15 from '../assets/partners/sister_logo/15.webp'
import sister16 from '../assets/partners/sister_logo/16.webp'
import sister17 from '../assets/partners/sister_logo/17.webp'
import sister18 from '../assets/partners/sister_logo/18.webp'
import sister19 from '../assets/partners/sister_logo/19.webp'
import sister20 from '../assets/partners/sister_logo/20.webp'
import sister21 from '../assets/partners/sister_logo/21.webp'
import sister22 from '../assets/partners/sister_logo/22.webp'
import sister23 from '../assets/partners/sister_logo/23.webp'
import sister24 from '../assets/partners/sister_logo/24.webp'
import sister25 from '../assets/partners/sister_logo/25.webp'
import sister26 from '../assets/partners/sister_logo/26.webp'
import sister27 from '../assets/partners/sister_logo/27.webp'
import sister28 from '../assets/partners/sister_logo/28.webp'
import sister29 from '../assets/partners/sister_logo/29.webp'
import sister30 from '../assets/partners/sister_logo/30.webp'

const logos = [
  { name: 'Veganerie', logo: logo1, url: 'https://www.veganerie.co' },
  { name: 'Kiew-Kai-Ka', logo: logo2, url: 'https://www.kiewkaika.com' },
  { name: 'Kinokuniya', logo: logo3, url: 'https://thailand.kinokuniya.com' },
  { name: 'CHULA BOOK', logo: logo4, url: 'https://www.chulabook.com' },
  { name: 'Asia Books', logo: logo5, url: 'https://www.asiabooks.com' },
  { name: 'Family Med College', logo: logo6, url: '#' },
  { name: 'Paolo Hospital', logo: logo7, url: 'https://www.paolohospital.com' },
  { name: 'Phyathai Hospital', logo: logo8, url: 'https://www.phyathai.com' },
  { name: 'DPU', logo: logo9, url: 'https://www.dpu.ac.th' },
  { name: 'H.E.A.T.', logo: logo10, url: '#' },
  { name: 'LM Global Alliance', logo: logo11, url: 'https://lmglobalalliance.org' },
  { name: 'IBLM', logo: logo12, url: 'https://www.iblm.org' },
  { name: 'Chulabhorn Royal Academy', logo: logo13, url: '#' },
  { name: 'Department of Health', logo: logo14, url: 'https://www.anamai.moph.go.th' },
  { name: 'Chakri Naruebodindra Hospital', logo: logo15, url: '#' },
  { name: 'Mental Health Dept.', logo: logo16, url: 'https://www.dmh.go.th' },
  { name: 'Ophthalmology College', logo: logo17, url: '#' },
  { name: 'Preventive Medicine', logo: logo18, url: '#' },
  { name: 'Mahidol Public Health', logo: logo19, url: 'https://ph.mahidol.ac.th' },
  { name: 'NFI', logo: logo20, url: 'https://www.nfi.or.th' },
  { name: 'Diabetes Association', logo: logo21, url: '#' },
  { name: 'Physicians College', logo: logo22, url: '#' },
  { name: 'Family Physicians', logo: logo23, url: '#' },
  { name: 'Thai Traditional Medicine', logo: logo24, url: '#' },
  { name: 'Public Health Faculty', logo: logo25, url: 'https://ph.mahidol.ac.th' },
  { name: 'ArokaGO', logo: logo26, url: '#' },
  { name: 'Phramongkutklao Hospital', logo: logo27, url: '#' },
  { name: 'MedCMU', logo: logo28, url: 'https://www.med.cmu.ac.th' },
  { name: 'ThaiHealth', logo: logo29, url: 'https://www.thaihealth.or.th' },
  { name: 'Human Development Association', logo: logo30, url: '#' },
]

const logo2List = [
  { name: 'Extended Org 1', logo: logo2_1, url: '#' },
  { name: 'Extended Org 2', logo: logo2_2, url: '#' },
  { name: 'Extended Org 3', logo: logo2_3, url: '#' },
  { name: 'Extended Org 3', logo: logo2_4, url: '#' },
  { name: 'Extended Org 3', logo: logo2_5, url: '#' },
  { name: 'Extended Org 3', logo: logo2_6, url: '#' },
  { name: 'Extended Org 3', logo: logo2_7, url: '#' },
  { name: 'Extended Org 3', logo: logo2_8, url: '#' },
  { name: 'Extended Org 3', logo: logo2_9, url: '#' },
  { name: 'Extended Org 3', logo: logo2_10, url: '#' },
  { name: 'Extended Org 1', logo: logo2_11, url: '#' },
  { name: 'Extended Org 2', logo: logo2_12, url: '#' },
  { name: 'Extended Org 3', logo: logo2_13, url: '#' },
  { name: 'Extended Org 3', logo: logo2_14, url: '#' },
  { name: 'Extended Org 3', logo: logo2_15, url: '#' },
  { name: 'Extended Org 3', logo: logo2_16, url: '#' },
  { name: 'Extended Org 3', logo: logo2_17, url: '#' },
  { name: 'Extended Org 3', logo: logo2_18, url: '#' },
  { name: 'Extended Org 3', logo: logo2_19, url: '#' },
  { name: 'Extended Org 3', logo: logo2_20, url: '#' },
  { name: 'Extended Org 1', logo: logo2_21, url: '#' },
  { name: 'Extended Org 2', logo: logo2_22, url: '#' },
  { name: 'Extended Org 3', logo: logo2_23, url: '#' },
  { name: 'Extended Org 3', logo: logo2_24, url: '#' },
  { name: 'Extended Org 3', logo: logo2_25, url: '#' },
  { name: 'Extended Org 3', logo: logo2_26, url: '#' },
  { name: 'Extended Org 3', logo: logo2_27, url: '#' },
  { name: 'Extended Org 3', logo: logo2_28, url: '#' },
  { name: 'Extended Org 3', logo: logo2_29, url: '#' },
  { name: 'Extended Org 3', logo: logo2_30, url: '#' },
  { name: 'Extended Org 1', logo: logo2_31, url: '#' },
  { name: 'Extended Org 2', logo: logo2_32, url: '#' },
  { name: 'Extended Org 3', logo: logo2_33, url: '#' },
  { name: 'Extended Org 3', logo: logo2_34, url: '#' },
  { name: 'Extended Org 3', logo: logo2_35, url: '#' },
  { name: 'Extended Org 3', logo: logo2_36, url: '#' },
  { name: 'Extended Org 3', logo: logo2_37, url: '#' },
  { name: 'Extended Org 3', logo: logo2_38, url: '#' },
  { name: 'Extended Org 3', logo: logo2_39, url: '#' },
  { name: 'Extended Org 3', logo: logo2_40, url: '#' },
  { name: 'Extended Org 1', logo: logo2_41, url: '#' },
  { name: 'Extended Org 2', logo: logo2_42, url: '#' },
  { name: 'Extended Org 3', logo: logo2_43, url: '#' },
  { name: 'Extended Org 3', logo: logo2_44, url: '#' },
  { name: 'Extended Org 3', logo: logo2_45, url: '#' },
  { name: 'Extended Org 3', logo: logo2_46, url: '#' },
  { name: 'Extended Org 3', logo: logo2_47, url: '#' },
  { name: 'Extended Org 3', logo: logo2_48, url: '#' },
  { name: 'Extended Org 3', logo: logo2_49, url: '#' },
  { name: 'Extended Org 3', logo: logo2_50, url: '#' },
]

const sisterLogos = [
  { logo: sister1 },
  { logo: sister2 },
  { logo: sister3 },
  { logo: sister4 },
  { logo: sister5 },
  { logo: sister6 },
  { logo: sister7 },
  { logo: sister8 },
  { logo: sister9 },
  { logo: sister10 },
  { logo: sister11 },
  { logo: sister12 },
  { logo: sister13 },
  { logo: sister14 },
  { logo: sister15 },
  { logo: sister16 },
  { logo: sister17 },
  { logo: sister18 },
  { logo: sister19 },
  { logo: sister20 },
  { logo: sister21 },
  { logo: sister22 },
  { logo: sister23 },
  { logo: sister24 },
  { logo: sister25 },
  { logo: sister26 },
  { logo: sister27 },
  { logo: sister28 },
  { logo: sister29 },
  { logo: sister30 },
]

function Partners() {
  const [expanded, setExpanded] = useState(false)

  const firstRow = logos.slice(0, 5)
  const secondRow = logos.slice(5, 10)
  const remaining = logos.slice(10)

  return (
    <section id="partners" section className="bg-gradient-to-b from-blue-600 to-indigo-700 text-white py-20 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-pink-300 font-semibold text-xl mb-2">Partners</h3>
        <h2 className="text-4xl font-bold mb-4">Mutual understanding and joint goals……</h2>
        <p className="max-w-3xl mx-auto text-lg font-light">
          Our partners are a diverse group of industry leaders, innovative startups, and dedicated organizations
          committed to excellence and collaboration. Together, we drive forward-thinking solutions, share valuable
          insights, and achieve mutual success through shared goals and resources.
        </p>
      </div>

      {/* Logos preview */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-center items-center">
        {firstRow.map((partner, index) => (
          <a key={index} href={partner.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:scale-105 transition">
            <img src={partner.logo} alt={partner.name} className="h-20 w-auto object-contain mb-2" />
            <p className="text-sm text-white text-center">{partner.name}</p>
          </a>
        ))}

        {secondRow.map((partner, index) => (
          <a key={index} href={partner.url} target="_blank" rel="noopener noreferrer"
            className={`flex flex-col items-center hover:scale-105 transition ${!expanded ? 'blur-sm opacity-60 pointer-events-none' : ''}`}>
            <img src={partner.logo} alt={partner.name} className="h-20 w-auto object-contain mb-2" />
            <p className="text-sm text-white text-center">{partner.name}</p>
          </a>
        ))}

        {expanded && remaining.map((partner, index) => (
          <a key={index} href={partner.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:scale-105 transition">
            <img src={partner.logo} alt={partner.name} className="h-20 w-auto object-contain mb-2" />
            <p className="text-sm text-white text-center">{partner.name}</p>
          </a>
        ))}
      </div>

      {/* Extended logos */}
      {expanded && (
        <>
          <div className="text-center mt-24 mb-8">
            <h3 className="text-pink-300 font-semibold text-xl mb-2">Extended Partners</h3>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">More organizations joining our mission</h2>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-center items-center">
            {logo2List.map((partner, index) => (
              <a key={index} href={partner.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:scale-105 transition">
                <img src={partner.logo} alt={partner.name} className="h-20 w-auto object-contain mb-2" />
                <p className="text-sm text-white text-center">{partner.name}</p>
              </a>
            ))}
          </div>

          <div className="text-center mt-24 mb-8">
            <h3 className="text-pink-300 font-semibold text-xl mb-2">Sister Organizations</h3>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Strategic Collaborators</h2>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-center items-center">
            {sisterLogos.map((partner, index) => (
              <div key={index} className="flex flex-col items-center hover:scale-105 transition">
                <img src={partner.logo} alt={`Sister Logo ${index + 1}`} className="h-20 w-auto object-contain mb-2" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Read More Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer bg-pink-500 transition-all duration-300 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-full transition"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      </div>


    </section>
  )
}

export default Partners
