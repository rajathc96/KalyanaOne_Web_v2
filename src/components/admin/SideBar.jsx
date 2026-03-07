import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import heart1 from "../../assets/icons/heart.svg";
import heart2 from "../../assets/icons/heart2.svg";
import home2 from "../../assets/icons/home.svg";
import home1 from "../../assets/icons/home2.svg";
import mail1 from "../../assets/icons/mail.svg";
import mail2 from "../../assets/icons/mail2.svg";
import search1 from "../../assets/icons/search.svg";
import search2 from "../../assets/icons/search2.svg";
import user1 from "../../assets/icons/user.svg";
import user2 from "../../assets/icons/user2.svg";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 0, defaultImg: home1, activeImg: home2, alt: "Home", path: "/admin/all-users" },
    // {
    //   id: 1,
    //   defaultImg: heart1,
    //   activeImg: heart2,
    //   alt: "Heart",
    //   path: "/notifications",
    // },
    {
      id: 2,
      defaultImg: mail1,
      activeImg: mail2,
      alt: "Mail",
      path: "/admin/verify-user-selfie",
    },
    // {
    //   id: 4,
    //   defaultImg: user1,
    //   activeImg: user2,
    //   alt: "User",
    //   path: "/profile",
    // },
  ];

  return (
    <>
      <aside className={`sidebar`}>
        <div className="sidebar-icons">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-icon ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => {
                if (location.pathname !== item.path)
                  navigate(item.path)
              }}
            >
              <img
                src={
                  location.pathname === item.path
                    ? item.activeImg
                    : item.defaultImg
                }
                alt={item.alt}
                className="sidebar-image"
              />
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export default SideBar;
