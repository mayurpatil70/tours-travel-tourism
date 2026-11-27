/* ==========================================================
   Package catalogue — edit prices, dates & itineraries here.
   ========================================================== */
const WHATSAPP_NUMBER = "917017725248"; // +91 70177 25248

const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const PACKAGES = [
  {
    id: "kedarkantha",
    name: "Kedarkantha Winter Trek",
    category: "trek",
    region: "Uttarakhand",
    days: 6, nights: 5,
    altitude: "12,500 ft",
    difficulty: "Easy – Moderate",
    season: "Dec – Apr",
    price: 9500, oldPrice: 11500,
    rating: 4.9, reviews: 2140,
    badge: "Bestseller",
    img: U("1454496522488-7a8e488e8606"),
    hue: 210,
    dates: ["06 Dec", "13 Dec", "20 Dec", "27 Dec"],
    highlights: ["Summit sunrise over Swargarohini", "Snow-laden pine forests", "Juda ka Talab frozen lake", "Camping under starry skies"],
    itinerary: ["Dehradun → Sankri (7 hrs drive)", "Sankri → Juda ka Talab", "Juda ka Talab → Kedarkantha Base", "Summit push & descent to Hargaon", "Hargaon → Sankri", "Sankri → Dehradun"],
    includes: ["Stay in camps & homestays", "All veg meals on trek", "Certified trek leader", "Forest permits", "Safety gear & first aid"]
  },
  {
    id: "chardham",
    name: "Char Dham Yatra",
    category: "pilgrimage",
    region: "Yamunotri · Gangotri · Kedarnath · Badrinath",
    days: 10, nights: 9,
    altitude: "11,755 ft",
    difficulty: "Moderate",
    season: "May – Oct",
    price: 32999, oldPrice: 38999,
    rating: 4.9, reviews: 1860,
    badge: "Most Booked",
    img: U("1626621341517-bbf3d9990a23"),
    hue: 28,
    dates: ["Opens May 2027", "Group every Mon", "Private any date"],
    highlights: ["Darshan at all four Dhams", "VIP darshan assistance", "Ganga Aarti at Har Ki Pauri", "Helicopter upgrade available"],
    itinerary: ["Haridwar → Barkot", "Yamunotri Darshan", "Barkot → Uttarkashi", "Gangotri Darshan", "Uttarkashi → Guptkashi", "Kedarnath Darshan", "Kedarnath → Guptkashi", "Guptkashi → Badrinath", "Badrinath Darshan → Rudraprayag", "Rudraprayag → Haridwar"],
    includes: ["AC hotel stays", "Breakfast & dinner", "Private cab with driver", "Yatra registration help", "24×7 tour manager"]
  },
  {
    id: "kedarnath",
    name: "Do Dham — Kedarnath & Badrinath",
    category: "pilgrimage",
    region: "Uttarakhand",
    days: 6, nights: 5,
    altitude: "11,755 ft",
    difficulty: "Moderate",
    season: "May – Oct",
    price: 18999, oldPrice: 22500,
    rating: 4.8, reviews: 1210,
    badge: "Family Pick",
    img: U("1612438214708-f428a707dd4e"),
    hue: 18,
    dates: ["Every Fri", "Every Tue", "Private any date"],
    highlights: ["Kedarnath Jyotirlinga darshan", "Badri Vishal temple", "Mana — India's first village", "Devprayag Sangam stop"],
    itinerary: ["Haridwar → Guptkashi", "Gaurikund → Kedarnath trek", "Kedarnath → Guptkashi", "Guptkashi → Badrinath", "Badrinath & Mana village", "Badrinath → Haridwar"],
    includes: ["Hotel stays", "Breakfast & dinner", "Private cab", "Darshan assistance", "Doli / pony on request"]
  },
  {
    id: "valley-of-flowers",
    name: "Valley of Flowers & Hemkund",
    category: "trek",
    region: "Chamoli, Uttarakhand",
    days: 6, nights: 5,
    altitude: "14,100 ft",
    difficulty: "Moderate",
    season: "Jul – Sep",
    price: 12950, oldPrice: 14500,
    rating: 4.8, reviews: 980,
    badge: "UNESCO Site",
    img: U("1500534314209-a25ddb2bd429"),
    hue: 130,
    dates: ["05 Jul", "12 Jul", "19 Jul", "02 Aug"],
    highlights: ["500+ species of alpine flowers", "Sacred Hemkund Sahib lake", "Pushpawati river valley", "Ghangaria village stay"],
    itinerary: ["Rishikesh → Govindghat", "Govindghat → Ghangaria", "Valley of Flowers exploration", "Hemkund Sahib trek", "Ghangaria → Govindghat", "Govindghat → Rishikesh"],
    includes: ["Guest house stays", "All meals on trek", "Trek leader & guide", "Entry permits", "Transport ex-Rishikesh"]
  },
  {
    id: "hampta",
    name: "Hampta Pass Crossover",
    category: "trek",
    region: "Himachal Pradesh",
    days: 5, nights: 4,
    altitude: "14,065 ft",
    difficulty: "Moderate",
    season: "Jun – Oct",
    price: 10950, oldPrice: 12500,
    rating: 4.8, reviews: 1430,
    badge: "Dramatic Crossover",
    img: U("1464822759023-fed622ff2c3b"),
    hue: 260,
    dates: ["14 Jun", "21 Jun", "28 Jun", "05 Jul"],
    highlights: ["Green Kullu to barren Lahaul", "Chandratal lake visit", "River crossings", "Balu ka Ghera meadows"],
    itinerary: ["Manali → Jobra → Chika", "Chika → Balu ka Ghera", "Cross Hampta Pass → Shea Goru", "Shea Goru → Chatru → Chandratal", "Chandratal → Manali"],
    includes: ["Tents & sleeping bags", "All meals", "Trek leader", "Permits", "Manali pickup & drop"]
  },
  {
    id: "rishikesh",
    name: "Rishikesh Adventure Escape",
    category: "adventure",
    region: "Rishikesh, Uttarakhand",
    days: 3, nights: 2,
    altitude: "1,220 ft",
    difficulty: "Easy",
    season: "Year round",
    price: 5499, oldPrice: 6999,
    rating: 4.7, reviews: 760,
    badge: "Weekend",
    img: U("1590077428593-a55bb07c4665"),
    hue: 190,
    dates: ["Every weekend", "Custom dates"],
    highlights: ["16 km white water rafting", "Riverside luxury camp", "Bungee & giant swing add-on", "Triveni Ghat Ganga Aarti"],
    itinerary: ["Arrive Rishikesh, camp check-in & bonfire", "Rafting, cliff jump, cafes & aarti", "Yoga at sunrise, check out"],
    includes: ["Riverside camp stay", "All meals", "Rafting with guide", "Bonfire & music", "Yoga session"]
  },
  {
    id: "nainital",
    name: "Nainital · Mussoorie Hills",
    category: "family",
    region: "Kumaon & Garhwal",
    days: 5, nights: 4,
    altitude: "6,837 ft",
    difficulty: "Easy",
    season: "Year round",
    price: 14499, oldPrice: 16999,
    rating: 4.7, reviews: 640,
    badge: "Honeymoon",
    img: U("1506905925346-21bda4d32df4"),
    hue: 160,
    dates: ["Any date", "Private tour"],
    highlights: ["Boating on Naini lake", "Kempty Falls & Mall Road", "Snow View Point ropeway", "Candle-light dinner add-on"],
    itinerary: ["Delhi → Nainital", "Nainital lake & local sightseeing", "Nainital → Mussoorie", "Mussoorie sightseeing", "Mussoorie → Delhi"],
    includes: ["3★ / 4★ hotels", "Breakfast & dinner", "Private cab", "Sightseeing", "Honeymoon décor on request"]
  },
  {
    id: "brahmatal",
    name: "Brahmatal Lake Trek",
    category: "trek",
    region: "Uttarakhand",
    days: 6, nights: 5,
    altitude: "12,250 ft",
    difficulty: "Easy – Moderate",
    season: "Dec – Mar",
    price: 10450, oldPrice: 11950,
    rating: 4.8, reviews: 870,
    badge: "Snow Trek",
    img: U("1519681393784-d120267933ba"),
    hue: 230,
    dates: ["08 Dec", "15 Dec", "22 Dec", "05 Jan"],
    highlights: ["Views of Trishul & Nanda Ghunti", "Frozen Bekaltal & Brahmatal", "Ridge walks above clouds", "Snowy oak forests"],
    itinerary: ["Kathgodam → Lohajung", "Lohajung → Bekaltal", "Bekaltal → Tilandi", "Tilandi → Brahmatal top → Brahmatal", "Brahmatal → Lohajung", "Lohajung → Kathgodam"],
    includes: ["Camps & homestays", "All veg meals", "Trek leader", "Permits", "Micro-spikes & gaiters"]
  },
  {
    id: "spiti",
    name: "Spiti Valley Road Expedition",
    category: "adventure",
    region: "Himachal Pradesh",
    days: 8, nights: 7,
    altitude: "15,060 ft",
    difficulty: "Moderate",
    season: "Jun – Sep",
    price: 23999, oldPrice: 27999,
    rating: 4.9, reviews: 520,
    badge: "Road Trip",
    img: U("1626621340935-18f8ba7fda33"),
    hue: 35,
    dates: ["10 Jun", "24 Jun", "08 Jul", "22 Jul"],
    highlights: ["Key Monastery & Kibber", "Chandratal moon lake", "World's highest post office", "Stargazing at Langza"],
    itinerary: ["Shimla → Sangla", "Sangla → Kalpa", "Kalpa → Tabo", "Tabo → Kaza", "Kaza local: Key, Kibber, Hikkim", "Kaza → Chandratal", "Chandratal → Manali", "Manali departure"],
    includes: ["Homestays & hotels", "Breakfast & dinner", "Tempo Traveller", "Road captain", "Inner line permits"]
  }
];

