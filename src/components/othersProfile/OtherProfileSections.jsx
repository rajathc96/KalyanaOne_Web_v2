import { formatToINR } from "../../clientFunctions/formatRupees";

const horoscopeDetailsOrder = [
  "dateOfBirth", "timeOfBirth", "countryOfBirth", "stateOfBirth", "placeOfBirth",
  "nakshatra", "rashi", "manglikStatus", "bedagu", "gothra"
];

const horoscopeFieldLabels = {
  dateOfBirth: "Date of Birth",
  timeOfBirth: "Time of Birth",
  countryOfBirth: "Country of Birth",
  stateOfBirth: "State of Birth",
  placeOfBirth: "Place of Birth",
  nakshatra: "Nakshatra",
  rashi: "Rashi",
  manglikStatus: "Manglik Status",
  bedagu: "Bedagu",
  gothra: "Gothra",
};

const familyFieldLabels = {
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  familyValue: "Family Value",
  familyType: "Family Type",
  familyStatus: "Family Status",
  nativePlace: "Native Place",
  noOfBrothers: "No. of Brothers",
  noOfSisters: "No. of Sisters",
};

const familyFieldRender = {
  fatherName: (value, allValues) => value
    ? `${value} ${allValues?.fatherOccupation ? `(${allValues.fatherOccupation})` : ""}`
    : "Not specified",
  motherName: (value, allValues) => value
    ? `${value} ${allValues?.motherOccupation ? `(${allValues.motherOccupation})` : ""}`
    : "Not specified",
  noOfBrothers: (value, allValues) => {
    if (!value) return "Not specified";
    if (Number(value) === 0 || value === "None") return "None";
    return `${value} brother${Number(value) !== 1 ? "s" : ""} ${Number(allValues.noOfMarriedBrothers) !== 0
      ? `(${allValues.noOfMarriedBrothers} married)` : ""}`;
  },
  noOfSisters: (value, allValues) => {
    if (!value) return "Not specified";
    if (Number(value) === 0 || value === "None") return "None";
    return `${value} sister${Number(value) !== 1 ? "s" : ""} ${Number(allValues.noOfMarriedSisters) !== 0
      ? `(${allValues.noOfMarriedSisters} married)` : ""}`;
  },
  default: (value) => value || "Not specified",
};

const partnerFieldLabels = {
  ageRange: "Preferred Age",
  heightRange: "Preferred Height",
  language: "Preferred Language",
  location: "Preferred Location",
  maritalStatus: "Marital Status",
  // caste: "Caste",
  subCaste: "Subcaste",
  education: "Education",
  occupation: "Occupation",
  annualIncome: "Annual Income",
  foodHabit: "Food Habit",
  drinking: "Drinking",
  smoking: "Smoking",
  physicalStatus: "Physical Status",
};

const partnerFieldRender = {
  ageRange: (data) => {
    if (!data || !data.ageFrom || !data.ageTo) return "Not specified";
    const { ageFrom, ageTo } = data;
    return ageFrom === ageTo ? `${ageFrom} Yrs` : `${ageFrom} - ${ageTo} Yrs`;
  },
  heightRange: (data) => {
    if (!data || !data.heightFrom || !data.heightTo) return "Not specified";
    const { heightFrom, heightTo } = data;
    return `${convertInchesToHeight(heightFrom)} - ${convertInchesToHeight(heightTo)}`;
  },
  default: (value) => {
    if (Array.isArray(value)) {
      return value.length === 1 ? value[0] : value.length ? value : "Not specified";
    }
    return value || "Not specified";
  },
};

const contactFieldLabels = {
  phoneNumber: "Phone",
  email: "Email",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

function convertInchesToHeight(inches) {
  if (!inches) return '';
  if (isNaN(Number(inches))) return inches;
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches}"`;
}

