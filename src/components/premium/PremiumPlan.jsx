import { useState } from "react";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import check from "../../assets/icons/greenright.svg";
import limited from "../../assets/images/limited1000.svg";
import UpdateLoader from "../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../models/YesNoModal/YesNoModal";
import { useNavigate } from "react-router-dom";

const PremiumPlan = ({ setShowPremiumPlanSheet, globalData }) => {

  const navigate = useNavigate();
  const amount = 99;

  const handleClick = (url) => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      navigate(`/settings/${url}`);
    } else {
      navigate("/settings", {
        state: { activePanel: url }
      });
    }
  };

  const features = [
    ["Send interests / requests", "50 per plan"],
    ["Reply to received interests / requests", true],
    ["View full profile details", true],
  ];

  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorHeading, setErrorHeading] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // if (globalData?.isPremiumUser) {
    //   setErrorHeading("Already Premium");
    //   setErrorMessage("You are already a premium member.");
    //   setErrorPopupVisible(true);
    //   return;
    // }

    if (globalData?.isUserVerified !== true || globalData?.isUserSelfieVerified !== true) {
      setErrorHeading("Verification Required");
      setErrorMessage("Please verify your profile before subscribing to Premium.");
      setErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = await clientAuth.currentUser.getIdToken();
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(`${API_URL}/api/payment/razorpay/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          plan: "12_months"
        })
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Server error");

      const order_id = data?.order_id;
      if (!order_id)
        throw new Error("Server error, Please try again");

      try {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        const options = {
          description: 'KalyanaOne Premium Subscription',
          image: 'https://firebasestorage.googleapis.com/v0/b/kalyanaone.firebasestorage.app/o/Kalyana_Logo_White.png?alt=media&token=dc1debff-81b1-4d44-b410-b7981477c1cd',
          currency: 'INR',
          key: 'rzp_live_RmMBGSPZnHPeU0',
          amount: amount * 100,
          name: 'KalyanaOne',
          order_id: order_id,
          handler: async function (response) {

            try {
              const verifyRes = await fetch(`${API_URL}/api/payment/razorpay/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(response)
              });
              const verifyData = await verifyRes.json();

              if (!verifyRes.ok)
                throw new Error(verifyData.error || "Payment verification failed");

              setSuccessMessage("Payment successful! You are now a premium member.");
              setSuccessPopupVisible(true);
            } catch (verifyError) {
              setErrorMessage(`Payment verification failed: ${verifyError?.message || verifyError}`);
              setErrorPopupVisible(true);
            }
          },
          prefill: {
            email: clientAuth.currentUser?.email || '',
            contact: clientAuth.currentUser?.phoneNumber || '',
            name: clientAuth.currentUser?.displayName || ''
          },
          theme: { color: '#FF025B' },
        };
        const RazorpayConstructor = window.Razorpay;
        if (typeof RazorpayConstructor !== "function") {
          throw new Error("Razorpay is not available");
        }
        const razorpay = new RazorpayConstructor(options);
        razorpay.open();

      } catch (error) {
        setErrorMessage(`Payment failed: ${error.message || error}`);
        setErrorPopupVisible(true);
      }
    } catch (error) {
      setErrorMessage(`Could not initiate payment: ${error.message || error}`);
      setErrorPopupVisible(true);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="premium-plan-container" style={{ height: window.innerHeight - (window.innerWidth > 600 ? 90 : 50) }}>
      <div className="mobile-only">
        <h3 className="unlock-title">Unlock all features of KalyanaOne ✨</h3>
      </div>

      <div className="landing-page">
        <div className="plan">
          <div>
            <h4>Early Member Offer</h4>
            <p className="price"><span className="price-old">₹499</span> ₹99 / Year</p>
            <img
              src={limited}
              alt="Limited Time Offer"
              className="early-access-badge"
            />
          </div>
          <div>
            <ul className="plan-features">
              <li>💎 Maximum value, minimum cost</li>
              <li>❤️ Send 50 interests/requests per plan</li>
              <li>💰 Less than ₹9 / month</li>
              <li>🚀 Includes all premium features</li>
              <li>♾️ Unlimited profile search</li>
              <li>🎧 Priority customer support</li>
            </ul>
            <button
              className="upgrade-btn"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? <UpdateLoader /> : "Get Premium – ₹99/year only!"}
            </button>
          </div>
          <span className="plan-limit-info" style={{ marginTop: "10px", fontSize: "11px", color: "#696969" }}>
            Send up to 50 interests/requests within 1 year. Renewal is required after reaching the limit or expiry, whichever comes first.
          </span>
        </div>
      </div>

      <div className="mobile-only">
        <div className="premium-features">
          <p className="includes-text">Includes all Free plan features +</p>
          {features.map(([text, status], idx) => (
            <div className="feature-row" key={idx}>
              <p>{text}</p>
              <span className="feature-status">
                {status === true && <img src={check} alt="check" />}
                {typeof status === "string" && (
                  <span className="feature-limit">{status}</span>
                )}
              </span>
            </div>
          ))}
          <p className="see-more" onClick={() => setShowPremiumPlanSheet(true)}>see more features</p>
        </div>
      </div>
      <YesNoModal
        show={successPopupVisible}
        onClose={() => setSuccessPopupVisible(false)}
        heading="Payment Successful"
        data={successMessage}
        buttonText="OK"
        onYes={() => setSuccessPopupVisible(false)}
      />

      <YesNoModal
        show={errorPopupVisible}
        onClose={() => setErrorPopupVisible(false)}
        heading={errorHeading || "Payment Error"}
        data={errorMessage}
        buttonText={errorHeading === "Verification Required" ? "Verify Now" : "OK"}
        onYes={() => {
          if (errorHeading === "Verification Required") {
            handleClick('profile-verification');
          }
          setErrorPopupVisible(false)
        }}
      />

    </div>
  );
};

export default PremiumPlan;
