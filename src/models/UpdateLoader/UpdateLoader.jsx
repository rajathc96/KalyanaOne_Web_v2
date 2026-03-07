function UpdateLoader({ size = 14, color = "#000" }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2px solid ${color}ff`,
        borderStyle: "solid",
        borderTop: "2px solid transparent",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        zIndex: 1
      }}
    />
  );
}

export default UpdateLoader;
