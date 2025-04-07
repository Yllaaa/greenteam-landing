/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
// import axios from "axios";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import image from "@/../public/logo/foot.png";
import { Products } from "../types/productsTypes.data";
import { useInView } from "react-intersection-observer";
import { FaMessage } from "react-icons/fa6";
import { useRouter } from "next/navigation";
// import { TiStarFullOutline } from "react-icons/ti";
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
}

const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const {
    product,
    index,
    page,
    setPage,
    products,
    setSendMessage,
    setSellerId,
    setSellerType,
  } = props;
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`feeds/products/${product?.id}`);
  };
  const handleJoinNow = async () => {
    setSendMessage(true);
    setSellerId(product?.sellerId);
    setSellerType(product?.sellerType);
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

  return (
    <div
      ref={index === products.length - 1 ? ref : null}
      className={styles.card}
    >
      <Image
        src={product.imageUrl ? product.imageUrl[0] : image}
        alt="image"
        className={styles.image}
      />
      <div onClick={handleNavigate} className={styles.content}>
        <h2 className={styles.category}>{product?.marketType}</h2>
        <p className={styles.details}>
          {product?.name.length > 90
            ? product?.name.slice(0, 90) + "..."
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
          <button onClick={handleJoinNow} className={styles.contactButton}>
            Message Seller
          </button>
        )}
        <button onClick={handleJoinNow} className={styles.chatButton}>
          <FaMessage />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
