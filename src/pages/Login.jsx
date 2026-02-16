import { useTranslation } from "react-i18next";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";
import ThemeToggle from "../components/layout/ThemeToggle";
import logo from "../img/axiomaLogo.png"

export default function Login() {
  const { t } = useTranslation();

  return (
    <>
      <LanguageSwitcher />
      <ThemeToggle />
      
      <div className="page login-page">
        <div className="auth-card">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "3rem" }}>
               <img src={logo} alt="" className="login-logo" /> 
            </span>
            <h1 style={{ marginTop: "12px" }}>{t("auth.login.title")}</h1>
          </div>
          
          <LoginForm />
          
          <p style={{ textAlign: "center" }}>
            {t("auth.login.no_account")}{" "}
            <Link to="/register">{t("auth.login.register_link")}</Link>
          </p>
        </div>
      </div>
    </>
  );
}