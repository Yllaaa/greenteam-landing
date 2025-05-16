// "use client";
// import React, { useEffect } from "react";
// import styles from "./header.module.scss";
// import Image from "next/image";
// import cover from "@/../public/ZPLATFORM/groups/cover.png";
// import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
// import { ProfileResponse } from "../body/all/all.data";
// import { HiDotsVertical } from "react-icons/hi";
// import { IoMdSettings } from "react-icons/io";
// import axios from "axios";
// import { getToken } from "@/Utils/userToken/LocalToken";
// import ToastNot from "@/Utils/ToastNotification/ToastNot";
// import Report from "./modal/addNew/Report";
// import { FaX } from "react-icons/fa6";
// import AddNew from "./AddNew";

// function Header(props: {
//   user: ProfileResponse;
//   setSettings: React.Dispatch<React.SetStateAction<boolean>>;
//   settings: boolean;
// }) {
//   const { user, setSettings, settings } = props;
//   const [open, setOpen] = React.useState(false);
//   const token = getToken();
//   const accesstoken = token ? token.accessToken : null;
//   const [isFollowed, setIsFollowed] = React.useState(false);
//   useEffect(() => {
//     if (user.userData) setIsFollowed(user.userData.isFollowing);
//   }, [user.userData]);
//   const handleClick = () => {
//     setOpen(!open);
//   };
//   const [isBlocked, setIsBlocked] = React.useState(user.userData.isBlocked);
//   const handleBlock = () => {
//     axios
//       .get(
//         `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/actions/${isBlocked ? "unblock" : "block"
//         }/${user.userData.id}`,

//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((response) => {
//         console.log(response.data);
//         setIsBlocked(!isBlocked);
//       })
//       .catch((error) => {
//         console.error("Error blocking/unblocking user:", error);
//       });
//   };
//   const handleSettingNavigation = () => {
//     if (setSettings) setSettings(!settings);
//   };
//   const handleFollow = () => {
//     axios
//       .post(
//         `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${user.userData.username}/toggle-follow`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${accesstoken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((res) => {
//         setIsFollowed(!isFollowed);
//         console.log(res.data);
//         ToastNot("success");
//       })
//       .catch((err) => {
//         console.log(err);
//         ToastNot("error");
//       });
//   };
//   const [report, setReport] = React.useState(false);

//   return (
//     <>
//       <div className={styles.container}>
//         <div className={styles.cover}>
//           <Image
//             src={user.userData.cover ? user.userData.cover : cover}
//             alt={user.userData.username}
//             width={1000}
//             height={1000}
//             className={styles.coverImg}
//           />
//         </div>
//         <div className={styles.userInfo}>
//           <div className={styles.user}>
//             <div className={styles.avatar}>
//               <Image
//                 src={user.userData.avatar ? user.userData.avatar : noAvatar}
//                 alt={user.userData.username}
//                 width={200}
//                 height={200}
//                 className={styles.avatarImg}
//               />
//             </div>

//             <div className={styles.name}>
//               <p>{user.userData.fullName}</p>
//             </div>
//             {user.isMyProfile ? null : (
//               <div className={styles.visitor}>
//                 <button onClick={handleFollow} className={styles.follow}>
//                   {isFollowed ? "Following" : "Unfollow"}
//                 </button>
//                 <button className={styles.message}>Send Message</button>
//               </div>
//             )}

//             <div className={styles.bio}>
//               <p>{user.userData.bio ? user.userData.bio : "No bio yet!"}</p>
//             </div>
//           </div>
//           <div className={styles.userActions}>
//             {user.isMyProfile ? (
//               <div
//                 onClick={handleSettingNavigation}
//                 className={styles.settings}
//               >
//                 {settings ? <FaX /> : <IoMdSettings />}

//               </div>
//             ) : (
//               <div className={styles.droplist}>
//                 <div onClick={handleClick} className={styles.options}>
//                   <HiDotsVertical />
//                 </div>
//                 <div
//                   className={`${styles.dropDown} ${open ? styles.active : styles.notActive
//                     }`}
//                 >
//                   <p onClick={() => setReport(true)}>Report</p>
//                   <p
//                     onClick={handleBlock}
//                     style={{ color: "red", cursor: "pointer" }}
//                   >
//                     {isBlocked ? "Unblock" : "Block"}
//                   </p>
//                   <button>Confirm</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {user.isMyProfile && <AddNew/>}
//       {report && (
//         <Report
//           setReport={setReport}
//           user={user.userData.username}
//           reportedId={user.userData.id}
//           reportedType="user"
//           report={report}
//         />
//       )}
//     </>
//   );
// }

