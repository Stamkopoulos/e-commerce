import { useNavigate } from "react-router-dom";
import i18n from "i18next";

export function useLangNavigate() {
  const navigate = useNavigate();

  return (path) => {
    const lang = i18n.language || "en";

    // support navigate(-1)
    if (typeof path === "number") {
      return navigate(path);
    }

    if (typeof path !== "string") {
      console.error("Invalid path:", path);
      return;
    }

    // avoid double prefix
    if (path.startsWith(`/${lang}`)) {
      return navigate(path);
    }

    navigate(`/${lang}${path}`);
  };
}
