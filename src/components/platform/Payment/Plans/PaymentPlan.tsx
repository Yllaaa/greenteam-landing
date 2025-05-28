"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "./functions/subscriptionFunc.data";
import styles from "./payment-plan.module.scss";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/../public/ZPLATFORM/A-Header/FootLogo.png";
import tire1 from "@/../public/payments/tire1.png";
import tire2 from "@/../public/payments/tire2.jpg";
import tire3 from "@/../public/payments/tire3.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { CurrentTier } from "./types/subscriptionTypes.data";
const PaymentPlan = () => {
  const token = getToken();
  const accessToken = token ? token.accessToken : "";

  const router = useRouter();
  const { data: tiers, isLoading, error } = useQuery({
    queryKey: ["subscriptionTiers"],
    queryFn: subscriptionService.getSubscriptionTiers,
  });

  const [currentPlan, setCurrentPlan] = useState<CurrentTier>();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/subscriptions/my-subscription`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => setCurrentPlan(response.data));
  }, [accessToken]);

  if (isLoading)
    return (
      <div className="text-center py-10">Loading subscription plans...</div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading subscription plans
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Help us to make sustainable culture</h1>
      </div>
      <div className={styles.allPlansContainer}>
        {tiers?.map((tier) => (
          <div className={styles.planMainContainer} key={tier.id}>
            <div
              className={`${styles.planContainer} ${styles.other
                }`}
            >
              <div className={styles.planIcon}>
                <Image src={logo} alt="logo" loading="lazy" />
                <h2 className={styles.planName}>{tier.name}</h2>
                <p className={styles.planPrice}>
                  {tier.price === 0 ? "Free" : `$${tier.price}`}
                  <span>{tier.price === 0 ? "" : "/Year"}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  router.push(`payment/${tier.id}`);
                }}
                className={styles.planButton}
              >
                {currentPlan?.tier.id === tier.id
                  ? "Current Plan"
                  : `Select ${tier.name}`}
              </button>
              <div className={styles.line}></div>
              <ul className={styles.planFeatures}>
                <p>Features</p>
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className={styles.planFeature}>
                    <span className={styles.check}>
                      <FaCheckCircle />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.slogan}>
              {tier.id === 1 ? (
<div className={styles.sloganText}>
                <h3>TOGHTHER WE CAN TAKE CONTROL OF OUR LIVES</h3>
                <Image src={tire1} alt="tire1" loading="lazy" width={300} height={300} />
                <p>We Are All Greenteam</p>
                <p>The conscious social net</p>
              </div>
              ): tier.id === 2 ? (
<div className={styles.sloganText}>
                <h3>Green business are the future</h3>
                <Image src={tire2} alt="tire2" loading="lazy" width={300} height={300} />
                <p>use greenteam to build your community</p>
                <p>The conscious social net</p>
              </div>
              ): tier.id === 3 ? (
<div className={styles.sloganText}>
                <h3>We ARE FRIEND OF THE SUSTAINABLE INDUSTRY</h3>
                <Image src={tire3} alt="tire3" loading="lazy" width={300} height={300} />
                      <p>use greenteam to build your community</p>
                      <p>The conscious social net</p>
              </div>
              ): (
<div className={styles.sloganText}>
                <h3>Join the movement</h3>
                <p>Be a part of the change for a better world</p>
              </div>
              )}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPlan;
