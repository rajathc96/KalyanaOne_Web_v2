import { useState } from "react";
import "../login/Login.css";
import Email from "./Email";
import Phone from "./Phone";

function Signup() {
  const [loginType, setLoginType] = useState("phone");

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Sign up</h2>
        {loginType === "phone" && <Phone setLoginType={setLoginType} />}
        {loginType === "email" && <Email />}

      </div>
    </div>
  );
}

export default Signup;
