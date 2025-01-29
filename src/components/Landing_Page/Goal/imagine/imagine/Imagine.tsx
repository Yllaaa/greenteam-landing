import React from "react";
import styles from "./imagine.module.css";

import goal1 from "@/../public/goals/goal1.jpeg";
import goal2 from "@/../public/goals/goal2.jpeg";
import goal3 from "@/../public/goals/goal3.jpeg";
import Image from "next/image";

function Imagine() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Imagine a sustainable World</h2>
        </div>
        <div className={`${styles.imgRight} ${styles.imgfirst}`}>
          <div className={styles.text}>
            <p>METAS DE DESARROLLO SOSTENIBLE:</p>
            <p>
              Camino a la sostenibilidad: el equipo de Greenteam proponemos un
              modelo alternativo de producción, distribución y consumo, para
              orientar el camino hacia la sostenibilidad.
            </p>
            <p>
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
            </p>
          </div>
          <div className={styles.img}>
            <Image src={goal1} alt="goal1" />
          </div>
        </div>
        <div className={`${styles.imgLeft} ${styles.imgmid}`}>
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
        </div>
      </div>
    </>
  );
}

export default Imagine;
