/* eslint-disable @typescript-eslint/no-explicit-any */
// import { SetStateAction } from "react";

export type ForumFilterProps = {
  section: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSection: any;
  // React.Dispatch<
  //   SetStateAction<"doubt" | "need" | "dream" | "all">
  // >;
  setAddNew?: React.Dispatch<React.SetStateAction<boolean>>;
};
