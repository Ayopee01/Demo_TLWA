import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import images
import Doc1 from '../assets/about/doc/Doc1.webp'
import Doc2 from '../assets/about/doc/Doc2.webp'
import Doc3 from '../assets/about/doc/Doc3.webp'
import Doc4 from '../assets/about/doc/Doc4.webp'
import Doc5 from '../assets/about/doc/Doc5.webp'
import Doc6 from '../assets/about/doc/Doc6.webp'

function TeamList() {
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
    <section className="bg-gray-900 text-white py-16 px-4">
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
    </section>
  );
}

export default TeamList;
