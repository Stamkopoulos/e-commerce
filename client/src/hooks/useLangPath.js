// src/hooks/useLangPath.js
import { useParams } from "react-router-dom";

export function useLangPath() {
  const { lang = "en" } = useParams();

  return (path) => `/${lang}${path}`;
}
