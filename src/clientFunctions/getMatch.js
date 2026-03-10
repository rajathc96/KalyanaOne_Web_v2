async function getMatchBreakdown(preference, candidate) {
    const result = {};

    if (preference.ageFrom !== undefined && preference.ageTo !== undefined) {
        result.age = candidate.basicDetails.age >= preference.ageFrom && candidate.basicDetails.age <= preference.ageTo;
    }
    if (preference.heightFrom && preference.heightTo && preference.heightFrom !== undefined && preference.heightTo !== undefined) {
        result["height"] = candidate.basicDetails?.height >= preference.heightFrom && candidate.basicDetails?.height <= preference.heightTo;
    }
    if (preference.maritalStatus && preference.maritalStatus !== "Any")
        result["maritalStatus"] = preference.maritalStatus === candidate.basicDetails?.maritalStatus ? true : false;
    else if (preference.maritalStatus === "Any")
        result["maritalStatus"] = true;

    if (preference.location && preference.location.length)
        result["location"] = preference.location.includes(candidate.basicDetails?.location) ? true : false;
    else if (preference.location === "Any")
        result["location"] = true;

    if (preference.language && preference.language.length)
        result["motherTongue"] = preference.language.includes(candidate.basicDetails.motherTongue) ? true : false;
    else
        result["motherTongue"] = true;

    if (preference.caste && preference.caste !== "Any") {
        result.caste = preference.caste === candidate.partnerPreference?.caste ? true : false;
    }
    else
        result.caste = true;

    if (preference.subCaste && preference.subCaste !== "Any" && preference.subCaste.length)
        result["subCaste"] = preference.subCaste.includes(candidate.casteDetails.subCaste) ? true : false;
    else
        result["subCaste"] = true;

    if (preference.physicalStatus && preference.physicalStatus !== "Any")
        result["physicalStatus"] = preference.physicalStatus === candidate.personalDetails?.physicalStatus;
    else if (preference.physicalStatus === "Any")
        result["physicalStatus"] = true;

    if (preference.foodHabits && preference.foodHabits !== "Any")
        result["foodHabit"] = preference.foodHabits === candidate.personalDetails?.foodHabit;
    else if (preference.foodHabits === "Any")
        result["foodHabit"] = true;

    if (preference.drinking && preference.drinking !== "Any")
        result["drinking"] = preference.drinking === candidate.personalDetails?.drinking ? true : false;
    else if (preference.drinking === "Any")
        result["drinking"] = true;

    if (preference.smoking && preference.smoking !== "Any")
        result["smoking"] = preference.smoking === candidate.personalDetails?.smoking ? true : false;
    else if (preference.smoking === "Any")
        result["smoking"] = true;

    if (preference.highestQualification && preference.highestQualification.length)
        result["education"] = preference.highestQualification.includes(candidate.educationCareer.highestQualification) ? true : false;
    else
        result["education"] = true;

    if (preference.occupation && preference.occupation.length)
        result["occupation"] = preference.occupation.includes(candidate.educationCareer?.occupation) ? true : false;
    else
        result["occupation"] = true;

    // if (preference.company && preference.company.length)
    //     result["company"] = preference.company.includes(candidate.educationCareer?.company) ? true : false;
    // else
    //     result["company"] = true;

    if (preference.workLocation && preference.workLocation.length)
        result["workLocation"] = preference.workLocation.includes(candidate.educationCareer?.workLocation) ? true : false;
    else
        result["workLocation"] = true;

    if (preference.annualIncomeFrom && preference.annualIncomeTo) {
        const from = Number(preference.annualIncomeFrom);
        const to = Number(preference.annualIncomeTo);
        const candidateIncome = candidate.educationCareer?.annualIncome ? Number(candidate.educationCareer?.annualIncome) : null;

        if (candidateIncome !== null) {
            if (from === to) {
                result["annualIncome"] = candidateIncome === from;
            } else if (to && to !== undefined) {
                result["annualIncome"] = candidateIncome >= from && candidateIncome < to;
            } else {
                result["annualIncome"] = candidateIncome >= from;
            }
        }
    }
    else {
        result["annualIncome"] = true;
    }

    const matchedScore = Object.values(result).filter(value => value).length;
    const totalCriteria = Object.keys(result).length;
    const score = `${matchedScore} / ${totalCriteria}`;

    return { result, score, matchedScore, totalCriteria };
}

export default getMatchBreakdown;
