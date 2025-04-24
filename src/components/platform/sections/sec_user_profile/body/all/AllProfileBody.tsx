"use client";
import React, { useEffect, useState } from "react";
import styles from "./allProfileBody.module.scss";
import { getProfileData, ProfileResponse } from "./all.data";
import Header from "../../header/Header";
import FeedSection from "../posts/feeds/FeedSection";
import EventSection from "../posts/Events/EventSection";
import ProductSection from "../posts/products/ProductSection";
import Groups from "../groups/Groups";
import Pages from "../pages/Pages";
import Breif from "./side/Breif";
import Settings from "../settings/Settings";

type Sections = "your posts" | "events" | "products" | "groups" | "pages";
function AllProfileBody(props: { username: string }) {
  const { username } = props;
  const sections = [
    { name: "your posts", icon: "" },
    { name: "events", icon: "" },
    { name: "products", icon: "" },
    { name: "groups", icon: "" },
    { name: "pages", icon: "" },
  ];
  const [currentSection, setCurrentSection] = useState<Sections>("your posts");
  const [user, setUser] = useState<ProfileResponse>({
    userData: {
      id: "",
      fullName: "",
      username: "",
      avatar: "",
      cover: "",
      bio: "",
      joinedAt: "",
      isFollowing: false,
      isFollower: false,
      isBlocked: false,
    },
    userScore: 0,
    isMyProfile: false,
  });

  useEffect(() => {
    getProfileData(username)
      .then((data) => {
        console.log(data);

        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [username]);
  const [settings, setSettings] = useState(false);
  return (
    <>
      <div className={styles.container}>
        {/* header */}
        <div className={styles.header}>
          <Header user={user} settings={settings} setSettings={setSettings} />
        </div>
        {/* filter */}
        {!settings ? (
          <>
            <div className={styles.filter}>
              {sections.map((section) => (
                <div
                  key={section.name}
                  className={`${styles.filterItem} ${
                    currentSection === section.name
                      ? styles.active
                      : styles.notActive
                  }`}
                  onClick={() => setCurrentSection(section.name as Sections)}
                >
                  <span>{section.name}</span>
                </div>
              ))}
            </div>
            <div className={styles.body}>
              {user.isMyProfile && (
                <div className={styles.side}>
                  <Breif score={user.userScore} />
                </div>
              )}
              <div className={styles.mainBody}>
                {/* body content */}
                {currentSection === "your posts" && <FeedSection />}
                {currentSection === "events" && <EventSection />}
                {currentSection === "products" && <ProductSection />}
                {currentSection === "groups" && <Groups username={username} />}
                {currentSection === "pages" && <Pages username={username} />}
              </div>
            </div>
          </>
        ) : (
          <>
            <Settings />
          </>
        )}
      </div>
    </>
  );
}

export default AllProfileBody;
