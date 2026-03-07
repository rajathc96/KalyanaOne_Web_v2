import { useState, useRef, useEffect } from "react";
import { paymentPolicy, refundCancellationPolicy } from "./paymentPolicy";
import kalyanaLogo from "../../assets/images/kalyana-logo.svg";
import xLogo from "../../assets/images/x_logo.svg";
import linkedinLogo from "../../assets/images/linkedin.svg";
import instagramLogo from "../../assets/images/instagram.svg";
import { useNavigate } from "react-router-dom";

const sidebarTitles = [
    { id: "payment-policy", title: "Payment Policy" },
    { id: "refunds-cancellations", title: "Refund and Cancellation Policy" },
];

const PaymentPolicy = () => {
    const [activeSection, setActiveSection] = useState("refunds-cancellations");
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveSection(tab || 'refunds-cancellations');
    }, [location.search]);

    // helper to render text that may contain newlines (handles escaped \n and real newlines)
    const renderWithBreaks = (txt) => {
        if (txt === undefined || txt === null) return null;
        const s = String(txt).replace(/\\n/g, "\n");
        const parts = s.split(/\r?\n/);
        return parts.map((part, i) => (
            <span key={i} style={{ lineHeight: "140%" }}>
                {part}
                {i < parts.length - 1 && <br />}
            </span>
        ));
    };

    // decide which document to render based on top-level selection
    const contentData = activeSection === "payment-policy"
        ? paymentPolicy
        : refundCancellationPolicy;

    return (
        <div className="terms-page">
            <aside className="terms-sidebar">
                <nav>
                    {sidebarTitles.map((item) => (
                        <h3
                            key={item.id}
                            className={`sidebar-title ${activeSection === item.id ? "active" : ""}`}
                            onClick={() => {
                                navigate(`?tab=${item.id}`);
                                if (scrollRef.current) {
                                    scrollRef.current.scrollTo({ top: 0 });
                                } else {
                                    window.scrollTo({ top: 0 });
                                }
                            }}
                        >
                            {item.title}
                        </h3>
                    ))}
                </nav>
            </aside>

            <div className="heading">
                {sidebarTitles.find(item => item.id === activeSection)?.title}
            </div>

            <main className="terms-content">
                <div className="mobile-only">
                    <div className="heading">
                        {sidebarTitles.find(item => item.id === activeSection)?.title}
                    </div>
                </div>

                <div className="terms-body">
                    {contentData.map((sec) => (
                        <section key={sec.id} id={sec.id} className="terms-section">
                            <h2 style={sec?.id === "acknowledgement" || sec?.id === "heading" ? { fontWeight: 500 } : {}}>{sec.title}</h2>
                            {sec?.paragraphs && sec.paragraphs.map((p, i) => <p key={i}>{renderWithBreaks(p)}</p>)}
                            {sec?.bullets && (
                                <ul>
                                    {sec.bullets.map((b, idx) => (
                                        <li key={idx}>{renderWithBreaks(b)}</li>
                                    ))}
                                </ul>
                            )}

                            {/* render subsections if present (used by privacyPolicy) */}
                            {sec.subsections && sec.subsections.map((sub, si) => (
                                <div key={si} className="subsection">
                                    {sub.heading && <div className="subsection-heading">{sub.heading}</div>}
                                    {sub.paragraphs && sub.paragraphs.map((p, pi) => <p key={pi}>{p}</p>)}
                                    {sub.bullets && (
                                        <ul className="subsection-list">
                                            {sub.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                            {sec?.paragraphs2 && sec.paragraphs2.map((p, i) => <p key={i}>{p}</p>)}
                        </section>
                    ))}

                    <section className="footer">
                        <div className="footer-header">
                            <img src={kalyanaLogo} alt="Ozta Logo" className="footer-logo desktop-only" />
                            <img src={kalyanaLogo} alt="Ozta Logo" className="footer-logo mobile-only" />
                            <div>
                                <p className="footer-description">+91- 9483979042</p>
                                <p className="footer-description">hello@kalyana.one</p>
                            </div>
                        </div>
                        <div className="footer-separator" />
                        <div className="footer-content">
                            <p>
                                &copy;2025 Ozta Labs Pvt. Ltd.
                            </p>
                            <div className="desktop-only">
                                <div className="footer-text">
                                    <p onClick={() => window.open("https://kalyanaone.com/terms-and-conditions", "_blank")}>
                                        Terms
                                    </p>
                                    <p onClick={() => window.open("https://kalyanaone.com/privacy-policy", "_blank")}>
                                        Privacy
                                    </p>
                                    <p onClick={() => window.open("https://kalyanaone.com/refund-policy", "_blank")}>
                                        Refund
                                    </p>
                                    <p onClick={() => window.open("https://kalyanaone.com/help", "_blank")}>
                                        Help
                                    </p>
                                </div>
                            </div>
                            <div className="social-icons">
                                <img src={xLogo} alt="X Logo" className="social-logo" onClick={() => window.open("https://x.com/OztaLabs", "_blank")} />
                                <img src={linkedinLogo} alt="LinkedIn Logo" className="social-logo" onClick={() => window.open("https://www.linkedin.com/company/oztalabs", "_blank")} />
                                <img src={instagramLogo} alt="Instagram Logo" className="social-logo" onClick={() => window.open("https://www.instagram.com/kalyanaone", "_blank")} />
                            </div>
                        </div>
                        <div className="mobile-only">
                            <div className="footer-text">
                                <p onClick={() => window.open("https://kalyanaone.com/terms-and-conditions", "_blank")}>
                                    Terms
                                </p>
                                <p onClick={() => window.open("https://kalyanaone.com/privacy-policy", "_blank")}>
                                    Privacy
                                </p>
                                <p onClick={() => window.open("https://kalyanaone.com/refund-policy", "_blank")}>
                                    Refund
                                </p>
                                <p onClick={() => window.open("https://kalyanaone.com/help", "_blank")}>
                                    Help
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
            {/* </div> */}
        </div>
    );
};

export default PaymentPolicy;