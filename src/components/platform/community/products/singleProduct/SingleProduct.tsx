/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import styles from "./SingleProduct.module.css";
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import image from "@/../public/logo/foot.png";
import Image from "next/image";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
function SingleProduct(props: { prodId: string }) {
  const { prodId } = props;
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const [product, setProduct] = React.useState<any>(null);
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
            <div className={styles.image}>
              <Image
                src={product.imageUrl ? product.imageUrl[0] : image}
                alt="image"
                className={styles.image}
                width={100}
                height={100}
              />
            </div>
            <div className={styles.content}>
              <div className={styles.category}>
                <p>{product.topic.name}</p>
              </div>
              <div className={styles.title}>
                <p>{product.name}</p>
              </div>
              <div className={styles.description}>
                <p className={styles.dLabel}>Description:</p>
                <p>{product.description}</p>
              </div>
              <div className={styles.user}>
                <div className={styles.userImage}>
                  <Image
                    src={
                      product.seller.imageUrl
                        ? product.seller.imageUrl
                        : noAvatar
                    }
                    alt="image"
                    loading="lazy"
                    className={styles.image}
                  />
                </div>
                <div className={styles.details}>
                  <p className={styles.dLabel}>By:</p>
                  <p className={styles.name}>{product.seller.name}</p>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.contactButton}>Message Seller</button>
                {product.website && (
                  <button className={styles.webButton}>visit website</button>
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
