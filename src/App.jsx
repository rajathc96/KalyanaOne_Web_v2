import { useEffect, useState } from "react";
import { LogOut, Settings as SettingsIcon } from "react-feather";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { clientAuth } from "../firebase.js";
import "./App.css";
import barchartActive from "./assets/barchart-active.svg";
import barchart from "./assets/barchart.svg";
import inviteLogo from "./assets/icons/invite_logo.svg";
import LoaderScreen from "./assets/icons/LoaderScreen.svg";
import logo from "./assets/logo.svg";
import ChildSafety from "./components/agreements/ChildSafety.jsx";
import HelpTerms from "./components/agreements/HelpTerms.jsx";
import PaymentPolicy from "./components/agreements/PaymentPolicy.jsx";
import PrivacyPolicy from "./components/agreements/PrivacyPolicy.jsx";
import TermsAndConditions from "./components/agreements/TermsAndConditions.jsx";
import UserAgreement from "./components/agreements/UserAgreement.jsx";
import ForgotPassword from "./components/auth/forgot-password/ForgotPassword.jsx";
import ForgotPasswordPassword from "./components/auth/forgot-password/ForgotPasswordPassword.jsx";
import Login from "./components/auth/login/Login";
import Detail from "./components/auth/signup/details/Detail";
import Password from "./components/auth/signup/Password";
import Signup from "./components/auth/signup/Signup";
import Home from "./components/home/Home";
import Insights from "./components/insights/Insights";
import LandingPage from "./components/landing/LandingPage.jsx";
import Messages from "./components/messages/Messages";
import Navbar from "./components/navbar/Navbar";
import Notification from "./components/notifications/Notification";
import OthersProfile from "./components/othersProfile/OthersProfile";
import OthersProfileSingle from "./components/othersProfile/OthersProfileSingle";
import Premium from "./components/premium/Premium";
import Profile from "./components/profile/Profile";
import Search from "./components/search/Search";
import AccountSettings from "./components/settings/AccountSettings";
import AddPhotos from "./components/settings/AddPhotos/AddPhotos";
import ContactDetails from "./components/settings/ContactDetails";
import EditProfile from "./components/settings/EditProfile/EditProfile";
import Help from "./components/settings/Help/Help";
import NotificationSettings from "./components/settings/NotificationSettings/NotificationSettings";
import PartnerPreference from "./components/settings/PartnerPreference/PartnerPreference";
import PlanDetails from "./components/settings/planDetails/PlanDetails";
import PoliciesAgreement from "./components/settings/PoliciesAgreement/PoliciesAgreement.jsx";
import PrivacySettings from "./components/settings/PrivacySettings/PrivacySettings";
import ProfileVerification from "./components/settings/ProfileVerification/ProfileVerification.jsx";
import Settings from "./components/settings/Settings";
import RequestDataDeletion from "./components/support/RequestDataDeletion.jsx";
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
import CastePopup from "./models/CastePopup/CastePopup.jsx";
import Invite from "./models/Invite/Invite.jsx";
import "./models/RightSheet/RightSheet.css";
import Admin from "./components/admin/Admin.jsx";
import handleLogout from "./clientFunctions/logout.js";
import AllUsers from "./components/admin/AllUsers.jsx";
import SideBar from "./components/admin/SideBar.jsx";
import AdminOthersProfile from "./components/admin/AdminOthersProfile.jsx";

