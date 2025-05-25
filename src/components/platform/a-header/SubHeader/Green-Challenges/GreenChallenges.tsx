"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import styles from "./GreenChallenges.module.css";
import Challenges from "./allCahalenges/Challenges";
import AddNewModal from "./modal/addNew/AddNewModal";
// import DoItModal from "../../../modals/toDo/DoItModal";
// import ToastNot from "@/Utils/ToastNotification/ToastNot";
// import Image from "next/image";
// import star from "@/../public/ZPLATFORM/challenges/star.svg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Challenge } from "./GreenTypes/GreenTypes";
import { useTranslations } from "next-intl";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function GreenChallenges() {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  // modals
  const [addNew, setAddNew] = React.useState(false);
  const [challengeId, setChallengeId] = React.useState("");
  // const [doItModal, setDoItModal] = React.useState(false);
  const [section, setSection] = React.useState("");

  // Fetch green challenges with React Query
  const fetchGreenChallenges = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/green-challenges?page=${page}&limit=3`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    // If no challenges are returned and we're not on page 1, reset to page 1
    if (response.data.length === 0 && page > 1) {
      setPage(1);
      return [];
    }

    return response.data;
  };

  const acceptDo = () => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI
          }/api/v1/challenges/green-challenges/${challengeId}/${section === "green-challenges" ? "add-to-do" : "mark-as-done"
          }`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res) {
            ToastNot("challenge marked as done");
            // setDoItModal(false);
          }
        }).then(
          () => {
            window.location.reload();
          }
        )
        .catch((err) => {
          console.log(err);
          ToastNot("error occurred while marking challenge as done");
        });
    } catch {
      ToastNot("error occurred while marking challenge as done");
    }
  };
  const acceptDoit = (challengeId: string) => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI
          }/api/v1/challenges/green-challenges/${challengeId}/add-to-do`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res) {
            ToastNot("challenge marked as done");
            // setDoItModal(false);
          }
        }).then(
          () => {
            window.location.reload();
          }
        )
        .catch((err) => {
          console.log(err);
          ToastNot("error occurred while marking challenge as done");
        });
    } catch {
      ToastNot("error occurred while marking challenge as done");
    }
  };

  const { data: challenges = [], isLoading, error } = useQuery({
    queryKey: ['greenChallenges', page],
    queryFn: fetchGreenChallenges,
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
  });

  // Invalidate query when modals close to refresh data
  const handleModalClose = () => {
    queryClient.invalidateQueries({ queryKey: ['greenChallenges'] });
  };
  const t = useTranslations("web.subHeader.green")
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h2>{t("challenges")}</h2>
            <p>
              {t("share")}
            </p>
          </div>
          {/* <div className={styles.headerBtn}>
            <button
              onClick={() => {
                ToastNot("Challenge Accepted");
                setDoItModal(true);
              }}
              className={styles.challengeButton}
            >
              <Image src={star} alt="star" /> Do It
            </button>
          </div> */}
        </div>

        <div className={`${styles.navigationWrapper}`}>
          {isLoading ? (
            <div>Loading challenges...</div>
          ) : error ? (
            <div>Error loading challenges: {(error as Error).message}</div>
          ) : (
            <Challenges
              challenges={challenges as Challenge[]}
              setAddNew={setAddNew}
              setChallengeId={setChallengeId}
              // setDoItModal={setDoItModal}
              setSection={setSection}
              acceptDo={acceptDo}
              acceptDoit={acceptDoit}

            />
          )}

          <>
            <Arrow
              left
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            />

            <Arrow
              onClick={() => setPage(page + 1)}
              disabled={challenges.length < 3} // Disable if we have fewer items than the limit
            />
          </>
        </div>
      </div>
      {/* Modal */}
      {addNew && (
        <AddNewModal
          setAddNew={(value) => {
            setAddNew(value);
            if (!value) handleModalClose();
          }}
          addNew={addNew}
          challengeId={challengeId}
        />
      )}
      {/* {doItModal && (
        <DoItModal
          setDoItModal={(value: boolean) => {
            setDoItModal(value);
            if (!value) handleModalClose();
          }}
          doItModal={doItModal}
          challengeId={challengeId}
          section={section}
        />
      )} */}
    </>
  );
}

export default GreenChallenges;

function Arrow(props: {
  left?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={props.disabled ? undefined : props.onClick}
      className={`${styles.arrow} ${props.left ? styles.arrowLeft : styles.arrowRight
        } ${props.disabled ? styles.arrowDisabled : ''}`}
    >
      {props.left && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaArrowLeft />
        </div>
      )}
      {!props.left && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaArrowRight />
        </div>
      )}
    </div>
  );
}