const CATEGORIES = [
  { key: "all", label: "All Journeys", icon: "✦" },
  { key: "trek", label: "Himalayan Treks", icon: "⛰" },
  { key: "pilgrimage", label: "Yatra & Pilgrimage", icon: "🛕" },
  { key: "adventure", label: "Adventure", icon: "🛶" },
  { key: "family", label: "Family & Honeymoon", icon: "💞" }
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Bengaluru", trip: "Kedarkantha Winter Trek", text: "Our trek leader was a gem. Every camp was spotless and the summit sunrise made me cry. Already booked Brahmatal!", stars: 5 },
  { name: "Rajesh & Family", city: "Ahmedabad", trip: "Char Dham Yatra", text: "Travelling with my 70-year-old parents felt effortless. Darshan, hotels, pony — everything handled with so much care.", stars: 5 },
  { name: "Arjun Mehta", city: "Pune", trip: "Hampta Pass Crossover", text: "The crossover from green to desert is unreal. Food at 12,000 ft was better than my office canteen. 10/10.", stars: 5 },
  { name: "Sneha & Karan", city: "Delhi", trip: "Nainital · Mussoorie Hills", text: "Honeymoon décor, candle-light dinner, a driver who knew every viewpoint. Perfectly planned on WhatsApp in 10 minutes.", stars: 5 },
  { name: "Mohammed Irfan", city: "Hyderabad", trip: "Spiti Valley Expedition", text: "Road captain was ultra-professional. Stargazing at Langza is something I'll never forget.", stars: 5 }
];

const FAQS = [
  { q: "How do I book a package?", a: "Tap “Enquire” on any package. WhatsApp opens with the trip details already filled in. Our travel expert confirms dates, room options and the final quote within minutes." },
  { q: "Is it safe for first-time trekkers?", a: "Yes. Easy and Easy–Moderate treks like Kedarkantha and Brahmatal suit first-timers. Every batch has a certified trek leader, oximeters, a first-aid kit and backup oxygen." },
  { q: "Do you arrange Char Dham registration and helicopter tickets?", a: "Yes. We help with mandatory Yatra registration, VIP darshan assistance and helicopter bookings for Kedarnath (subject to availability)." },
  { q: "What is your cancellation policy?", a: "Cancel 30+ days before departure for a full credit voucher, or get 50% back 15–29 days out. If weather forces a cancellation, you get a 100% voucher." },
  { q: "Can you customise a private tour?", a: "Absolutely. Tell us your dates, group size and budget on WhatsApp and we'll design a private itinerary with your choice of hotels and vehicle." }
];
