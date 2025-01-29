import React from "react";
import styles from "./mission.module.css";

function Mission() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Mission</h2>
        </div>
        <div className={styles.text}>
          <p>
            Unificar la comunidad ecológica a nivel mundial, porque la
            comunicación genera evolución.
          </p>
          <p>
            Compartir buenos hábitos en todos los ámbitos de la vida cuotidiana,
            así como el consumo responsable y de proximidad, una educación
            multidisciplinar y el crecimiento personal.
          </p>
          <p>
            Fomentar las relaciones humanas, mediante eventos sociales,
            voluntariado y cooperativismo.
          </p>
          <p>
            Greenteam comienza con recursos muy limitados, por esta razón
            priorizamos las herramientas básicas para iniciar este largo camino
            de cambios hacia la sostenibilidad, pero tenemos muchas más ideas
            innovadoras a desarrollar que nos encantaría ofrecerles.
          </p>

          <p>
            El siguiente gran paso, será la ejecución de la app para móviles,
            para facilitar al usuario la publicación de sus pasos verdes, el uso
            de las herramientas y la comunicación con la comunidad. Mientras, no
            olvides poner un acceso directo en tu móvil.
          </p>
          <p>
            Como empresa comprometida con la sociedad, es muy importante para
            nosotros la comunicación entre el equipo de Greenteam y los
            usuarios, para satisfacer sus necesidades, implementar increíbles
            herramientas y seguir creciendo juntos. No dudes en proponernos
            nuevas metas o alianzas.
          </p>
        </div>
      </div>
    </>
  );
}

export default Mission;
