import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../hooks/useLangPath";

export default function Footer() {
  const { t } = useTranslation();
  const lp = useLangPath();

  return (
    <footer className="bottom-0 w-full bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-serif font-light tracking-wider mb-3 sm:mb-4">
              QLOSET
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>
          <div className="hidden md:block"></div>
          <div className="hidden lg:block"></div>
          <div className="text-center md:text-right">
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href={lp("/about")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={lp("/contact")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-700 text-muted-foreground">
            VOUTS&copy;{new Date().getFullYear()}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <Link
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.shipping")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
