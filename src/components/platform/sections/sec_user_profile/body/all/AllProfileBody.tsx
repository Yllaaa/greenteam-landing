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

  // Scroll-related state
  const [briefTransform, setBriefTransform] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [initialBriefTop, setInitialBriefTop] = useState(0);

  useEffect(() => {
    getProfileData(username)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [username]);

  // Handle scroll for sticky Brief
  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !filterRef.current || currentSection !== "your posts" || !user.isMyProfile) return;

      const scrollY = window.scrollY;
      // const filterBottom = filterRef.current.getBoundingClientRect().bottom;
      const sidebarRect = sidebarRef.current.getBoundingClientRect();

      // Initialize the initial position if not set
      if (initialBriefTop === 0 && scrollY < 10) {
        setInitialBriefTop(sidebarRect.top + scrollY);
      }

      // Calculate how much to translate the Brief
      // We want it to stick when the filter is at the top of the viewport
      const filterHeight = filterRef.current.offsetHeight;
      // const targetTop = filterBottom + 20; // 20px gap below filter

      if (scrollY > initialBriefTop - filterHeight - 20) {
        // Calculate the transform needed to keep Brief in view
        const translateAmount = scrollY - (initialBriefTop - filterHeight - 20);
        setBriefTransform(translateAmount);
      } else {
        setBriefTransform(0);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection, user.isMyProfile, initialBriefTop]);

  const [settings, setSettings] = useState(false);

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
              <div className={styles.filterWrapper} ref={filterRef}>
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
                      transform: `translateY(${briefTransform}px)`,
                      transition: 'none', // Disable transition for smooth scrolling
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