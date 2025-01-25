"use client";
import React from "react";
import styles from "./history.module.css";
import Image from "next/image";
import big from "@/../public/about/history.jpeg";
import LoadingTree from "@/components/zaLoader/LoadingTree";

const History: React.FC = () => {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>History</h2>
      <div className={styles.content}>
        <p>{`A Young Adventurer's Journey`}</p>
        <p>
          A young adventurer, born on the shores of the Mediterranean Sea during
          times of change and technological development, spends his youth
          observing the world: nature, people, his companions, and his family.
        </p>
        <p>
          After witnessing the reality of our society, where individualism,
          competitiveness, inequality, and the obsession with accumulating money
          prevail, his hopes for a better world diminish daily.
        </p>
        <p>
          Unsure of what he wanted to dedicate himself to—what he wanted to give
          his life’s time to—the young man embarks on a long hitchhiking journey
          to understand the world’s reality from the streets. To his surprise,
          after nearly a year of traveling and visiting more than 18 countries,
          he discovers something:
        </p>
        <p>People are generally good. We like helping others.</p>
        <p>
          But after the journey ends, the world keeps turning, and everything
          continues as it was: heading toward the destruction of the planet,
          nature, and all the systems that sustain life. To better understand
          these systems, the young man studies veterinary medicine, human
          medicine, and the agricultural-livestock industry.
        </p>
        <p>{`On the verge of giving up, he notices a glimmer of light in the darkness: the ecological community. Hundreds of people are starting environmentally responsible businesses, forming consumer cooperatives, conducting studies, and searching for solutions to this reality.`}</p>
        <p>{`Excited, the young man learns about the movements of degrowth, sustainable development, circular economy, permaculture, and the creation of eco-villages. These movements advocate for policies such as consuming local products, diversifying production, using renewable energy, building with natural materials, creating durable tools and products, and reducing plastic usage`}</p>
        <p>{`Once he studies the basic concepts of sustainable development, the young man contemplates the best direction for transitioning to a sustainable system.`}</p>
        <p>{`After a few months, he finds the solution: forming communities and repopulating villages near the sources of river basins, committing to their care to allow downstream communities to use the water. This results in self-sufficient valleys that are environmentally responsible.`}</p>
        <p>{`Given the difficulty of implementing this development methodology on a global scale, the young man starts his own project at the foot of a nature reserve.`}</p>
        <p>{`As he begins developing food self-sufficiency, bioconstruction, renewable energy sources, and potable water systems, he realizes something: You need a community! It’s too much knowledge, experience, and work for a small group of people.`}</p>
        <p>{`Although there is great interest in these movements on social media, the young man found himself almost alone in the face of the challenges of change. Faced with this reality, as they say in Barcelona, "s’ha acabat el bróquil" (enough is enough).`}</p>
        <p>{`The united ecological community can change the productive, social, and economic system. Deep down, people are good, and life on the planet needs us to take action.`}</p>
        <p>{`Currently, communication, information, consumption, and events are organized through social media, which, by manipulating these factors, shapes society’s habits without us realizing it. The ecological community has more than enough foundation to create a conscious social network that accelerates development toward balance and equity.`}</p>
        <p>{`After this long journey, the idea of GREENTEAM emerges.`}</p>
        <p>{`Time to Act, No Time to Waste`}</p>
        <p>{`Through the association of this young man, a web programmer, and a graphic designer, the creation of Greenteam.app becomes possible: the conscious social network, the united ecological community.`}</p>
        <p>{`Thanks to small personal donations, support from conscious projects, businesses, and companies, and voluntary user registrations, the Greenteam team takes responsibility for making good use of the acquired resources to carry out this noble task toward environmental and social balance.`}</p>
        <p>{`It is a pleasure to work for you and, finally, to co-create freely with our community—the conscious community.`}</p>
        <p>{`We are all GREENTEAM!`}</p>
        <p>{`BECOME A MEMBER NOW!!!!`}</p>
      </div>
      {!loaded && (
        <div className={styles.imageContainer}>
          <LoadingTree />
        </div>
      )}
      <div className={styles.imageContainer}>
        <Image
          src={big}
          alt="history"
          loading="lazy"
          onLoad={() => {
            setLoaded(true);
          }}
        />
      </div>
    </div>
  );
};

export default History;
