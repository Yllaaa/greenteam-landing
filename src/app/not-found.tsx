"use client";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "25px",
          height: "fit-content",
          width: "100%",
          overflow: "hidden",
          margin: "100px auto",
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
            Back home
          </Link>
        </div>
      </div>
    </>
  );
}
