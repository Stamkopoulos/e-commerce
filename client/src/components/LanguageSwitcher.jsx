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
    const newPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(newPath);
  };

  return (
    <div className="flex items-center gap-1 border border-gray-300 rounded-full px-1 py-0.5">
      {languages.map(({ code, label }, index) => (
        <span key={code} className="flex items-center">
          <button
            onClick={() => switchLanguage(code)}
            className={`text-xs font-medium px-2 py-1 rounded-full transition-all ${
              lang === code
                ? "bg-black text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {label}
          </button>
          {/* Divider between buttons */}
          {index < languages.length - 1 && (
            <span className="text-gray-300 text-xs">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
