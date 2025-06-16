// event/types.ts


export type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description?: string;
  createdBy: string;
};
