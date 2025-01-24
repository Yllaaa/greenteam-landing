import LoginForm from "@/components/AUTH/Login/LoginForm";
import React from "react";
import styles from "./login.module.css";

function page() {
  return (
    <>
      <section className={styles.loginContainer}>
        <LoginForm />
      </section>
    </>
  );
}

export default page;
