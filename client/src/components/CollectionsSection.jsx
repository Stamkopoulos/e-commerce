import CollectionCard from "./CollectionCard";
import { useTranslation } from "react-i18next";

export default function CollectionsSection() {
  const { t } = useTranslation();
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-wide mb-2">
          {t("collections.title")}
        </h2>
        <p className="text-muted-foreground">{t("collections.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <CollectionCard
          title={t("collections.men")}
          category="men"
          image="https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png"
        />

        <CollectionCard
          title={t("collections.women")}
          category="women"
          image="https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png"
        />

        <CollectionCard
          title={t("collections.accessories")}
          category="accessories"
          image="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
        />
      </div>
    </section>
  );
}
