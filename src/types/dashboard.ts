import type { StaticImageData } from "next/image";

export type DashboardRequest = {
  id: number;
  title: string;
  context: string;
  status: string;
  time: string;
  image: StaticImageData;
  needsReview: boolean;
  detail: string;
};
