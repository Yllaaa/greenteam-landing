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
      location: {
        city: {
          id: 0,
          nameEn: ""
        },
        country: {
          id: 0,
          name: ""
        },
      }
    },
    userScore: 0,
    isMyProfile: false,
  });

  // Sticky sidebar state
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    getProfileData(username)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [username]);

  // Handle scroll for sticky sidebar after 500px
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Make sidebar sticky after scrolling 500px
      if (scrollPosition >= 800) {
        setIsSidebarSticky(true);
      } else {
        setIsSidebarSticky(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call once to check initial position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to settings when settings becomes true
  useEffect(() => {
    if (settings && settingsRef.current) {
      settingsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [settings]);

  return (
    <>
      <div className={styles.container}>
        {/* header */}
        <div className={styles.header}>
          <Header user={user} settings={settings} setSettings={setSettings} />
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
                      display: currentSection === "your posts" ? "block" : "none",
                    }}
                    className={`${styles.side} ${isSidebarSticky ? styles.stickyActive : ''}`}
                    ref={sidebarRef}
                  >
                    <Breif score={user.userScore} />
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
            <div ref={settingsRef}>
              <Settings setSettings={setSettings} />
            </div>
          )
        )}
      </div>
    </>
  );
}

export default AllProfileBody;