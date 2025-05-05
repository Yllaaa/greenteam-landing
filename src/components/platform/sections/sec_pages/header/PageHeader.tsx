// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import styles from "./header.module.scss";
// import cover from "@/../public/ZPLATFORM/groups/cover.png";
// // import AddNew from "./AddNew";

// // import { useAppSelector } from "@/store/hooks";
// import { getSinglePageItems, postFllow } from "./header.data";
// import { PageItem } from "./header.data";
// import AddNewProduct from "../body/products/modal/AddNewProduct";
// import AddNewEvent from "../body/Events/modal/AddNewEvent";
// import { useAppDispatch } from "@/store/hooks";
// import { setCurrentPage } from "@/store/features/pageDetails/pageDetails";
// import AddNewModal from "../body/feeds/modal/addNew/AddNewModal";
// import { IoMdSettings } from "react-icons/io";
// function Pageheader(props: {
//   pageId: string;
//   setSettings: React.Dispatch<React.SetStateAction<boolean>>;
//   settings: boolean;
// }) {
//   // const user = useAppSelector((state) => state.login.user);
//   const dispatch = useAppDispatch();
//   const { pageId, setSettings, settings } = props;
//   const [data, setData] = React.useState<PageItem>({} as PageItem);
//   const [initialFollow, setInitialFollow] = useState(false);
//   useEffect(() => {
//     getSinglePageItems(pageId).then((res) => {
//       dispatch(setCurrentPage(res));

//       setData(res);
//       setInitialFollow(res.isFollowing);
//     });
//   }, []);
//   const [addNewP, setAddNewP] = useState(false);
//   const [addNewE, setAddNewE] = useState(false);
//   const [addNewPost, setAddNewPost] = useState(false);

//   const handleFollow = () => {
//     postFllow(pageId).then((res) => {
//       setInitialFollow(res.followed);
//     });
//   };

//   const handleSettingNavigation = () => {
//     if (setSettings) setSettings(!settings);
//   };

//   return (
//     <>
//       <div className={styles.cover}>
//         <div className={styles.coverSection}>
//           <Image
//             src={data.cover ? data.cover : cover}
//             alt={"cover"}
//             className={styles.coverImg}
//             width={1000}
//             height={1000}
//             loading="lazy"
//           />
//         </div>
//         <div className={styles.pageInfo}>
//           <div className={styles.image}>
//             <Image
//               src={data.avatar ? data.avatar : cover}
//               alt={"cover"}
//               className={styles.coverImg}
//               loading="lazy"
//               width={135}
//               height={135}
//             />
//           </div>
//           <div className={styles.name}>
//             <p>{data.name}</p>
//           </div>
//         </div>
//       </div>
//       <div className={styles.header}>
//         <div className={styles.headerContent}>
//           <div className={styles.headerWhy}>
//             <h5>Why:</h5>
//             <h6>{data.why}</h6>
//           </div>
//           <div className={styles.headerHow}>
//             <h5>How:</h5>
//             <h6>{data.how}</h6>
//           </div>
//           <div className={styles.headerWhat}>
//             <h5>What:</h5>
//             <h6>{data.what}</h6>
//           </div>
//         </div>
//         <div className={styles.headerActions}>
//           <div className={styles.headerAddBtns}>
//             <button
//               onClick={() => setAddNewPost(!addNewPost)}
//               className={styles.addPost}
//             >
//               Add Post
//             </button>

//             {data.isAdmin && (
//               <button
//                 onClick={() => setAddNewP(!addNewP)}
//                 className={styles.addProduct}
//               >
//                 Add Product
//               </button>
//             )}
//             {data.isAdmin && (
//               <button
//                 onClick={() => setAddNewE(!addNewE)}
//                 className={styles.addEvent}
//               >
//                 Add Event
//               </button>
//             )}
//           </div>
//           <div className={styles.headerLike}>
//             <button onClick={handleFollow} className={styles.likeBtn}>
//               {initialFollow ? "Unfollow" : "Follow"}
//             </button>
//           </div>
//         </div>
//         {data.isAdmin && (
//           <div onClick={handleSettingNavigation} className={styles.settings}>
//             <IoMdSettings />
//           </div>
//         )}
//       </div>
//       {/* <AddNew /> */}
//       {addNewP && <AddNewProduct setAddNew={setAddNewP} userType="page" />}
//       {addNewE && <AddNewEvent setAddNew={setAddNewE} userType="page" />}
//       {addNewPost && (
//         <AddNewModal
//           setAddNew={setAddNewPost}
//           addNew={addNewPost}
//           slug={pageId}
//         />
//       )}
//     </>
//   );
// }

// export default Pageheader;


/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
// import AddNew from "./AddNew";

// import { useAppSelector } from "@/store/hooks";
import { getSinglePageItems, postFllow } from "./header.data";
import { PageItem } from "./header.data";
import AddNewProduct from "../body/products/modal/AddNewProduct";
import AddNewEvent from "../body/Events/modal/AddNewEvent";
import { useAppDispatch } from "@/store/hooks";
import { setCurrentPage } from "@/store/features/pageDetails/pageDetails";
import AddNewModal from "../body/feeds/modal/addNew/AddNewModal";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { BsShieldSlash } from "react-icons/bs";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import ConfirmationModal from "@/components/platform/modals/confirmModal/ConfirmationModal";
import ReportModal from "@/components/platform/modals/reportModal/ReportModal";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useRouter } from "next/navigation";