function App() {
  const { user, loading } = useAuth();
  const [hideNavbarPaths, setHideNavbarPaths] = useState(["/login", "/signup", "/details", "/admin"]);
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [isCastePopupVisible, setIsCastePopupVisible] = useState(false);
  const [isInvitePopupVisible, setIsInvitePopupVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/home" ||
      location.pathname === "/details" ||
      location.pathname === '/terms-and-conditions' ||
      location.pathname === '/privacy-policy' ||
      window.location.pathname === '/child-safety-and-protection-policy' ||
      location.pathname.startsWith('/refund-policy') ||
      location.pathname.startsWith('/help') ||
      location.pathname.startsWith('/user-agreement') ||
      location.pathname.startsWith('/support')
    ) {
      setShow(true);
    } else {
      setShow(false);
    }

  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth < 768 && location.pathname === "/premium") {
      setHideNavbarPaths([...hideNavbarPaths, "/premium"]);
    }
  }, [location.pathname]);

  function PublicOnlyLayout() {
    const { user } = useAuth();
    if (user) return <Navigate to="/home" replace />;

    return <Outlet />;
  }

  function AdminRoute() {
    const { user } = useAuth();
    if (!user)
      return <Navigate to="/" replace state={{ from: location }} />;
    if (user?.claims?.admin !== true)
      return <Navigate to="/" replace state={{ from: location }} />;

    return (
      <>
        <SideBar />
        <Outlet />
      </>
    );
  }

  function RequireAuth() {
    const { user } = useAuth();
    if (!user)
      return <Navigate to="/" replace state={{ from: location }} />;
    if (user?.claims?.profileNotCreated && location.pathname !== "/details")
      return <Navigate to="/details" replace />;
    if (user?.claims?.admin === true)
      return <Navigate to="/admin/all-users" replace />;

    return (
      <>
        {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
        <Outlet />
      </>
    );
  }

  return (
    <div className="app">
      <header className={`header ${location.pathname === "/" ? "not-show" : "show"}`}>
        {!loading && <div className={`logo ${show ? "" : "not-show"}`}>
          <img src={logo} alt="KalyanaOne Logo" className="logo-img" onClick={() => navigate("/home")} style={{ cursor: "pointer" }} />
          <span className="logo-text" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>KalyanaOne</span>
          {user?.claims?.profileNotCreated !== true && user?.claims?.admin !== true && <span className="caste-code" onClick={() => setIsCastePopupVisible(true)}>
            {clientAuth?.currentUser?.uid.split("").slice(1, 4).join("")}
          </span>}
        </div>}
        {user && (user?.claims?.profileNotCreated !== true && user?.claims?.admin !== true) ? (
          <div className="header-icons">
            <img src={inviteLogo} alt="Invite" className="header-icon-img" onClick={() => setIsInvitePopupVisible(true)} />
            {location.pathname === "/insights" ?
              <img src={barchartActive} alt="Icon 1" className="header-icon-img" onClick={() => navigate("/insights")} />
              :
              <img src={barchart} alt="Icon 1" className="header-icon-img" onClick={() => navigate("/insights")} />}
            <SettingsIcon
              className="header-icon-img"
              cursor="pointer"
              onClick={() => navigate("/settings")}
              color={location.pathname.startsWith("/settings") ? "#FF025B" : "#696969"}
            />
          </div>
        ) :
          user && user?.claims?.profileNotCreated !== true && <div className="header-icons">
            <LogOut
              style={{ cursor: "pointer" }}
              onClick={handleLogout}
            />
          </div>
        }
      </header>

      {loading ? (
        <div className="loading-screen">
          <img
            src={LoaderScreen}
            width={150}
            height={150}
            alt="Loading..."
            className="loading-icon"
          />
        </div>
      ) : (
        <div className="main-content" style={location.pathname === "/" ? { marginTop: 0 } : {}}>
          <AppProvider>
            <Routes>
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/user-agreement" element={<UserAgreement />} />
              <Route path="/refund-policy" element={<PaymentPolicy />} />
              <Route path="/help" element={<HelpTerms />} />
              <Route path="/child-safety-and-protection-policy" element={<ChildSafety />} />
              <Route path="/support/request-data-deletion" element={<RequestDataDeletion />} />
              <Route path="/support/request-delete-account" element={<RequestDataDeletion />} />

              <Route element={<PublicOnlyLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup/password" element={<Password />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/forgot-password/password" element={<ForgotPasswordPassword />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin/all-users" element={<AllUsers />} />
                <Route path="/admin/verify-user-selfie" element={<Admin />} />
                <Route path="/admin/other-profile/:profileId" element={<AdminOthersProfile />} />
              </Route>
              <Route element={<RequireAuth />}>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/otherProfile/:profileId" element={<OthersProfile />} />
                <Route path="/other-profile/:profileId" element={<OthersProfileSingle />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/settings/edit-profile"
                  element={<EditProfile />}
                />
                <Route
                  path="/settings/partner-preference"
                  element={<PartnerPreference />}
                />
                <Route path="/settings/add-photos" element={<AddPhotos />} />
                <Route
                  path="/settings/contact-details"
                  element={<ContactDetails />}
                />
                <Route
                  path="/settings/profile-verification"
                  element={<ProfileVerification />}
                />
                <Route
                  path="/settings/privacy-settings"
                  element={<PrivacySettings />}
                />
                <Route
                  path="/settings/notification-settings"
                  element={<NotificationSettings />}
                />
                <Route
                  path="/settings/account-settings"
                  element={<AccountSettings />}
                />
                <Route path="/settings/plandetails" element={<PlanDetails />} />
                <Route path="/settings/help" element={<Help />} />
                <Route path="/settings/policies-agreement" element={<PoliciesAgreement />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/messages/*" element={<Messages />} />
                <Route path="/search" element={<Search />} />
                <Route path="/details" element={<Detail />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/premium" element={<Premium />} />
              </Route>

            </Routes>
          </AppProvider>
          <CastePopup
            show={isCastePopupVisible}
            onClose={() => setIsCastePopupVisible(false)}
          />
          <Invite
            show={isInvitePopupVisible}
            onClose={() => setIsInvitePopupVisible(false)}
          />

        </div>
      )}
    </div>
  );
}

export default App;
