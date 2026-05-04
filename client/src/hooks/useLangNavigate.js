import { useNavigate, useParams } from "react-router-dom";

export function useLangNavigate() {
  const navigate = useNavigate();
  const { lang = "en" } = useParams();

  return (path) => {
    // Avoid double lang prefix
    if (path.startsWith(`/${lang}`)) return navigate(path);
    navigate(`/${lang}${path}`);
  };
}
