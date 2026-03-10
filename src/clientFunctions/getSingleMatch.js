async function getSingleMatchBreakdown(preference, filter, candidate) {
    switch (filter) {
        case "caste":
            if (candidate.partnerPreference?.caste && candidate.partnerPreference?.caste !== "Any") {
                return preference.caste === candidate.partnerPreference?.caste;
            }
            return true;
        case "age":
            if (preference.ageFrom !== undefined && preference.ageTo !== undefined) {
                return candidate.basicDetails.age >= preference.ageFrom && candidate.basicDetails.age <= preference.ageTo;
            }
            return true;
        case "height":
            if (preference.heightFrom && preference.heightTo && preference.heightFrom !== undefined && preference.heightTo !== undefined) {
                return candidate.basicDetails?.height >= preference.heightFrom && candidate.basicDetails?.height <= preference.heightTo;
            }
            return true;
        case "occupation":
            if (preference.occupation && preference.occupation.length) {
                return preference.occupation.includes(candidate.educationCareer?.occupation);
            }
            return true;
        case "location":
            if (preference.location && preference.location.length) {
                return preference.location.includes(candidate.basicDetails?.location);
            }
            return true;
        case "annualIncome":
            if (preference.annualIncomeFrom && preference.annualIncomeTo) {
                const from = Number(preference.annualIncomeFrom);
                const to = Number(preference.annualIncomeTo);
                const candidateIncome = candidate.educationCareer?.annualIncome ? Number(candidate.educationCareer?.annualIncome) : null;

                if (candidateIncome !== null) {
                    if (from === to) {
                        return candidateIncome === from;
                    } else if (to && to !== undefined) {
                        return candidateIncome >= from && candidateIncome < to;
                    } else {
                        return candidateIncome >= from;
                    }
                }
            }
            else
                return true;
        case "highestQualification":
            if (preference.highestQualification && preference.highestQualification.length) {
                return preference.highestQualification.includes(candidate.educationCareer.highestQualification);
            }
            return true;
        default:
            return false;

    }
}

export default getSingleMatchBreakdown;
