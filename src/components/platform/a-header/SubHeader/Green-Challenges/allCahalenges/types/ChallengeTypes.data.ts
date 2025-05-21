/* eslint-disable @typescript-eslint/no-explicit-any */
import { Challenge } from '../../GreenTypes/GreenTypes';
export type Props = {
  challenges: Challenge[];
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  setChallengeId: React.Dispatch<React.SetStateAction<string>>;
  setDoItModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  acceptDo: any;
};
