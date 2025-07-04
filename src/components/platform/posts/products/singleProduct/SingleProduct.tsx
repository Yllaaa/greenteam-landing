/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./SingleProduct.module.css";
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import image from "@/../public/logo/foot.png";
import Image from "next/image";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { useKeenSlider } from "keen-slider/react";
import { Product } from "../types/productsTypes.data";
import "keen-slider/keen-slider.min.css";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
function SingleProduct(props: { prodId: string }) {
  const { prodId } = props;
  const router = useRouter();
  const locale = useLocale();
  const token = getToken();
  const t = useTranslations("web.products.single")
    const tt = useTranslations("web.header.topics");
  
  // const tf = useTranslations("web.products.filter")
  const accessToken = token ? token.accessToken : null;

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

  const [product, setProduct] = React.useState<Product>({} as Product);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/marketplace/products/${prodId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setProduct(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setIsLoading(false);
        setErrorMessage("Error fetching product");
      });
  }, []);
  const handleProfileVisit = () => {
    if (product.sellerType !== "page") {
      router.push(`/${locale}/profile/${product.seller.name}`);
    } else {
      router.push(`/${locale}/pages/${product.seller.name}`);
      
    }
  }

  return (
    <>
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loading}>
            <LoadingTree />
          </div>
        ) : errorMessage ? (
          <div className={styles.loading}>
            <p>{errorMessage}</p>
          </div>
        ) : (
          <div className={styles.product}>
            <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
              {product.images.length > 0 ? (
                product.images.map((imageUrl, index) => (
                  <div
                    key={imageUrl.id || index}
                    className={`keen-slider__slide ${styles.postCard}`}
                  >
                    <div className={styles.image}>
                      <Image
                        src={
                          product.images.length > 0 ? imageUrl.mediaUrl : image
                        }
                        alt={`Post image ${index + 1}`}
                        loading="lazy"
                        width={1000}
                        height={1000}
                        className={styles.image}
                        style={{ objectFit: "contain" }}
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
                        style={{ objectFit: "contain" }}
                />
              )}
              {loaded && instanceRef.current && product.images.length > 1 && (
                <div className={styles.dots}>
                  {[
                    ...Array(
                      instanceRef.current.track.details.slides.length
                    ).keys(),
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

            <div className={styles.content}>
              <div className={styles.category}>
                <p>{tt(product.topic.name)}</p>
              </div>
              <div className={styles.title}>
                <p>{product.name}</p>
              </div>
              <div className={styles.description}>
                <p className={styles.dLabel}>{t("description")}:</p>
                <p>{product.description}</p>
              </div>
              <div className={styles.user}>
                <div className={styles.userImage}>
                  <Image
                    src={
                      product.seller.avatar ? product.seller.avatar : noAvatar
                    }
                    alt="image"
                    loading="lazy"
                    className={styles.image}
                    width={100}
                    height={100}
                  />
                </div>
                <div onClick={handleProfileVisit} className={styles.details}>
                  <p className={styles.dLabel}>{t("by")}:</p>
                  <p className={styles.name}>{product.seller.name}</p>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => {
                    router.push(`/${locale}/chat?chatId=${product?.sellerId}`);
                  }}
                  className={styles.contactButton}
                >
                  {t("messageSeller")}
                </button>
                {product.website && (
                  <button className={styles.webButton}>{t("visitWeb")}</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SingleProduct;