// export default Header;
// Header.jsx (modified version)
"use client";
import React, { useEffect, useState } from "react";
import styles from "./header.module.scss";
import Image from "next/image";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { ProfileResponse } from "../body/all/all.data";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import Report from "./modal/addNew/Report";
import { FaX } from "react-icons/fa6";
import AddNew from "./AddNew";
import Modal from "./modal/newAdd/Modal";

function Header(props: {
  user: ProfileResponse;
  setSettings: React.Dispatch<React.SetStateAction<boolean>>;
  settings: boolean;
}) {
  const { user, setSettings, settings } = props;
  const [open, setOpen] = React.useState(false);
  const token = getToken();
  const accesstoken = token ? token.accessToken : null;
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);

  useEffect(() => {
    if (user.userData) setIsFollowed(user.userData.isFollowing);
  }, [user.userData]);

  const handleClick = () => {
    setOpen(!open);
  };

  const [isBlocked, setIsBlocked] = React.useState(user.userData.isBlocked);

  const handleBlock = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/actions/${isBlocked ? "unblock" : "block"}/${user.userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setIsBlocked(!isBlocked);
      })
      .catch((error) => {
        console.error("Error blocking/unblocking user:", error);
      });
  };

  const handleSettingNavigation = () => {
    if (setSettings) setSettings(!settings);
  };

  const handleFollow = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${user.userData.username}/toggle-follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsFollowed(!isFollowed);
        console.log(res.data);
        ToastNot("success");
      })
      .catch((err) => {
        console.log(err);
        ToastNot("error");
      });
  };

  const [report, setReport] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.cover}>
          <Image
            src={user.userData.cover ? user.userData.cover : cover}
            alt={user.userData.username}
            width={1000}
            height={1000}
            className={styles.coverImg}
          />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              <Image
                src={user.userData.avatar ? user.userData.avatar : noAvatar}
                alt={user.userData.username}
                width={200}
                height={200}
                className={styles.avatarImg}
              />
            </div>

            <div className={styles.name}>
              <p>{user.userData.fullName}</p>
            </div>
            {user.isMyProfile ? null : (
              <div className={styles.visitor}>
                <button onClick={handleFollow} className={styles.follow}>
                  {isFollowed ? "Following" : "Unfollow"}
                </button>
                <button className={styles.message}>Send Message</button>
              </div>
            )}

            <div className={styles.bio}>
              <p>{user.userData.bio ? user.userData.bio : "No bio yet!"}</p>
            </div>
          </div>
          <div className={styles.userActions}>
            {user.isMyProfile ? (
              <>
                <div
                  onClick={handleSettingNavigation}
                  className={styles.settings}
                >
                  {settings ? <FaX /> : <IoMdSettings />}
                </div>
                <div
                  onClick={() => setIsAddNewModalOpen(true)}
                  className={`${styles.settings} ${styles.addNewButton}`}
                >
                  <FaPlus />
                </div>
              </>
            ) : (
              <div className={styles.droplist}>
                <div onClick={handleClick} className={styles.options}>
                  <HiDotsVertical />
                </div>
                <div
                  className={`${styles.dropDown} ${open ? styles.active : styles.notActive}`}
                >
                  <p onClick={() => setReport(true)}>Report</p>
                  <p
                    onClick={handleBlock}
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    {isBlocked ? "Unblock" : "Block"}
                  </p>
                  <button>Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for AddNew component */}
      <Modal
        isOpen={isAddNewModalOpen}
        onClose={() => setIsAddNewModalOpen(false)}
        title="Create New Post"
      >
        <AddNew
          isOpen={isAddNewModalOpen}
          onClose={() => setIsAddNewModalOpen(false)}
          onPostComplete={() => setIsAddNewModalOpen(false)}
        />
      </Modal>

      {report && (
        <Report
          setReport={setReport}
          user={user.userData.username}
          reportedId={user.userData.id}
          reportedType="user"
          report={report}
        />
      )}
    </>
  );
}

export default Header;