import { clientAuth } from "../../../firebase";

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
    fatherName: (value, allValues) => {
        return value
            ? `${value} ${allValues?.fatherOccupation ? `(${allValues.fatherOccupation})` : ""}`
            : "N/A";
    },
    motherName: (value, allValues) => {
        return value
            ? `${value} ${allValues?.motherOccupation ? `(${allValues.motherOccupation})` : ""}`
            : "N/A";
    },
    noOfBrothers: (value, allValues) => {
        if (!value) return "N/A";
        if (Number(value) === 0 || value === "None") return "None";
        return `${value} brother${Number(value) !== 1 ? "s" : ""} ${Number(allValues.noOfMarriedBrothers) !== 0 ? `(${allValues.noOfMarriedBrothers} married)` : ""}`;
    },
    noOfSisters: (value, allValues) => {
        if (!value) return "N/A";
        if (Number(value) === 0 || value === "None") return "None";
        return `${value} sister${Number(value) !== 1 ? "s" : ""} ${Number(allValues.noOfMarriedSisters) !== 0 ? `(${allValues.noOfMarriedSisters} married)` : ""}`;
    },
    default: (value) => value || "N/A",
};

const partnerFieldLabels = {
    ageRange: "Preferred Age",
    heightRange: "Preferred Height",
    language: "Preferred Language",
    location: "Preferred Location",
    maritalStatus: "Marital Status",
    caste: "Caste",
    subCaste: "Subcaste",
    highestQualification: "Education",
    occupation: "Occupation",
    annualIncome: "Annual Income",
    foodHabit: "Food Habit",
    drinking: "Drinking",
    smoking: "Smoking",
    physicalStatus: "Physical Status",
};

function convertInchesToHeight(inches) {
    if (!inches) return '';
    if (isNaN(Number(inches))) return inches;
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
}

const partnerFieldRender = {
    ageRange: (data) => {
        if (!data || !data.ageFrom || !data.ageTo) return "N/A";
        const { ageFrom, ageTo } = data;
        return ageFrom === ageTo ? `${ageFrom} Yrs` : `${ageFrom} - ${ageTo} Yrs`;
    },
    heightRange: (data) => {
        if (!data || !data.heightFrom || !data.heightTo) return "N/A";
        const { heightFrom, heightTo } = data;
        return `${convertInchesToHeight(heightFrom)} - ${convertInchesToHeight(heightTo)}`;
    },
    default: (value) => {
        if (Array.isArray(value)) {
            return value.length === 1 ? value[0] : value.length ? value : "N/A";
        }
        return value || "N/A";
    }
};

export function getSections(profileData, globalData) {
    return [
        {
            title: "Basic details",
            content: [
                { label: "Age", value: profileData?.basicDetails?.age ? profileData.basicDetails.age + " Yrs" : "N/A" },
                { label: "Height", value: profileData?.basicDetails?.height || "N/A" },
                { label: "Marital Status", value: profileData?.basicDetails?.maritalStatus || "N/A" },
                { label: "Location", value: profileData?.basicDetails?.location || "N/A" },
                { label: "Language", value: profileData?.basicDetails?.motherTongue || "N/A" }
            ]
        },
        {
            title: "Caste & Subcaste",
            content: [
                { label: "Caste", value: globalData?.casteDetails?.caste || "N/A" },
                { label: "Subcaste", value: profileData?.casteDetails?.subCaste || "N/A" }
            ]
        },
        {
            title: "Education & Career details",
            content: [
                { label: "Highest Qualification", value: profileData?.educationCareer?.highestQualification || "N/A" },
                { label: "College", value: profileData?.educationCareer?.college || "N/A" },
                { label: "Occupation", value: profileData?.educationCareer?.occupation || "N/A" },
                { label: "Company", value: profileData?.educationCareer?.company || "N/A" },
                { label: "Annual Income", value: profileData?.educationCareer?.annualIncome || "N/A" },
                { label: "Work Location", value: profileData?.educationCareer?.workLocation || "N/A" }
            ]
        },
        {
            title: "Personal details",
            content: [
                { label: "Physical Status", value: profileData?.personalDetails?.physicalStatus || "N/A" },
                { label: "Weight", value: profileData?.personalDetails?.weight ? profileData.personalDetails.weight + " kg" : "N/A" },
                { label: "Food Habit", value: profileData?.personalDetails?.foodHabit || "N/A" },
                { label: "Drinking", value: profileData?.personalDetails?.drinking || "N/A" },
                { label: "Smoking", value: profileData?.personalDetails?.smoking || "N/A" }
            ]
        },
        {
            title: "Horoscope details",
            content: [
                { label: "Time of Birth", value: profileData?.horoscopeDetails?.timeOfBirth || "N/A" },
                { label: "Place of Birth", value: profileData?.horoscopeDetails?.placeOfBirth || "N/A" },
                { label: "Nakshatra", value: profileData?.horoscopeDetails?.nakshatra || "N/A" },
                { label: "Rashi", value: profileData?.horoscopeDetails?.rashi || "N/A" },
                { label: "Manglik Status", value: profileData?.horoscopeDetails?.manglikStatus || "N/A" }
            ]
        },
        {
            title: "Family details",
            content: Object.entries(familyFieldLabels).map(([key, label]) => {
                const value = profileData?.familyDetails?.[key];
                const rendered = familyFieldRender[key]
                    ? familyFieldRender[key](value, profileData?.familyDetails)
                    : familyFieldRender.default(value);

                return { label, value: rendered };
            })
        },
        {
            title: "Contact details",
            content: [
                { label: "Phone", value: clientAuth.currentUser?.phoneNumber || "N/A" },
                { label: "Email", value: clientAuth.currentUser?.email || "N/A" },
                { label: "Instagram", value: profileData?.socialMediaDetails?.instagram === "https://www.instagram.com/" ? "N/A" : profileData?.socialMediaDetails?.instagram || "N/A" },
                { label: "LinkedIn", value: profileData?.socialMediaDetails?.linkedin === "https://www.linkedin.com/" ? "N/A" : profileData?.socialMediaDetails?.linkedin || "N/A" }
            ]
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
        }
    ];
}