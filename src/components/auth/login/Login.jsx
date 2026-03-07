import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Email from "./Email";
import "./Login.css";
import Phone from "./Phone";

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("email");
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {loginType === "email" && <Email setLoginType={setLoginType} />}
        {loginType === "phone" && <Phone setLoginType={setLoginType} />}
        <div
          className="new-user-btn"
          onClick={() => navigate("/signup")}
        >
          New User? Signup
        </div>
      </div>
    </div>
  );
}

export default Login;
