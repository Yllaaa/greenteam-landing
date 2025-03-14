import { Challenge } from "../../GreenTypes/GreenTypes";
export type Props = {
  challenges: Challenge[];
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
};
