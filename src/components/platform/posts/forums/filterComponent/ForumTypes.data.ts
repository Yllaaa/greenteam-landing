import { SetStateAction } from "react";

export type ForumFilterProps = {
  section: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSection: React.Dispatch<
    SetStateAction<"doubt" | "need" | "dream" | "all">
  >;
  setAddNew?: React.Dispatch<React.SetStateAction<boolean>>;
};
