import PlanDetails from "../../components/settings/planDetails/PlanDetails";

const PlanDetailsPopup = ({ show, onClose }) => {
  return (
    <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        style={{ maxWidth: '460px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <PlanDetails />
      </div>
    </div>
  );
};

export default PlanDetailsPopup;
