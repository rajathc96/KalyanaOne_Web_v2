export default function FloatingInput({ placeholder, value, onChange, disabled = false, onClick, style }) {
  return (
    <div className="floating-label-wrapper">
      <input
        type="text"
        placeholder=" "
        className="floating-input-settings"
        value={value}
        onChange={onChange}
        disabled={disabled}
        onClick={onClick}
        style={style}
      />
      <label className="floating-label">{placeholder}</label>
    </div>
  );
}
