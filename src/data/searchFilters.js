export const ageOptions = Array.from({ length: 60 - 17 }, (_, i) => (i + 18).toString());

export const heightOptions = [
  "3′ 0″", "3′ 1″", "3′ 2″", "3′ 3″", "3′ 4″", "3′ 5″", "3′ 6″", "3′ 7″", "3′ 8″", "3′ 9″", "3′ 10″", "3′ 11″",
  "4′ 0″", "4′ 1″", "4′ 2″", "4′ 3″", "4′ 4″", "4′ 5″", "4′ 6″", "4′ 7″", "4′ 8″", "4′ 9″", "4′ 10″", "4′ 11″",
  "5′ 0″", "5′ 1″", "5′ 2″", "5′ 3″", "5′ 4″", "5′ 5″", "5′ 6″", "5′ 7″", "5′ 8″", "5′ 9″", "5′ 10″", "5′ 11″",
  "6′ 0″", "6′ 1″", "6′ 2″", "6′ 3″", "6′ 4″", "6′ 5″", "6′ 6″", "6′ 7″", "6′ 8″", "6′ 9″", "6′ 10″", "6′ 11″",
  "7′ 0″", "7′ 1″", "7′ 2″", "7′ 3″", "7′ 4″", "7′ 5″", "7′ 6″", "7′ 7″", "7′ 8″", "7′ 9″", "7′ 10″", "7′ 11″",
];

export const maritalstatus = ["Never married", "Divorced", "Widowed", "Any"];
export const locationpreferncese = ["anywhere", "India", "USA", "UK", "Canada", "Australia", "Other"];

export const languages = [
  "Kannada",
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Odia",
  "Assamese",
  "Maithili",
  "Sanskrit",
  "Bodo",
  "Dogri",
  "Manipuri",
  "Santali",
  "Konkani",
  "Sindhi",
  "Kashmiri",
  "Nepali",
];

export const annualincome = ["< 1 Lakh", "1-5 Lakhs", "5-10 Lakhs", "10-20 Lakhs", "> 20 Lakhs"];

export const physicalstatus = [
  "Normal",
  "Physically Challenged",
  "Any"
];

export const weights = ["40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100"];

export const foodhabits = [
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian",
  "Any",
];

export const smokinghabits = [
  "Yes",
  "No",
  "Occasionally",
  "Any",
];

export const drinkinghabits = [
  "Yes",
  "No",
  "Occasionally",
  "Any",
];

export const familytype = ["Joint", "Nuclear", "Any"];

export const familystatus = [
  "Lower Middle Class",
  "Middle Class",
  "Upper Middle Class",
  "Rich & Affluent",
  "Any"
];


export const nakshatras = [ 
  "Any", "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
  "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
  "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];
export const rashis = [
  "Any",
  "Aries (ಮೇಷ ರಾಶಿ)",
  "Taurus (ವೃಷಭ ರಾಶಿ)",
  "Gemini (ಮಿಥುನ ರಾಶಿ)",
  "Cancer (ಕರ್ಕಟಕ ರಾಶಿ)",
  "Leo (ಸಿಂಹ ರಾಶಿ)",
  "Virgo (ಕನ್ಯಾ ರಾಶಿ)",
  "Libra (ತುಲಾ ರಾಶಿ)",
  "Scorpio (ವೃಶ್ಚಿಕ ರಾಶಿ)",
  "Sagittarius (ಧನು ರಾಶಿ)",
  "Capricorn (ಮಕರ ರಾಶಿ)",
  "Aquarius (ಕುಂಭ ರಾಶಿ)",
  "Pisces (ಮೀನ ರಾಶಿ)"
];
export const manglikstatus = ["Yes", "No", "Doesn't matter"];

export const incomeRanges = [
  { label: "0 - 1 Lakh", from: 0, to: 100000 },
  { label: "1 - 2 Lakhs", from: 100000, to: 200000 },
  { label: "2 - 3 Lakhs", from: 200000, to: 300000 },
  { label: "3 - 4 Lakhs", from: 300000, to: 400000 },
  { label: "4 - 5 Lakhs", from: 400000, to: 500000 },
  { label: "5 - 6 Lakhs", from: 500000, to: 600000 },
  { label: "6 - 7 Lakhs", from: 600000, to: 700000 },
  { label: "7 - 8 Lakhs", from: 700000, to: 800000 },
  { label: "8 - 9 Lakhs", from: 800000, to: 900000 },
  { label: "9 - 10 Lakhs", from: 900000, to: 1000000 },
  { label: "10 - 12 Lakhs", from: 1000000, to: 1200000 },
  { label: "12 - 14 Lakhs", from: 1200000, to: 1400000 },
  { label: "14 - 16 Lakhs", from: 1400000, to: 1600000 },
  { label: "16 - 18 Lakhs", from: 1600000, to: 1800000 },
  { label: "18 - 20 Lakhs", from: 1800000, to: 2000000 },
  { label: "20 - 25 Lakhs", from: 2000000, to: 2500000 },
  { label: "25 - 30 Lakhs", from: 2500000, to: 3000000 },
  { label: "30 - 35 Lakhs", from: 3000000, to: 3500000 },
  { label: "35 - 40 Lakhs", from: 3500000, to: 4000000 },
  { label: "40 - 45 Lakhs", from: 4000000, to: 4500000 },
  { label: "45 - 50 Lakhs", from: 4500000, to: 5000000 },
  { label: "50 - 60 Lakhs", from: 5000000, to: 6000000 },
  { label: "60 - 70 Lakhs", from: 6000000, to: 7000000 },
  { label: "70 - 80 Lakhs", from: 7000000, to: 8000000 },
  { label: "80 - 90 Lakhs", from: 8000000, to: 9000000 },
  { label: "90 - 100 Lakhs", from: 9000000, to: 10000000 },
  { label: "1 Crore and above", from: 10000000, to: Infinity },
  { label: "Doesn't matter", from: 0, to: Infinity }
];
