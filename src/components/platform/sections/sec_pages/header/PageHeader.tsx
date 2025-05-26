"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
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
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "@/components/platform/modals/confirmModal/ConfirmationModal";
import ReportModal from "@/components/platform/modals/reportModal/ReportModal";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useRouter } from "next/navigation";
import linkifyText from "@/Utils/textFormatting/linkify";
import linkifyStyles from "@/Utils/textFormatting/linkify.module.css";

function Pageheader(props: {
  pageId: string;
  setSettings: React.Dispatch<React.SetStateAction<boolean>>;
  settings: boolean;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pageId, setSettings, settings } = props;
  const [data, setData] = React.useState<PageItem>({} as PageItem);
  const [initialFollow, setInitialFollow] = useState(false);
  const [loading, setLoading] = useState(true);

  // Options menu state
  const [showOptions, setShowOptions] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // References for dropdown menus (to handle clicks outside)
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const mobileActionsRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const accessToken = token ? token.accessToken : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getSinglePageItems(pageId);
        dispatch(setCurrentPage(res));
        setData(res);
        setInitialFollow(res.isFollowing);
      } catch (error) {
        console.error("Error fetching page data:", error);
        ToastNot("Failed to load page information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageId, dispatch]);

  // Close the options menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }

      if (
        mobileActionsRef.current &&
        !mobileActionsRef.current.contains(event.target as Node)
      ) {
        setShowMobileActions(false);
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

  const handleFollow = async () => {
    try {
      const res = await postFllow(pageId);
      setInitialFollow(res.followed);
      ToastNot(res.followed ? "Following page" : "Unfollowed page");
    } catch (error) {
      console.error("Error following/unfollowing page:", error);
      ToastNot("Failed to update follow status");
    }
  };

  const handleSettingNavigation = () => {
    if (setSettings) setSettings(!settings);
  };

  // Toggle options menu
  const toggleOptionsMenu = () => {
    setShowOptions(prev => !prev);
    if (showMobileActions) setShowMobileActions(false);
  };

  // Toggle mobile actions menu
  const toggleMobileActions = () => {
    setShowMobileActions(prev => !prev);
    if (showOptions) setShowOptions(false);
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
        router.push('/pages');
      }
    } catch (error) {
      console.error("Failed to block page:", error);
      ToastNot("Error occurred while blocking page");
    }
  }, [pageId, accessToken, router]);

  if (loading) {
    return <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading page information...</p>
    </div>;
  }
  console.log("Page data:", data);
  

  return (
    <>
      <div className={styles.cover}>
        {/* Page options button */}
        <div className={styles.pageOptions}>
          <div
            onClick={toggleOptionsMenu}
            className={styles.optionsIcon}
            aria-label="Page options"
          >
            <PiDotsThreeCircleLight />
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
                  role="button"
                  aria-label="Delete page"
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
                role="button"
                aria-label="Report page"
              >
                <MdOutlineReportProblem /> <span>Report Page</span>
              </div>
              <div
                onClick={() => {
                  setIsBlockModalOpen(true);
                  setShowOptions(false);
                }}
                className={styles.optionItem}
                role="button"
                aria-label="Block page"
              >
                <BsShieldSlash /> <span>Block Page</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.coverSection}>
          <Image
            src={data.cover ? data.cover : cover}
            alt={`${data.name || 'Page'} cover image`}
            className={styles.coverImg}
            width={1000}
            height={1000}
            priority
          />
        </div>

        <div className={styles.pageInfo}>
          <div className={styles.image}>
            <Image
              src={data.avatar ? data.avatar : cover}
              alt={`${data.name || 'Page'} profile image`}
              className={styles.profileImg}
              width={135}
              height={135}
              loading="lazy"
            />
          </div>
          <div className={styles.nameContainer}>
            <h1 className={styles.name}>{data.name}</h1>
            <div className={styles.followButtonMobile}>
              <button onClick={handleFollow} className={styles.likeBtn}>
                {initialFollow ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.header}>
        {data.isAdmin && (
          <div className={styles.mobileActionsToggle} onClick={toggleMobileActions}>
            <FaPlus />
            <span>Actions</span>
          </div>
        )}

        {showMobileActions && data.isAdmin && (
          <div ref={mobileActionsRef} className={styles.mobileActionsMenu}>
            <div onClick={() => {
              setAddNewPost(!addNewPost);
              setShowMobileActions(false);
            }}>Add Post</div>
            <div onClick={() => {
              setAddNewP(!addNewP);
              setShowMobileActions(false);
            }}>Add Product</div>
            <div onClick={() => {
              setAddNewE(!addNewE);
              setShowMobileActions(false);
            }}>Add Event</div>
          </div>
        )}

        <div className={styles.headerContent}>
          {data.why && (
            <div className={styles.infoItem}>
              <h5>Why:</h5>
              <h6>{data.why}</h6>
            </div>
          )}

          {data.how && (
            <div className={styles.infoItem}>
              <h5>How:</h5>
              <h6>{data.how}</h6>
            </div>
          )}

          {data.what && (
            <div className={styles.infoItem}>
              <h5>What:</h5>
              <h6>{data.what}</h6>
            </div>
          )}

          {data.description && (
            <div className={styles.infoItem}>
              <h5>Description:</h5>
              <h6>{data.description}</h6>
            </div>
          )}

          <div className={styles.infoItem}>
            <h5>Website:</h5>
            {data.websiteUrl ? (
              <h6>
                {linkifyText(data.websiteUrl, {
                  className: linkifyStyles['content-link'],
                  target: "_blank",
                  rel: "noopener noreferrer"
                })}
              </h6>
            ) : (
              <h6>No Website</h6>
            )}
          </div>
        
          <div className={styles.infoItem}>
            <h5>Location:</h5>
            {data.country && data.city ? (
              <h6>
                {data.country.name}, {data.city.nameEn}
              </h6>
            ) : (
              <h6>No Location</h6>
            )}
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.headerAddBtns}>
            {data.isAdmin && (
              <>
                <button
                  onClick={() => setAddNewPost(!addNewPost)}
                  className={styles.addPost}
                >
                  Add Post
                </button>
                <button
                  onClick={() => setAddNewP(!addNewP)}
                  className={styles.addProduct}
                >
                  Add Product
                </button>
                <button
                  onClick={() => setAddNewE(!addNewE)}
                  className={styles.addEvent}
                >
                  Add Event
                </button>
              </>
            )}
          </div>

          <div className={styles.headerLike}>
            <button onClick={handleFollow} className={styles.likeBtn}>
              {initialFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>

        {data.isAdmin && (
          <div
            onClick={handleSettingNavigation}
            className={styles.settings}
            aria-label="Page settings"
          >
            <IoMdSettings />
          </div>
        )}
      </div>

      {addNewP && <AddNewProduct setAddNew={setAddNewP} userType="page" />}
      {addNewE && <AddNewEvent setAddNew={setAddNewE} userType="page" />}
      {addNewPost && data.isAdmin && (
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
          ToastNot("Thank you for your report");
        }}
      />
    </>
  );
}

export default Pageheader;