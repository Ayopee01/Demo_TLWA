//รอแก้ให้ข้อมูลเป็น API และสร้าง DocDetail.jsx ขึ้นมาใช้ตาม ID
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import images
import Doc1 from '/src/assets/about/doc/Doc1.webp'
import Doc2 from '/src/assets/about/doc/Doc2.webp'
import Doc3 from '/src/assets/about/doc/Doc3.webp'
import Doc4 from '/src/assets/about/doc/Doc4.webp'
import Doc5 from '/src/assets/about/doc/Doc5.webp'
import Doc6 from '/src/assets/about/doc/Doc6.webp'

function About() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: 'Capt.(Ret.) Yongyuth Mayalarp, M.D.',
        title: 'President',
        image: Doc1,
        ring: true
      },
      {
        id: 2,
        name: 'Asst. Prof. Patana Teng-umnuay, M.D., Ph.D',
        title: 'Vice - President',
        image: Doc2,
        ring: true
      },
      {
        id: 3,
        name: 'Kobkullaya Chuengprasertsri, M.D.',
        title: 'Vice - President',
        image: Doc3,
        ring: true
      },
      {
        id: 4,
        name: 'Asst. Prof. Akkarach Bumrungpert, Ph.D.',
        title: 'Director',
        image: Doc4,
        ring: true
      },
      {
        id: 5,
        name: 'Assoc. Prof. Sarawut Thepanondh, Ph.D.',
        title: 'Director',
        image: Doc5,
        ring: true
      },
      {
        id: 6,
        name: 'Smith Arayaskul, M.D.',
        title: 'Director',
        image: Doc6,
        ring: true
      }
    ];

    setUsers(data);
  }, []);

  return (
    <section >
      <div className="bg-gray-900 text-gray-100 pt-35 pb-15 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-pink-400 text-lg font-semibold mb-2">Committee</h3>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Team TLWA</h2>
          <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed">
            The committee plays an important role in transparency, responsibility and effective decision making within the organization.
            By bringing together diverse perspectives and expertise, the committee will be able to generate innovative ideas, promote collaboration and drive positive change.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {users.map(user => (
            <Link to={`/Page_UserDetail/${user.id}`} key={user.id} className="flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4
                ${user.ring ? 'hover:border-8 hover:border-pink-400' : ''}`}>
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-indigo-300 mt-1">{user.title}</p>
            </Link>
          ))}
        </div>
      </div>
      {/* About */}
      <div className="px-6 md:px-20 pt-15 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-pink-600">About TLWA</h2>

          <div className="grid md:grid-cols-2 gap-10 text-lg leading-relaxed text-gray-900">
            {/* LEFT CONTENT */}
            <div>
              <p className="mb-6">
                As people in countries throughout the world are becoming increasingly interested in the modification of their lifestyle to strengthen their physical and mental health. This will lead to the long term disease prevention and treatment for chronic non-communicable diseases that result from unhealthy lifestyle.
              </p>
              <p className="mb-6">
                A group of medical doctors who are interested in this field of study and realize the importance of having doctors and medically related professionals gathering together in an organization that allows the gaining and sharing of knowledge, experience, understanding and best practices of this field of medicine among those interested individuals who live in the country and abroad.
              </p>
              <p className="mb-6">
                Such establishment will also serve to collaborate with other Thai and foreign institutions in developing the up-to-date knowledge and advanced techniques in practicing Lifestyle Medicine and promoting Wellbeing.
              </p>
              <p className="mb-6">
                Thai Lifestyle Medicine and Wellbeing Association or TLWA is therefore established by the group of medical doctors with the following objectives:
              </p>
            </div>

            {/* RIGHT CONTENT - OBJECTIVES */}
            <div>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Widely promote academic knowledge of and medical practice that employs the use of Lifestyle Medicine in accordance with academic principle.</li>
                <li>Promote the study and research on Lifestyle Medicine</li>
                <li>Promote continuous education of Lifestyle Medicine through collaboration with other institutions, both within and outside Thailand</li>
                <li>Support knowledge and experience sharing in the field of Lifestyle Medicine among the association members and members of other associations of similar or different interests, both within and outside Thailand</li>
                <li>Disseminate the knowledge and promote disease prevention with the use of Lifestyle Medicine to the general public</li>
                <li>Serve as an association that is not directly or indirectly involved in any political or gambling activity.</li>
              </ol>
              <p className="mt-6">
                The association is a not-for-profit organization and is governed by statutes and bylaws. TLWA resides in the house of medicine and is 100% evidence-based. It is a democratically-elected physician-led organization, financially transparent and inclusive. TLWA is neutral in terms of politics, religion, gender, race or nationality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}

export default About;
