"use client";
import React from "react";
import Link from "next/link";

function Error() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "775px",
          width: "100%",
          gap: "25px",
          overflow: "hidden",
        }}
      >
        <div className={"errorHeader"}>
            <h3>Whoops !</h3>
            <p>Sorry, this page is not available or broken.</p>
        </div>
        <div className={"errorImgs"}></div>

        <div className={"errorButton"}>
          <Link
            className={"link"}
            href="/"
            style={{ }}
          >
            Go back to the homepage
          </Link>
        </div>
      </div>
    </>
  );
}

export default Error;
