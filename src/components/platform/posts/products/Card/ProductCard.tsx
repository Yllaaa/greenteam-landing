/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "keen-slider/keen-slider.min.css";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import image from "@/../public/logo/foot.png";
import { Products } from "../types/productsTypes.data";
import { useInView } from "react-intersection-observer";
import { FaMessage, FaStar } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useKeenSlider } from "keen-slider/react";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineReportProblem } from "react-icons/md";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  limit?: number;
  products: Products[];
  product: Products;
  index?: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSendMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setSellerId: React.Dispatch<React.SetStateAction<string>>;
  setSellerType: React.Dispatch<React.SetStateAction<string>>;
  setShowContacts: React.Dispatch<React.SetStateAction<boolean>>;
  setContacts?: React.Dispatch<React.SetStateAction<any>>;
  // setSlug: React.Dispatch<React.SetStateAction<string>>;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  reportModal: boolean;
  setReportModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
}

const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const {
    product,
    index,
    page,
    setPage,
    products,
    setSellerId,
    setShowContacts,
    // setContacts,
    deleteModal,
    setDeleteModal,
    reportModal,
    setReportModal,
    setPostId,
  } = props;
  const router = useRouter();

  // Add local favorite state
  const [isFavorite, setIsFavorite] = useState(product?.isFavorited || false);

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Set initial favorite state from product data
  useEffect(() => {
    setIsFavorite(product?.isFavorited || false);
  }, [product?.isFavorited]);

  // Track which post's options menu is open
  const [activeOptionsPost, setActiveOptionsPost] = useState<string | null>(
    null
  );
  const toggleOptionsMenu = useCallback((postId: string) => {
    setActiveOptionsPost((prev) => (prev === postId ? null : postId));
  }, []);

  // Handle delete or report action
  const handleActionDelete = useCallback(
    (postId: string) => {
      if (setDeleteModal && setPostId) {
        setPostId(postId);
        setDeleteModal(!deleteModal);
      }
      setActiveOptionsPost(null); // Close the menu after action
    },
    [deleteModal, setDeleteModal, setPostId]
  );

  // Handle delete or report action
  const handleActionReport = useCallback(
    (postId: string) => {
      if (setReportModal && setPostId) {
        setPostId(postId);
        setReportModal(!reportModal);
      }
      setActiveOptionsPost(null); // Close the menu after action
    },
    [reportModal, setPostId, setReportModal]
  );

  const optionsMenuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the options menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setActiveOptionsPost(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = () => {
    router.push(`feeds/products/${product?.id}`);
  };

  const handleJoinNow = async () => {
    router.push(`chat?chatId=${product?.sellerId}`);
  };

  const handleContacts = async () => {
    // setContacts(product?.sellerType);
    setSellerId(product?.sellerId);
    setShowContacts(true);
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const handlePages = React.useCallback(() => {
    setPage(products && products.length < 5 ? 1 : page + 1);
  }, [page]);

  React.useEffect(() => {
    if (inView) {
      handlePages();
    }
  }, [inView]);

  const localeS = getToken();
  const accessToken = localeS ? localeS.accessToken : null;

  const handleToggleFavorite = (id: string) => {
    // Immediately toggle the local state for instant feedback
    setIsFavorite(prevState => !prevState);

    // Make the API call in the background
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/marketplace/products/${id}/toggle-favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        if (response.data) {
          // Update toast with confirmation
          ToastNot(
            `${response.data.isFavorited
              ? "Added to favorites!"
              : "Removed from favorites!"
            }`
          );
        }
      })
      .catch((error) => {
        // If there's an error, revert the local state
        setIsFavorite(prevState => !prevState);

        const err = error as { status: number };
        if (err.status === 409) {
          ToastNot("Already in favorites!");
        } else {
          ToastNot("Failed to update favorites. Please try again.");
        }
        console.error("Error toggling favorite:", error);
      });
  };
  const t = useTranslations("web.products.card");

  return (
    <div
      ref={index === products.length - 1 ? ref : null}
      className={styles.card}
    >
      <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
        {product.images.length > 0 ? (
          product.images.map((imageUrl, index) => (
            <div
              key={imageUrl.id || index}
              className={`keen-slider__slide ${styles.postCard}`}
            >
              <div className={styles.image}>
                <Image
                  src={product.images.length > 0 ? imageUrl.mediaUrl : image}
                  alt={`Post image ${index + 1}`}
                  loading="lazy"
                  width={1000}
                  height={1000}
                  className={styles.image}
                />
              </div>
            </div>
          ))
        ) : (
          <Image
            src={image}
            alt={`Post image`}
            loading="lazy"
            width={1000}
            height={1000}
            className={styles.singleImage}
          />
        )}
        {loaded && instanceRef.current && product.images.length > 1 && (
          <div className={styles.dots}>
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`${styles.dot} ${currentSlide === idx ? styles.active : ""
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
        className={styles.content}
      >
        <h2 className={styles.category}>{product?.marketType}</h2>
        <p className={styles.details}>
          {product?.name.length > 30
            ? product?.name.slice(0, 30) + "..."
            : product?.name}
        </p>

        <p className={styles.product}>
          {product?.description.length > 90
            ? product?.description.slice(0, 90) + "..."
            : product?.description}
        </p>
        <p className={styles.price}>{product?.price} $</p>
      </div>
      <div className={styles.topBtns}>
        {product?.sellerType === "page" && (
          <button onClick={handleContacts} className={styles.contactButton}>
            {t("buttons.messageSeller")}
          </button>
        )}
        {product?.sellerType === "user" && (
          <button onClick={handleJoinNow} className={styles.chatButton}>
            <FaMessage />
          </button>
        )}
      </div>
      <div
        onClick={() => handleToggleFavorite(`${product?.id}`)}
        className={`${styles.favorite} ${isFavorite ? styles.favoriteActive : ''}`}
      >
        <FaStar fill={isFavorite ? "#FFD700" : "#FFF"} />
      </div>
      <div className={styles.options}>
        <div
          onClick={() => toggleOptionsMenu(product.id)}
          className={styles.optionsIcon}
          aria-label="Product options"
        >
          <PiDotsThreeCircleLight />
        </div>

        {activeOptionsPost === product.id && (
          <div ref={optionsMenuRef} className={styles.optionsMenu}>
            {product.isAuthor && (
              <div
                onClick={() => handleActionDelete(product.id)}
                className={`${styles.optionItem} ${styles.deleteOption}`}
              >
                <FaTrash className={styles.deleteIcon} />
                <span>{t("options.delete")}</span>
              </div>
            )}
            <div
              onClick={() => handleActionReport(product.id)}
              className={`${styles.optionItem} ${styles.reportOption}`}
            >
              <MdOutlineReportProblem className={styles.reportIcon} />
              <span>{t("options.report")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;