const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the sibling 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const iceCreamMenu = [
  { 
    id: 1, 
    name: "Royal Rajbhog Deluxe", 
    category: "desi specials", 
    price: 180, 
    badge: "BESTSELLER", 
    badgeColor: "#3b82f6", 
    image: "images/royal-rajbhog.jpg", 
    description: "Saffron, almonds & rich cottage cheese dumplings.", 
    rating: 4.9, 
    reviews: 8 
  },
  { 
    id: 2, 
    name: "Alphonso Mango Mastani", 
    category: "classics seasonal delights", 
    price: 160, 
    badge: "TRENDING", 
    badgeColor: "#ef4444", 
    image: "images/mango-scoop.jpg", 
    description: "Pure Ratnagiri Alphonso mango pulp & thick cream.", 
    rating: 4.8, 
    reviews: 12 
  },
  { 
    id: 3, 
    name: "Shahi Meetha Paan Magic", 
    category: "desi specials", 
    price: 140, 
    badge: "POPULAR", 
    badgeColor: "#8b5cf6", 
    image: "images/meetha-paan.jpg", 
    description: "Banarasi paan leaves with gulkand syrup.", 
    rating: 4.7, 
    reviews: 0 
  },
  { 
    id: 4, 
    name: "Zafrani Pista Kulfi Scoop", 
    category: "classics", 
    price: 170, 
    badge: "CHEF'S PICK", 
    badgeColor: "#6b7280", 
    image: "images/pistachio-scoop.jpg", 
    description: "Infused with Kashmiri saffron strands and roasted pistachios.", 
    rating: 4.9, 
    reviews: 15 
  },
  { 
    id: 5, 
    name: "Gulab Jamun Fusion Sundae", 
    category: "fusion sundaes", 
    price: 195, 
    badge: "ROYAL SPECIAL", 
    badgeColor: "#dc2626", 
    image: "images/gulab-jamun.jpg", 
    description: "Warm gulab jamuns topped with velvet cardamom ice cream.", 
    rating: 5.0, 
    reviews: 2 
  },
  { 
    id: 6, 
    name: "Anjeer Badam Delight", 
    category: "classics", 
    price: 165, 
    badge: "HEALTHY CHOICE", 
    badgeColor: "#f59e0b", 
    image: "images/matka-kulfi.jpg", 
    description: "Real dried figs blended with crunchy California almonds.", 
    rating: 4.6, 
    reviews: 9 
  },
  { 
    id: 7, 
    name: "Tender Coconut Bliss", 
    category: "seasonal delights", 
    price: 150, 
    badge: "SEASONAL", 
    badgeColor: "#db2777", 
    image: "images/tender-coconut.jpg", 
    description: "Crafted with fresh pieces from soft tender coconuts.", 
    rating: 4.8, 
    reviews: 0 
  },
  { 
    id: 8, 
    name: "Paan Gulkand Royal Scoop", 
    category: "desi specials", 
    price: 155, 
    badge: "MUST TRY", 
    badgeColor: "#b91c1c", 
    image: "images/gulkand-paan-scoop.jpg", 
    description: "Organic rose petal preserve, mint & crushed betel leaf.", 
    rating: 4.9, 
    reviews: 9 
  }
];

// API Route
app.get('/api/menu', (req, res) => {
  res.json(iceCreamMenu);
});

// Serve frontend index.html on root route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});