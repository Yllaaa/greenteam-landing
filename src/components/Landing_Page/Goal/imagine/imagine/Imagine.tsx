"use client"
import React from "react";
import styles from "./imagine.module.css";

import goal1 from "@/../public/goals/goals.jpg";
import categories from "@/../public/goals/categories.jpg";
// import goal2 from "@/../public/goals/goal2.jpeg";
// import goal3 from "@/../public/goals/goal3.jpeg";
import Image from "next/image";
import { useTranslations } from "next-intl";

function Imagine() {
  const t = useTranslations("landing.imagine");
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t("imagine")}</h2>
        </div>
        <div className={`${styles.imgRight} ${styles.imgfirst}`}>
          <div className={styles.text}>
            <p>{t("objective")}</p>
            <ul>
              <li><span>{t("unificar")}:{" "}</span>{t("unificarText")}</li>
              <li><span>{t("compatir")}:{" "}</span>{t("compatirText")}</li>
              <li><span>{t("fomentar")}:{" "}</span>{t("fomentarText")}</li>
              <li><span>{t("ciudades")}:{" "}</span>{t("ciudadesT")}</li>
              <li><span>{t("pueblos")}:{" "}</span>{t("pueblosT")}</li>
              <li><span>{t("comunidades")}:{" "}</span>{t("comunidadesT")}</li>
            </ul>
            <p>
              {t("paragraph")}
            </p>
            {/* <p>
              Fomentar las relaciones humanas, mediante eventos sociales,
              voluntariado y cooperativismo.
            </p>
            <p>
              Las distintas organizaciones sociales en el territorio, las
              clasificamos en 3:
            </p>
            <p>
              Comunidades: grupo de personas reducido que viven en ambiente
              rural
            </p>
            <p>
              Pueblos: aglomeraciones más grandes de población en zonas rurales.
            </p>
            <p>
              Ciudades: gran aglomeración de población en zonas urbanas y
              periurbanas.
            </p> */}
          </div>
          <div className={styles.img}>
            <Image src={goal1} alt="goal1" />
          </div>
        </div>
        {/* <div className={`${styles.imgLeft} ${styles.imgmid}`}>
          <div className={styles.img}>
            <Image src={goal2} alt="goal2" />
          </div>
          <div className={styles.text}>
            <p>
              La autosuficiencia alimentaria, sobre todo de frutas, verduras y
              hiervas, con venta de proximidad de los productos. También
              podríamos incluir la producción de carne, leche y huevo.
            </p>
            <p>
              Procesamiento artesanal de materias primas alimentarias, tales
              como la panadería, derivados lácteos, embutidos, conservas y
              comidas preparadas.
            </p>
            <p>
              Entretenimiento local, donde los artistas locales promueven el
              bienestar comunitario.
            </p>
            <p>
              Artesanos especializados en construir y reparar utensilios y
              herramientas, por ejemplo: la sastrería, albañilería, soldadura,
              mecánica y electrónica.
            </p>
          </div>
        </div>
        <div className={`${styles.imgRight} ${styles.imglast}`}>
          <div className={styles.text}>
            <p>
              Educación adaptada para promover el crecimiento personal, el
              cooperativismo y el aprendizaje multidisciplinar.
            </p>
            <p>Captación de energías renovables y agua.</p>
            <p>
              Los distintos asentamientos deben disponer de áreas comunitarias,
              así como un mercado, un domo/vestíbulo, cancha para deportes y un
              área natural.
            </p>
          </div>
          <div className={styles.img}>
            <Image src={goal3} alt="goal3" />
          </div>
        </div> */}
      </div>
      <div className={styles.categories}>
        <Image src={categories} alt="categories" />
        <div className={styles.text}>
          <div className={styles.header}>
            <h2>{t("imagine")}</h2>
          </div>
          <ul>
            {/* <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.ciudades")}:{" "}</span>
                </p>
                <p>
                {t("category.ciudadesT")}
                </p>
              </div>
            </li>
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.pueblos")}:{" "}</span>
                </p>
                <p>
                {t("category.pueblosT")}
                </p>
              </div>
            </li>
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.comunidades")}:{" "}</span>
                </p>
                <p>
                {t("category.comunidadesT")}
                </p>
              </div>
            </li> */}
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.salud")}:{" "}</span>
                </p>
                <p>
                {t("category.saludT")}
                </p>
              </div>
            </li>
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.mental")}:{" "}</span>
                </p>
                <p>
                {t("category.mentalT")}
                </p>
              </div>
            </li>
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.arte")}:{" "}</span>
                </p>
                <p>
                {t("category.arteT")}
                </p>
              </div>
            </li>
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.bio")}:{" "}</span>
                </p>
                <p>
                {t("category.bioT")}
                </p>
              </div>
            </li>
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.valores")}:{" "}</span>
                </p>
                <p>
                {t("category.valoresT")}
                </p>
              </div>
            </li>
            <li>
              <div className={styles.category}>
                <p>
                  <span>{t("category.naturaleza")}:{" "}</span>
                </p>
                <p>
                {t("category.naturalezaT")}
                </p>
              </div>
            </li>
           
          </ul>
          <p>
            {t("paragraph")}
          </p>
        </div>
      </div>
    </>
  );
}

export default Imagine;
