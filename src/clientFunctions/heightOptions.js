const generateHeightsArray = () => {
  const heights = [];
  for (let feet = 3; feet <= 7; feet++) {
    const maxInch = feet === 7 ? 0 : 11;
    for (let inch = 0; inch <= maxInch; inch++) {
      heights.push(`${feet}' ${inch}"`);
    }
  }
  return heights;
};

export default generateHeightsArray;