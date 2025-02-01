"use client";
import React from "react";
import axios from "axios";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import image from "@/../public/icons/foot.svg";

interface ProductCardProps {
  id?: string;
  imageUrl?: string;
  category?: string;
  details?: string;

  product?: string;
  price?: "";
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  category,
  details,

  product,
  price,
  isFavorite,
}) => {
  const handleJoinNow = async () => {
    try {
      const response = await axios.post("/api/joinEvent", { eventId: id });
      console.log("Join response:", response.data);
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handleToggleFavorite = () => {
    axios.post("/api/toggleFavorite", { eventId: id });
  };

  return (
    <div className={styles.card}>
      <Image
        src={imageUrl ? imageUrl : image}
        alt="image"
        className={styles.image}
      />
      <div className={styles.content}>
        <h2 className={styles.category}>
          {category ? category : "ECOFRIENDLY"}
        </h2>
        <p className={styles.details}>
          {details ? details : "Eco-Friendly Water Bottle"}
        </p>

        <p className={styles.product}>
          {product
            ? product
            : "Stay hydrated sustainably with our BPA-free, reusable water bottle made from recycled materials"}
        </p>
        <p className={styles.price}>
          {price
            ? `${price} $`
            : "12.99 $"}
        </p>
        <button onClick={handleJoinNow} className={styles.messageButton}>
          Message Seller
        </button>
        <button onClick={handleJoinNow} className={styles.contactButton}>
          Contact Seller
        </button>
      </div>
      <button onClick={handleToggleFavorite} className={styles.favoriteButton}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default ProductCard;
