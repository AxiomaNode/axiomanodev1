import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation();

  return (
    <div className="page-center">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <h2>{t("common.loading")}</h2>
      </div>
    </div>
  );
}