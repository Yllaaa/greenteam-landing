"use client";
import React, { useEffect, useState, useRef } from "react";
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
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
// import AddNew from "../../header/AddNew";

type Sections = "your posts" | "events" | "products" | "groups" | "pages";
function AllProfileBody(props: { username: string }) {
  const { username } = props;
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
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
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [username]);

  const [settings, setSettings] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className={styles.container}>
        {/* header */}
        <div className={styles.header}>
          <Header user={user} settings={settings} setSettings={setSettings} />
          {/* <AddNew /> */}
        </div>
        {/* filter */}
        {user.userData.isBlocked ? (
          <div className={styles.blocked}>
            <div className={styles.blockedContent}>
              <h1>User Blocked</h1>
              <p>You have blocked this user. Their content is not visible.</p>
              <button
                className={styles.unblockButton}
                onClick={() => {
                  // API call to unblock user
                  axios.delete(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/actions/unblock`, {

                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                      'Content-Type': 'application/json'
                    },
                    data: {
                      blockedId: user.userData.id,

                    }
                  })

                    .then(res => {
                      if (res.data) {
                        // Update local state
                        setUser(prev => ({
                          ...prev,
                          userData: {
                            ...prev.userData,
                            isBlocked: false
                          }
                        }));
                      }
                    })
                    .catch(err => console.error("Error unblocking user:", err));
                }}
              >
                Unblock User
              </button>
            </div>
          </div>
        ) : (
          !settings ? (
            <>
              <div className={styles.filterWrapper}>
                <div className={styles.filter}>
                  {sections.map((section) => (
                    <div
                      key={section.name}
                      style={{ cursor: "pointer" }}
                      className={`${styles.filterItem} ${currentSection === section.name
                        ? styles.active
                        : styles.notActive
                        }`}
                      onClick={() => setCurrentSection(section.name as Sections)}
                    >
                      <span>{section.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.body}>
                {user.isMyProfile && (
                  <div
                    style={{
                      position: "sticky",
                      display: currentSection === "your posts" ? "block" : "none"
                    }}
                    className={styles.side}
                    ref={sidebarRef}
                  >
                    <div className={styles.stickyContent}>
                      <Breif score={user.userScore} />
                    </div>
                  </div>
                )}
                <div className={`${currentSection === "your posts"
                  ? styles.mainBody
                  : styles.mainBodyWithoutSide
                  }`}>
                  {/* body content */}
                  {currentSection === "your posts" && <FeedSection />}
                  {currentSection === "events" && <EventSection user={user} />}
                  {currentSection === "products" && <ProductSection username={username} user={user} />}
                  {currentSection === "groups" && <Groups username={username} user={user} />}
                  {currentSection === "pages" && <Pages username={username} user={user} />}
                </div>
              </div>
            </>
          ) : (
            <Settings setSettings={setSettings} />
          )
        )}
      </div>
    </>
  );
}

export default AllProfileBody;