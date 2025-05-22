/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction } from 'react';

export type eventFilterProps = {
  section: any;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSection: React.Dispatch<SetStateAction<any>>;
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
};