export function getSections(profileData, isPremiumUser, horoscopeAccess, contactAccess) {
  return [
    {
      title: "Basic details",
      content: [
        {
          label: "Age",
          value: profileData?.basicDetails?.age
            ? profileData.basicDetails.age + " Yrs"
            : "Not specified",
        },
        { label: "Height", value: convertInchesToHeight(profileData?.basicDetails?.height) || "Not specified" },
        {
          label: "Marital Status",
          value: profileData?.basicDetails?.maritalStatus || "Not specified",
        },
        {
          label: "Living In",
          value: profileData?.basicDetails?.location || "Not specified",
        },
        {
          label: "Language",
          value: profileData?.basicDetails?.motherTongue || "Not specified",
        },
      ],
    },
    {
      title: "Caste & Subcaste",
      content: [
        { label: "Caste", value: profileData?.casteDetails?.caste || "Not specified" },
        {
          label: "Subcaste",
          value: profileData?.casteDetails?.subCaste || "Not specified",
        },
      ],
    },
    {
      title: "Education & Career details",
      content: [
        {
          label: "Highest Qualification",
          value: profileData?.educationCareer?.highestQualification || "Not specified",
        },
        {
          label: "College",
          value: profileData?.educationCareer?.college || "Not specified",
        },
        {
          label: "Occupation",
          value: profileData?.educationCareer?.occupation || "Not specified",
        },
        {
          label: "Company",
          value: profileData?.educationCareer?.company || "Not specified",
        },
        {
          label: "Annual Income",
          value:
            profileData?.educationCareer?.annualIncome ===
              "Doesn't wish to specify"
              ? "Doesn't wish to specify"
              : formatToINR(
                String(profileData?.educationCareer?.annualIncome)
              ) || "Not specified",
        },
        {
          label: "Work Location",
          value: profileData?.educationCareer?.workLocation || "Not specified",
        },
      ],
    },
    {
      title: "Personal details",
      content: [
        {
          label: "Physical Status",
          value: profileData?.personalDetails?.physicalStatus || "Not specified",
        },
        {
          label: "Weight",
          value: profileData?.personalDetails?.weight ? profileData?.personalDetails?.weight + " kg" : "Not specified",
        },
        {
          label: "Food Habit",
          value: profileData?.personalDetails?.foodHabit || "Not specified",
        },
        {
          label: "Drinking",
          value: profileData?.personalDetails?.drinking || "Not specified",
        },
        {
          label: "Smoking",
          value: profileData?.personalDetails?.smoking || "Not specified",
        },
      ],
    },
    {
      title: "Horoscope details",
      content: horoscopeDetailsOrder.map((key) => {
        const value = profileData?.horoscopeDetails?.[key];
        const displayValue =
          isPremiumUser && horoscopeAccess
            ? value || "Not provided"
            : "•••••••••";

        return {
          label: horoscopeFieldLabels[key] || key,
          value: displayValue,
        };
      }),
      encrypted: !isPremiumUser || !horoscopeAccess,
    },
    {
      title: "Family details",
      content: Object.entries(familyFieldLabels).map(([key, label]) => {
        const value = profileData?.familyDetails?.[key];
        const rendered = familyFieldRender[key]
          ? familyFieldRender[key](value, profileData?.familyDetails)
          : familyFieldRender.default(value);

        return { label, value: rendered };
      }),
    },
    {
      title: "Contact details",
      content: Object.keys(contactFieldLabels).map((key) => {
        const value = profileData?.contactDetails?.[key];
        const displayValue =
          isPremiumUser && contactAccess ? value || "Not specified" : "•••••••••";

        return {
          label: contactFieldLabels[key],
          value: displayValue,
        };
      }),
      encrypted: !isPremiumUser || !contactAccess,
    },
    {
      title: "Partner preferences",
      content: Object.entries(partnerFieldLabels).map(([key, label]) => {
        const renderFn = partnerFieldRender[key] || partnerFieldRender.default;

        const value =
          key === "ageRange" || key === "heightRange"
            ? renderFn(profileData?.partnerPreference)
            : renderFn(profileData?.partnerPreference?.[key]);

        return {
          label: partnerFieldLabels[key] || key,
          value,
        };
      }),
    },
  ];
}