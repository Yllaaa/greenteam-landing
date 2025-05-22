import { SetStateAction } from 'react';

export type eventFilterProps = {
  section: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSection: React.Dispatch<SetStateAction<string>>;
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
};
