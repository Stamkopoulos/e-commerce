// src/components/LanguageSwitcher.jsx
import { useNavigate, useParams, useLocation } from "react-router-dom";

const languages = [
  { code: "en", label: "English" },
  { code: "gr", label: "Ελληνικά" },
];

function LanguageSwitcher() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const switchLanguage = (newLang) => {
    // Replace the lang segment in the current URL
    const newPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(newPath);
  };

  return (
    <div>
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLanguage(code)}
          style={{ fontWeight: lang === code ? "bold" : "normal" }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
