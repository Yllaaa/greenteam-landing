import React from "react";
import { CSSProperties } from "react";

const Loading = () => {
  return (
    <>
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p>Loading...</p>
      </div>
    </>
  );
};


const styles: { [key: string]: CSSProperties } = {
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "var(--Purple-500)",
  },
  loader: {
    border: "8px solid var(--Indigo-200)",
    borderTop: "8px solid var(--Indigo-500)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
  },
};

export default Loading;
