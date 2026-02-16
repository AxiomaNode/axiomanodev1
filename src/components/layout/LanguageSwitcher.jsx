import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage("uz")}
        className={i18n.language === "uz" ? "active" : ""}
      >
        O'z
      </button>
      <button
        onClick={() => changeLanguage("ru")}
        className={i18n.language === "ru" ? "active" : ""}
      >
        Рус
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={i18n.language === "en" ? "active" : ""}
      >
        Eng
      </button>
    </div>
  );
}