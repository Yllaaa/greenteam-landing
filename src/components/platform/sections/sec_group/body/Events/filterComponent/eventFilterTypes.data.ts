import { SetStateAction } from "react";

export type eventFilterProps = {
  section?: string;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  setSection?: React.Dispatch<
    SetStateAction<
      "social" | "volunteering%26work" | "talks%26workshops" | "all"
    >
  >;
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
};
