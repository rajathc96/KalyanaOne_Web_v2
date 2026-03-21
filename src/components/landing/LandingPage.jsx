import { useState } from "react";
import couple from "../../assets/images/couple.svg";
import limited from "../../assets/images/limited1000.svg";
import easyToUse from "../../assets/images/easy-to-use.svg";
import googlePlayBadge from "../../assets/images/google-play-badge.svg";
import instagramLogo from "../../assets/images/instagram.svg";
import kalyanaLogo from "../../assets/images/kalyana-logo.svg";
import linkedinLogo from "../../assets/images/linkedin.svg";
import qr from "../../assets/images/KalyanaOne_App_DOwnload_qr.svg";
import secureTrusted from "../../assets/images/secure-trusted.svg";
import valueMoney from "../../assets/images/value-money.svg";
import xLogo from "../../assets/images/x_logo.svg";
import logo from "../../assets/logo.svg";
import ComparePlan from "./ComparePlan";
import "./LandingPage.css";

export default function LandingPage() {
	// const navigate = useNavigate();
	const [showComparePlan, setShowComparePlan] = useState(false);

	return (
		<div className="landing-page">
			<div className="landing-header">
				<div className="landing-logo">
					<img src={logo} alt="KalyanaOne Logo" />
					<span className="logo-text">KalyanaOne</span>
				</div>
				<div>
					<button
						className="landing-login-btn"
						onClick={() => window.location.href = "/login"}
					>
						Login
					</button>
				</div>
			</div>
			<main>
				<section className="hero" aria-labelledby="hero-title">
					<img src={couple} alt="Illustration of a couple" className="hero-img" />
					<h1 id="hero-title">Simple. Genuine. Community-driven.</h1>
					<div>
						<p className="hero-sub">KalyanaOne is a community-based matrimony app built with trust, simplicity, and<br className="desktop-only" /> user-first approach.</p>
					</div>
					<div className="hero-cta">
						<button
							className="register-btn"
							onClick={() => window.location.href = "/signup"}
						>
							Register now for free
						</button>
					</div>
					<div className="hero-disclaimer">
						{/* 3 months premium access worth <span style={{ textDecoration: "line-through", color: "#696969" }}>₹2,999</span> is unlocked at ₹0. */}
						1 year of premium access for ₹99 Only!
					</div>
					<div className="hero-disclaimer-note">
						<span style={{ color: "#000" }}>Note:</span>{" "}
						At present, KalyanaOne is onboarding members from Lingayath, Valmiki, Vokkaliga, Kuruba, Lamani and Brahmin
						<br className="desktop-only" />{" "}
						communities as part of a phased launch.
					</div>
				</section>

				<section className="why-section" aria-labelledby="why-title">
					<h2 id="why-title">Why KalyanaOne</h2>
					<h3 className="why-sub">Simple. Safe. Affordable.</h3>

					<div className="cards">
						<article className="card">
							<div>
								<div className="card-icon" aria-hidden>
									<span><img src={easyToUse} alt="Easy to Use" /></span>
								</div>
								<h4>Easy to Use</h4>
							</div>
							<div className="card-content">
								<p>A clean and simple app for everyone. No confusion, no complications.</p>
								<p>Simply register, complete your profile, and start finding your match.</p>
							</div>
						</article>

						<article className="card">
							<div>
								<div className="card-icon" aria-hidden>
									<span><img src={secureTrusted} alt="Secure & Trusted" /></span>
								</div>
								<h4>Secure &amp; Trusted</h4>
							</div>
							<div className="card-content">
								<p>All profiles are verified to keep your journey safe.</p>
								<p>Your privacy and trust come first, so you can connect with genuine people confidently.</p>
							</div>
						</article>

						<article className="card">
							<div>
								<div className="card-icon" aria-hidden>
									<span><img src={valueMoney} alt="Value for Money" /></span>
								</div>
								<h4>Value for Money</h4>
							</div>
							<div className="card-content">
								<p>Starts at only ₹99 per year*</p>
								<p>KalyanaOne gives you everything you need, no hidden costs or expensive upgrades.</p>
							</div>
						</article>
					</div>
				</section>

				<section className="early-access" aria-labelledby="early-access-title">
					<div className="early-card">
						<p className="early-badge" id="early-access-title">
							Early Member Privilege <br className="mobile-only" /> (₹99 for 1 year)✨
						</p>
						<p className="early-title">
							To help early members experience<br className="desktop-only" /> the platform fully,{" "}
							<span className="early-highlight">
								1 year of premium access worth <span className="early-strike">₹499</span> is unlocked at ₹99.
							</span>
						</p>
						<ul className="early-list">
							<li>Full access to premium features</li>
							<li>No upfront payment </li>
							<li>Limited-time early member benefit</li>
						</ul>
						<div className="early-cta">
							<button
								className="register-btn"
								onClick={() => window.location.href = "/signup"}
							>
								Register now for free!
							</button>
						</div>
						<p className="early-note">
							<span style={{ fontStyle: "normal" }}>⏳</span> This privilege is available only for eligible early users. Pricing below applies after the complimentary period.
						</p>
					</div>
				</section>

				<section className="pricing" aria-labelledby="pricing-title">
					<h2 className="pricing-title" id="pricing-title">Premium Plans and Pricing</h2>
					<h3 className="pricing-sub">Clear. Fair. Valuable.</h3>

					<div className="plan-cards">
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
									<li style={{ fontWeight: 500 }}>💡 Best for Starters</li>
									<li>💎 Maximum value, minimum cost</li>
									<li>❤️ Send 50 interests/requests per plan</li>
									<li>💰 Less than ₹9 / month</li>
									<li>🚀 Includes all premium features</li>
									<li>♾️ Unlimited profile search</li>
									<li>🎧 Priority customer support</li>
								</ul>
								<button className="upgrade-btn">
									Get Premium – ₹99/year only!
								</button>
							</div>
						</div>
					</div>

					<button
						onClick={() => setShowComparePlan(true)}
						className="compare-link"
					>
						Compare free and premium plans
					</button>
				</section>

				<section className="faq">
					<p className="faq-title">Frequently Asked Questions</p>
					<p className="faq-sub">Doubts? We Answer.</p>

					<ul>
						<li>
							1. Is KalyanaOne safe to use?
							<p>
								Yes. Every profile will be verified by Govt. ID.
								Only verified members can see phone number & email.
								Your details stay safe
							</p>
						</li>

						<li>
							2. How is KalyanaOne different from other matrimony apps?
							<p>
								Others charge extra for many features. KalyanaOne is simple – only ₹99 for 1 year.
								All features included. No hidden cost.
							</p>
						</li>

						<li>
							3. Can I search by name?
							<p>
								No. For safety, search is only with Profile ID.
								This keeps your details private.
							</p>
						</li>

						<li>
							4. Do I have to pay to use Kalyana?
							<p>
								Creating a profile is free. To access premium features like contact details, daily matches,
								and chat, you can upgrade to the affordable Premium Plan.
							</p>
						</li>

						<li>
							5. Will I really find matches from my community?
							<p>
								Yes. KalyanaOne is a community-based matrimony app, so you’ll see profiles from your own community first,
								making your search faster and more relevant.
							</p>
						</li>

						<li>
							6. Is my data safe?
							<p>
								Absolutely. We never sell or misuse your information.
								You control what details to show, and you can update privacy settings anytime.
							</p>
						</li>

						<li>
							7. How do I contact support if I face issues?
							<p>
								You can reach us directly by email <a href="mailto:hello@kalyana.one">hello@kalyana.one</a> or WhatsApp +91-9483979042.
								Our team is here to help you quickly.
							</p>
						</li>
					</ul>
				</section>

				<section className="get-app">
					<h2 className="get-app-title">Get the KalyanaOne App</h2>
					<div className="app-card">
						<div className="app-card-left">
							<div className="app-card-text">
								<h3>Start meaningful<br />connections anytime.</h3>
							</div>
							<div className="desktop-only">
								<a href="https://play.google.com/store/apps/details?id=com.OztaLabs.KalyanaOne&hl=en" className="play-badge" aria-label="Get it on Google Play">
									<img
										// src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
										src={googlePlayBadge}
										alt="Get it on Google Play"
									/>
								</a>
							</div>
						</div>
						<div className="app-card-right">
							<img
								src={qr}
								alt="QR code to download KalyanaOne app"
								className="app-qr"
							/>
							<p>Scan here to download</p>
						</div>
						<div className="mobile-only">
							<a
								className="play-badge"
								aria-label="Get it on Google Play"
								href="https://play.google.com/store/apps/details?id=com.OztaLabs.KalyanaOne&hl=en"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={googlePlayBadge}
									alt="Get it on Google Play"
								/>
							</a>
						</div>
					</div>
					<div className="footer-disclaimer">
						<div className="disclaimer-header">
							<span className="disclaimer-icon">⚠️</span>
							Disclaimer
						</div>
						<p>
							At KalyanaOne, we are committed to providing a simple, safe, and affordable matchmaking experience. However, we request users to kindly note the following:
						</p>
						<ol className="disclaimer-list">
							<li>
								Profile Information
								<ul>
									<li>All details provided by members are self-declared.</li>
									<li>While we verify phone/email for authenticity, we cannot guarantee the 100% accuracy of user-submitted information.</li>
								</ul>
							</li>
							<li>
								Safety &amp; Privacy
								<ul>
									<li>Please avoid sharing sensitive details (like financial or personal documents) until you are fully comfortable.</li>
									<li>Always meet in public places and inform your family/friends before meeting a match.</li>
									<li>We do not take responsibility for offline interactions outside our platform.</li>
								</ul>
							</li>
							<li>
								Subscriptions &amp; Payments
								<ul>
									<li>Subscription fees are non-refundable once a plan is activated.</li>
									<li>Plans are valid only for the selected duration and do not auto-renew unless specified.</li>
									<li>Prices are subject to change in the future, but existing users will always be informed in advance.</li>
								</ul>
							</li>
							<li>
								Platform Limitations
								<ul>
									<li>KalyanaOne is a connection platform, not a marriage guarantee service.</li>
									<li>Success depends on user participation, preferences, and mutual compatibility.</li>
									<li>We facilitate discovery, but final decisions rest solely with individuals and their families.</li>
								</ul>
							</li>
							<li>
								Support &amp; Reporting
								<ul>
									<li>Users can report fake/misleading profiles, and our team will take strict action.</li>
									<li>For help, please reach out to <a href="mailto:hello@kalyana.one">hello@kalyana.one</a> or via in-app chat.</li>
								</ul>
							</li>
						</ol>
						<p>
							By using KalyanaOne, you agree to these terms and acknowledge that your experience depends on trust, openness, and respect among all members.
						</p>
					</div>
				</section>

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
							&copy;{new Date().getFullYear()} Ozta Labs Pvt. Ltd.
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
			</main>
			<ComparePlan
				show={showComparePlan}
				onClose={() => setShowComparePlan(false)}
			/>
		</div>
	);
}
