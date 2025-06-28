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
import { useLocale, useTranslations } from "next-intl";

const PaymentPlan = () => {
  const token = getToken();
  const accessToken = token ? token.accessToken : "";
  const locale = useLocale();
  const t = useTranslations("web.plans");
  const router = useRouter();
  const { data: tiers, isLoading, error } = useQuery({
    queryKey: ["subscriptionTiers", locale], // Include locale in query key
    queryFn: () => subscriptionService.getSubscriptionTiers(locale),
  });

  const [currentPlan, setCurrentPlan] = useState<CurrentTier>();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/subscriptions/my-subscription`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Accept-Language": locale,
          },
        }
      )
      .then((response) => { setCurrentPlan(response.data); console.log(response); }).catch((error) => {
        console.error("Error fetching current plan:", error);
        setCurrentPlan(undefined);
      });
  }, [accessToken, locale]);

  if (isLoading)
    return (
      <div className="text-center py-10">{t('loading')}</div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        {t('error')}
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('title')}</h1>
      </div>
      <div className={styles.allPlansContainer}>
        {tiers?.map((tier) => (
          <div className={styles.planMainContainer} key={tier.id}>
            <div
              className={`${styles.planContainer} ${styles.other}`}
            >
              <div className={styles.planIcon}>
                <Image src={logo} alt="logo" loading="lazy" />
                <h2 className={styles.planName}>{tier.name}</h2>
                <p className={styles.planPrice}>
                  {tier.price === 0 ? t('free') : `$${tier.price}`}
                  <span>{tier.price === 0 ? "" : t('perYear')}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  router.push(`payment/${tier.id}`);
                }}
                className={styles.planButton}
                style={{
                  cursor: currentPlan?.tier.id === tier.id ? 'not-allowed' : 'pointer',
                }}

              >
                {currentPlan?.tier.id === tier.id
                  ? t('currentPlan')
                  : t('selectPlan')}
              </button>
              <div className={styles.line}></div>
              <ul className={styles.planFeatures}>
                <p>{t('features')}</p>
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
                  <h3>{t('tier1.title')}</h3>
                  <Image src={tire1} alt="tire1" loading="lazy" width={300} height={300} />
                  <p>{t('tier1.subtitle1')}</p>
                  <p>{t('tier1.subtitle2')}</p>
                </div>
              ) : tier.id === 2 ? (
                <div className={styles.sloganText}>
                  <h3>{t('tier2.title')}</h3>
                  <Image src={tire2} alt="tire2" loading="lazy" width={300} height={300} />
                  <p>{t('tier2.subtitle1')}</p>
                  <p>{t('tier2.subtitle2')}</p>
                </div>
              ) : tier.id === 3 ? (
                <div className={styles.sloganText}>
                  <h3>{t('tier3.title')}</h3>
                  <Image src={tire3} alt="tire3" loading="lazy" width={300} height={300} />
                  <p>{t('tier3.subtitle1')}</p>
                  <p>{t('tier3.subtitle2')}</p>
                </div>
              ) : (
                <div className={styles.sloganText}>
                  <h3>{t('tierDefault.title')}</h3>
                  <p>{t('tierDefault.subtitle')}</p>
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