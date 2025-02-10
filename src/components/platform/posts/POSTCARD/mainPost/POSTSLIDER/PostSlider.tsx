import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import styles from "./PostSlider.module.css";
import Image from "next/image";
import foot from "@/../public/goals/9af82d040ad31191bd7b42312d18fff3.jpeg";

import doIcon from "@/../public/ZPLATFORM/post/do.svg";
import like from "@/../public/ZPLATFORM/post/like.svg";
import unlike from "@/../public/ZPLATFORM/post/unlike.svg";
import comment from "@/../public/ZPLATFORM/post/comment.svg";
type Props = {
  setDoItModal?: (value: boolean) => void;
};
function PostSlider(props: Props) {
  const { setDoItModal } = props;
  // slider handler
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

  //   text color handler

  const [textColor, setTextColor] = useState("black"); // Default text color

  useEffect(() => {
    const img = new window.Image();
    img.src = foot.src;
    img.crossOrigin = "Anonymous"; // Enable cross-origin access if needed

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = foot.width;
      canvas.height = foot.height;

      // Draw the image on the canvas
      ctx?.drawImage(img, 0, 0, foot.width, foot.height);

      // Get the average color of the image
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;

      let r = 0,
        g = 0,
        b = 0;

      if (data) {
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
        }

        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));

        // Calculate the brightness of the average color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        console.log(brightness);
        // Set the text color based on the brightness
        if (brightness > 128) {
          setTextColor("black");
        } else {
          setTextColor("white");
        }
      }
    };
  }, []);
  return (
    <>
      {
        <>
          <div className={`${styles.navigationWrapper}`}>
            <div ref={sliderRef} className={`keen-slider`}>
              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>

              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>
              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>
              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>
            </div>

            {loaded && instanceRef.current && (
              <div className={styles.dots}>
                {[
                  ...Array(
                    instanceRef.current.track.details.slides.length
                  ).keys(),
                ].map((idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        instanceRef.current?.moveToIdx(idx);
                      }}
                      className={` ${styles.dot} ${
                        currentSlide === idx ? styles.active : ""
                      }`}
                    ></button>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ color: textColor }} className={styles.reactionBtns}>
            <div
              onClick={() => setDoItModal && setDoItModal(true)}
              className={styles.btn}
            >
              <Image src={doIcon} alt="do" />
              <p>
                <span>Do</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={like} alt="like" />
              <p>
                <span>Like</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={unlike} alt="unlike" />
              <p>
                <span>Unlike</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={comment} alt="comment" />
              <p>
                <span>Comment</span>
              </p>
            </div>
          </div>
        </>
      }
    </>
  );
}

export default PostSlider;
