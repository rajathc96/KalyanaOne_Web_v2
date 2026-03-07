function getPercentage(...stateObjects) {
  const allFields = stateObjects.flatMap(obj =>
    typeof obj === "object" && obj !== null
      ? Object.values(obj)
      : [obj]
  );

  const isFilled = value => {
    if (typeof value === "number") return true; // 0 is considered filled
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  };

  const filledCount = allFields.filter(isFilled).length;
  const totalCount = allFields.length;
  return totalCount === 0 ? 0 : Math.round((filledCount / totalCount) * 100);
}

export default getPercentage;
