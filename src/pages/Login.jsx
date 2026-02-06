import { useTranslation } from "react-i18next";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="page login-page">
      <LanguageSwitcher />

      <div className="auth-card">
        <h1>{t("login.title")}</h1>
        <LoginForm />
        <p>
          {t("login.no_account")}{" "}
          <Link to="/register">{t("login.register")}</Link>
        </p>
      </div>
    </div>
  );
}