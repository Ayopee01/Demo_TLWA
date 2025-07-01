const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

// 🔹 Sample User Data
const users = [
  {
    id: 1,
    name: "Capt.(Ret.) Yongyuth Mayalarp, M.D.",
    title: "President",
    image: "https://example.com/image1.jpg",
    bio: "ประวัติผู้บริหาร..."
  },
  {
    id: 2,
    name: "Asst. Prof. Patana Teng-umnuay, M.D., Ph.D",
    title: "Vice - President",
    image: "https://example.com/image2.jpg",
    bio: "รองประธานฯ และนักวิชาการ..."
  },
    {
    id: 3,
    name: "Asst. Prof. Patana Teng-umnuay, M.D., Ph.D",
    title: "Vice - President",
    image: "https://example.com/image2.jpg",
    bio: "รองประธานฯ และนักวิชาการ..."
  },
    {
    id: 4,
    name: "Asst. Prof. Patana Teng-umnuay, M.D., Ph.D",
    title: "Vice - President",
    image: "https://example.com/image2.jpg",
    bio: "รองประธานฯ และนักวิชาการ..."
  },
    {
    id: 5,
    name: "Asst. Prof. Patana Teng-umnuay, M.D., Ph.D",
    title: "Vice - President",
    image: "https://example.com/image2.jpg",
    bio: "รองประธานฯ และนักวิชาการ..."
  },
    {
    id: 6,
    name: "Asst. Prof. Patana Teng-umnuay, M.D., Ph.D",
    title: "Vice - President",
    image: "https://example.com/image2.jpg",
    bio: "รองประธานฯ และนักวิชาการ..."
  }
];

// 🔹 Routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).json({ message: 'User not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
