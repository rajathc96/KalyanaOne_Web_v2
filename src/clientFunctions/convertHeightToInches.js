function convertHeightToInches(inches) {
    if (typeof inches !== 'number' || isNaN(inches))
        return inches;
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
}

export default convertHeightToInches;