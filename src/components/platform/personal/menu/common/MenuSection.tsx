"use client";

import styles from "./common.module.scss";
import { ReactNode, Suspense } from "react";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import add from "@/../public/icons/add.svg";
import Image from "next/image";

type propsType = {
  title: string;
  href: string;
  children: ReactNode;
  setAddNew?: React.Dispatch<React.SetStateAction<boolean>>;
};

function MenuSection({ children, ...props }: propsType) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.title}>
          <label>{props.title}</label>
        </div>
        <div
          onClick={() => props.setAddNew && props.setAddNew(true)}
          className={styles.path}
        >
          <Image src={add} alt="tag" />
          <p>{props.href}</p>
        </div>

      </div>
      <div>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}

export default MenuSection;
