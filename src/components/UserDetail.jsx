import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// ✅ import images
import Doc1 from '../assets/about/doc/Doc1.webp';
import Doc2 from '../assets/about/doc/Doc2.webp';
import Doc3 from '../assets/about/doc/Doc3.webp';
import Doc4 from '../assets/about/doc/Doc4.webp';
import Doc5 from '../assets/about/doc/Doc5.webp';
import Doc6 from '../assets/about/doc/Doc6.webp';

// ✅ ข้อมูลทั้งหมด
const usersData = [
  {
    id: 1,
    name: 'Capt.(Ret.) Yongyuth Mayalarp, M.D.',
    title: 'President',
    bio: `Dr. Yongyuth graduated from the London Hospital Medical College with MBBS in 1983 and later obtained MSc Degree in Clinical Tropical Medicine from London School of Hygiene and Tropical Medicine. Once returned to Thailand, he worked as a physician at Pramongkutklao Military Hospital and later at Phyathai 2 International Hospital. He became a board certified physician of ABAARM (USA) in 2017 and obtained MSc Degree in Anti-Aging and Regenerative Medicine from Dhurakij Pundit University in 2021. He was certified with proficiency in Preventive Medicine, sub-specialties of Public Health and Lifestyle Medicine, by the Thai Medical Council, and as Lifestyle Medicine Physician by Korean College of Lifestyle Medicine in conjunction with International Board of Lifestyle Medicine. He was board certified in Nutritional Wellness by the American Naturopathic Certification Board and received Thammasat University's Sexual Medicine Diploma and Sex Therapist Certificate. Yongyuth is a media celebrity and received numerous awards for his contribution to the society, including twice presented with prestigious royally-bestowed Theptong Awards. He was twice appointed Government Spokesman in 2006 and 2014, and, until recently, Phyathai Nawamin Hospital’s Executive Director. He is Deputy Dean, Center of Integrative Medicine, Dhurakij Pundit University, and a narrator for Television Pool of Thailand’s live telecast of royal ceremonies. He is an elected committee member of the Thai Medical Council and practices preventive and lifestyle medicine.`,
    image: Doc1
  },
  {
    id: 2,
    name: 'Asst. Prof. Patana Teng-umnuay, M.D., Ph.D',
    title: 'Vice – President',
    bio: `Dr. Teng-umnuay received his medical degree with first class honors from Chulalongkorn University, Thailand in 1986 and also board certification in Internal Medicine and Nephrology in 1990 and 1992. Then, he went to study at the University of Florida in the field of Molecular Cell Biology where he earned his PhD degree in 1998. Dr. Teng-umnuay is one of the well-known lecturers about nutraceutical supplements, stem cell biology, and anti-aging medicine. He serves as an assistant professor of the Anti-aging and regenerative program of Dhurakij Pundit University. He also works as a consulting physician for S Medical Clinic and Phyathai 2 Hospital, Thailand. Currently, he is the CEO of Health Education & Academics Thailand (H.E.A.T.).`,
    image: Doc2
  },
  {
    id: 3,
    name: 'Kobkullaya Chuengprasertsri, M.D.',
    title: 'Vice – President',
    bio: `Kobkullaya is a medical doctor, founder and head of Phyathai 2 Hospital's Anti-Aging Center and former Miss Thailand first runner-up. As the youngest volunteer doctor at The Princess Mother’s Medical Volunteer Foundation, she also supports mobile health units in rural areas of Thailand, and in 2018 was given the foundation’s Best Volunteers Award.`,
    image: Doc3
  },
  {
    id: 4,
    name: 'Asst. Prof. Akkarach Bumrungpert, Ph.D.',
    title: 'Director',
    bio: `Dr. Akkarach Bumrungpert is an accomplished nutritionist specialized in Anti-Aging, sharing a Longevity Diet for Wellness. He received a Bachelor of Science with 1st Class Honors in Food and Nutrition from Mahidol University, as well as a Doctor of Philosophy degree in Nutrition with a major in Experimental Nutrition and Biochemistry from Ramathibodi Hospital and Institute of Nutrition. He is a Registered Dietitian with the Ministry of Public Health and has completed research fellowships at The Ohio State University and the University of North Carolina at Greensboro. With over 15 years of experience as an anti-aging nutrition specialist, Dr. Bumrungpert currently serves as the President of the Mahidol Nutrition Society and is an Assistant Professor in the Graduate Programs in Anti-Aging and Regenerative Medicine at Dhurakij Pundit University.`,
    image: Doc4
  },
  {
    id: 5,
    name: 'Assoc. Prof. Sarawut Thepanondh, Ph.D.',
    title: 'Director',
    bio: `Dr. Sarawut Thepanondh is an Associate Professor and the Faculty Dean at the Faculty of Public Health, Mahidol University. He received a Ph.D. in Atmospheric Science from Monash University, Australia. His research focuses on emission inventory and air pollution modeling. He has conducted extensive research on air pollution management and has supervised postgraduate students. He has published in international journals and serves as a technical advisor on air pollution for the Thai government and international organizations such as UNEP and the World Bank.`,
    image: Doc5
  },
  {
    id: 6,
    name: 'Smith Arayaskul, M.D.',
    title: 'Director',
    bio: `Dr. Smith Arayaskul is a highly accomplished dermatologist, anti-aging specialist, and Medical Director. He founded Smith Prive’ Aesthetique and works at Samitivej Sukhumvit Hospital. As founder and CEO of Smith Skincare, he combines medical and business knowledge. He is a Key Opinion Leader (KOL) and serves as president of Prime Health Pharmaceutical. He frequently lectures on dermatology and anti-aging at Thai universities and has served on the Public Relations Committee of the Dermatological Society of Thailand. He is also on the board of the Thai Cosmetic Dermatology and Aesthetic Surgery Society and is a founding committee member of the Thai Lifestyle Medicine Association.`,
    image: Doc6
  }
];

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const foundUser = usersData.find(u => u.id === parseInt(id));
    setUser(foundUser);
  }, [id]);

  if (!user) return <div className="text-center py-20 text-xl text-red-500">User not found</div>;

  return (
    <div className="bg-white min-h-screen text-gray-800 px-4 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Text */}
        <div className="flex-1 text-left">
          <h2 className="text-4xl font-bold mb-2">{user.name}</h2>
          <p className="text-indigo-600 font-semibold text-lg mb-2">{user.title}</p>
          <div className="h-1 w-24 bg-indigo-400 mb-4"></div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{user.bio}</p>

          <Link
            to="/Page_About"
            className="inline-block mt-8 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition"
          >
            ⬅ Back to Team
          </Link>
        </div>

        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src={user.image}
            alt={user.name}
            className="w-72 h-auto rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
