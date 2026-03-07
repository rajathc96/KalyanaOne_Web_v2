export const formatToINR = (num) => {
  if (!num) return "";
  const number = num.replace(/[^0-9]/g, "");
  const x = number.length > 3 ? number.slice(0, -3) : "";
  const last3 = number.slice(-3);
  const formatted =
    x.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (x ? "," : "") + last3;
  return "₹" + formatted;
};