function Pageheader(props: {
  pageId: string;
  setSettings: React.Dispatch<React.SetStateAction<boolean>>;
  settings: boolean;
}) {
  // const user = useAppSelector((state) => state.login.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pageId, setSettings, settings } = props;
  const [data, setData] = React.useState<PageItem>({} as PageItem);
  const [initialFollow, setInitialFollow] = useState(false);
  
  // Options menu state
  const [showOptions, setShowOptions] = useState(false);
  
  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  
  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Reference for dropdown menu (to handle clicks outside)
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  
  const token = getToken();
  const accessToken = token ? token.accessToken : null;

  useEffect(() => {
    getSinglePageItems(pageId).then((res) => {
      dispatch(setCurrentPage(res));
      setData(res);
      setInitialFollow(res.isFollowing);
    });
  }, []);
  
  // Close the options menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const [addNewP, setAddNewP] = useState(false);
  const [addNewE, setAddNewE] = useState(false);
  const [addNewPost, setAddNewPost] = useState(false);

  const handleFollow = () => {
    postFllow(pageId).then((res) => {
      setInitialFollow(res.followed);
    });
  };

  const handleSettingNavigation = () => {
    if (setSettings) setSettings(!settings);
  };
  
  // Toggle options menu
  const toggleOptionsMenu = () => {
    setShowOptions(prev => !prev);
  };
  
  // Handle delete action
  const handleDelete = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${pageId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response) {
        ToastNot("Page deleted successfully");
        // Redirect to last page
        router.back();
        
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
      ToastNot("Error occurred while deleting page");
    }
  }, [pageId, accessToken, router]);
  
  // Handle block action
  const handleBlock = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/actions/block`,
        {
          blockedId: pageId,
          blockedEntityType: "page"
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response) {
        ToastNot("Page blocked successfully");
        // Redirect to pages list after blocking
        router.push('/pages');
      }
    } catch (error) {
      console.error("Failed to block page:", error);
      ToastNot("Error occurred while blocking page");
    }
  }, [pageId, accessToken, router]);

  return (
    <>
      <div className={styles.cover}>
        <div className={styles.coverSection}>
          <Image
            src={data.cover ? data.cover : cover}
            alt={"cover"}
            className={styles.coverImg}
            width={1000}
            height={1000}
            loading="lazy"
          />
        </div>
        <div className={styles.pageInfo}>
          <div className={styles.image}>
            <Image
              src={data.avatar ? data.avatar : cover}
              alt={"cover"}
              className={styles.coverImg}
              loading="lazy"
              width={135}
              height={135}
            />
          </div>
          <div className={styles.name}>
            <p>{data.name}</p>
          </div>
          
          {/* Page options button */}
          <div className={styles.pageOptions}>
            <div
              onClick={toggleOptionsMenu}
              className={styles.optionsIcon}
            >
              <PiDotsThreeCircleLight fill="#006633" />
            </div>
            
            {showOptions && (
              <div ref={optionsMenuRef} className={styles.optionsMenu}>
                {data.isAdmin && (
                  <div
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setShowOptions(false);
                    }}
                    className={styles.optionItem}
                  >
                    <FaTrash /> <span>Delete Page</span>
                  </div>
                )}
                <div
                  onClick={() => {
                    setIsReportModalOpen(true);
                    setShowOptions(false);
                  }}
                  className={styles.optionItem}
                >
                  <MdOutlineReportProblem /> <span>Report Page</span>
                </div>
                <div
                  onClick={() => {
                    setIsBlockModalOpen(true);
                    setShowOptions(false);
                  }}
                  className={styles.optionItem}
                >
                  <BsShieldSlash /> <span>Block Page</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerWhy}>
            <h5>Why:</h5>
            <h6>{data.why}</h6>
          </div>
          <div className={styles.headerHow}>
            <h5>How:</h5>
            <h6>{data.how}</h6>
          </div>
          <div className={styles.headerWhat}>
            <h5>What:</h5>
            <h6>{data.what}</h6>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.headerAddBtns}>
            <button
              onClick={() => setAddNewPost(!addNewPost)}
              className={styles.addPost}
            >
              Add Post
            </button>

            {data.isAdmin && (
              <button
                onClick={() => setAddNewP(!addNewP)}
                className={styles.addProduct}
              >
                Add Product
              </button>
            )}
            {data.isAdmin && (
              <button
                onClick={() => setAddNewE(!addNewE)}
                className={styles.addEvent}
              >
                Add Event
              </button>
            )}
          </div>
          <div className={styles.headerLike}>
            <button onClick={handleFollow} className={styles.likeBtn}>
              {initialFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
        {data.isAdmin && (
          <div onClick={handleSettingNavigation} className={styles.settings}>
            <IoMdSettings />
          </div>
        )}
      </div>
      {/* <AddNew /> */}
      {addNewP && <AddNewProduct setAddNew={setAddNewP} userType="page" />}
      {addNewE && <AddNewEvent setAddNew={setAddNewE} userType="page" />}
      {addNewPost && (
        <AddNewModal
          setAddNew={setAddNewPost}
          addNew={addNewPost}
          slug={pageId}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => router.push('/pages')}
        title="Are you sure you want to delete this page?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        customAction={handleDelete}
        successMessage="Page deleted successfully"
        errorMessage="Error occurred while deleting page"
      />
      
      {/* Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={() => router.push('/pages')}
        title="Are you sure you want to block this page?"
        confirmButtonText="Block"
        cancelButtonText="Cancel"
        customAction={handleBlock}
        successMessage="Page blocked successfully"
        errorMessage="Error occurred while blocking page"
      />
      
      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedId={pageId}
        reportedType="page"
        title="Talk about the issue you are facing with this page"
        successCallback={() => {
          // Optional success callback
          ToastNot("Thank you for your report");
        }}
      />
    </>
  );
}

export default Pageheader;