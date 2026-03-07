import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import rightArrow_dark from "../../../assets/icons/editrightarrow_dark.svg";
import "./PoliciesAgreement.css";

const PoliciesAgreement = () => {
  const navigate = useNavigate();

  const userAgreements = [
    { title: "Terms and Conditions", link: "https://kalyanaone.com/terms-and-conditions" },
    { title: "Privacy Policy", link: "https://kalyanaone.com/privacy-policy" },
    { title: "User Agreement", link: "https://kalyanaone.com/user-agreement" },
    { title: "Data Misuse Clause", link: "https://kalyanaone.com/user-agreement?tab=data-misuse-clause" },
    { title: "Disclaimer", link: "https://kalyanaone.com/user-agreement?tab=disclaimer" },
    { title: "Community Guidelines", link: "https://kalyanaone.com/user-agreement?tab=community-guidelines" },
    { title: "Cookies Policy", link: "https://kalyanaone.com/user-agreement?tab=cookies-policy" },
    { title: "Refund and Cancellation Policy", link: "https://kalyanaone.com/refund-policy?tab=refunds-cancellations" },
    { title: "Payment Policy", link: "https://kalyanaone.com/refund-policy?tab=payment-policy" },
    { title: "FAQ", link: "https://kalyanaone.com/help?tab=faq" },
    { title: "Safety Tips", link: "https://kalyanaone.com/help?tab=safety-tips" },
    { title: "Contact and Grievance", link: "https://kalyanaone.com/help?tab=contact-grievance" },
    { title: "Accessibility Statement", link: "https://kalyanaone.com/help?tab=accessibility-statement" },
    { title: "App Update Notes", link: "https://kalyanaone.com/help?tab=app-update-notes" }
  ];

  return (
    <>
      <div className="mobile-only">
        <div className="headers-top">
          <ArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
          <p className="header-title">Policies & Agreement</p>
        </div>
      </div>
      <div className="notification-wrapper" style={{ padding: "0", marginTop: "0" }}>
        <div className='desktop-only'>
          <h2 className="account-title" style={{ marginLeft: "10px" }}>Policies & Agreement</h2>
        </div>
        <div className="notification-item policies" >
          <ul className="settings-menu">
            {userAgreements.map((agreement, index) => (
              <li
                key={index}
                style={{ color: "#000", fontWeight: "500", fontSize: "16px" }}
                onClick={() => window.open(agreement.link, "_blank")}
              >
                {agreement.title}
                <img
                  src={rightArrow_dark}
                  alt="arrow"
                  style={{ marginLeft: "auto" }}
                />
              </li>
            ))}
          </ul>

        </div>


      </div>

    </>
  );
};

export default PoliciesAgreement;
