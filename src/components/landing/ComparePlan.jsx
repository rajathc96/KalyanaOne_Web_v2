import cancelWide from "../../assets/images/cancelwide.svg";
import greenTick from "../../assets/images/greenright.svg";
import cross from "../../assets/images/redcancel.svg";
import logo from "../../assets/logo.svg";
import "./ComparePlan.css";

export default function ComparePlan({ show, onClose }) {
    const features = [
        { name: "₹ Pricing", free: "₹0", premium: "₹99 (12 Months)" },
        { name: "📝 Create & complete profile", free: true, premium: true },
        // { name: "👀 Daily profile views", free: "10/day", premium: "Unlimited" },
        { name: "💌 Send interests / requests", free: false, premium: "50 per plan" },
        { name: "📩 Receive interests", free: true, premium: true },
        { name: "👤 View full profile details", free: false, premium: true },
        { name: "☎️ View verified contact info (phone/email)", free: false, premium: true },
        { name: "💬 Chat with matched profiles", free: false, premium: true },
        { name: "🔍 Search with advanced search filters", free: false, premium: true },
        { name: "🔮 Horoscope compatibility check", free: false, premium: true },
        // { name: "🚀 Profile boost in search results", free: false, premium: true },
        { name: "🔒 Privacy control settings", free: false, premium: true },
        { name: "❤️ Personalized daily matches", free: false, premium: true },
        { name: "🎧 Priority support", free: false, premium: true },
    ];

    return (
        <div className={`bottom-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`bottom-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="compare-header">
                    <div className="logo">
                        <img src={logo} alt="KalyanaOne Logo" className="logo-img" />
                        <span className="logo-text">KalyanaOne</span>
                    </div>
                    <button className="compare-link fixed">
                        Compare free and premium plans
                    </button>
                    <img
                        src={cancelWide}
                        alt="Close"
                        style={{ cursor: "pointer" }}
                        onClick={onClose}
                    />
                </div>
                <div className="compare-content">
                    <div className="feature-section">
                        <table className="comparison-table">
                            <colgroup>
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '30%' }} />
                                <col style={{ width: '35%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Features</th>
                                    <th>Free Plan</th>
                                    <th>💎 Premium Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((item, i) => (
                                    <tr key={i}>
                                        <td className="feature-name">{item.name}</td>
                                        <td className="feature-value">
                                            {item.free === true ? (
                                                <img src={greenTick} alt="Tick" />
                                            ) : item.free === false ? (
                                                <img className="cross" src={cross} alt="Cross" />
                                            ) : (
                                                item.free
                                            )}
                                        </td>
                                        <td className="feature-value">
                                            {item.premium === true ? (
                                                <img src={greenTick} alt="Tick" />
                                            ) : item.premium === false ? (
                                                <img className="cross" src={cross} alt="Cross" />
                                            ) : (
                                                item.premium
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="filter-pill active">
                        Explore Premium Plans
                    </button>
                </div>
            </div>
        </div>
    );
}
