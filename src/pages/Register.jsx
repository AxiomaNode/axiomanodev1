import { useTranslation } from "react-i18next";
import RegisterForm from "../components/auth/RegisterForm";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";
import ThemeToggle from "../components/layout/ThemeToggle";

export default function Register() {
  const { t } = useTranslation();

  return (
    <>
      <div className="header-controls">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      
      <div className="page register-page">
        <div className="auth-card">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "3rem" }}>🎓</span>
            <h1 style={{ marginTop: "12px" }}>{t("auth.register.title")}</h1>
          </div>
          
          <RegisterForm />
          
          <p style={{ textAlign: "center" }}>
            {t("auth.register.have_account")}{" "}
            <Link to="/login">{t("auth.register.login_link")}</Link>
          </p>
        </div>
      </div>
    </>
  );
}