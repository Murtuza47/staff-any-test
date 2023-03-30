export interface ICreateShift {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  published: boolean;
}

export interface IUpdateShift {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  published?: boolean;
  publishedDate?: string;
  weekId?: string;
}