import { useEffect } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SUPPORTED_LANGS = ["en", "gr"];

function LanguageWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation(); // hook always called first

  useEffect(() => {
    if (SUPPORTED_LANGS.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  // conditional return AFTER all hooks
  if (!SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to="/en" replace />;
  }

  return <Outlet />;
}

export default LanguageWrapper;
