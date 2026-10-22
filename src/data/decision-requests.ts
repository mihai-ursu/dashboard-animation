import type { DashboardRequest } from "@/types/dashboard";

// Static imports give precompressed thumbnails content-hashed, cacheable URLs.
import apartmentsAvatar from "@/assets/avatars/apartments.webp";
import houseAvatar from "@/assets/avatars/house.webp";
import ownerAvatar from "@/assets/avatars/owner.webp";
import propertyAvatar from "@/assets/avatars/property.webp";
import residentAvatar from "@/assets/avatars/resident.webp";

export const visibleRequestLimit = 5;

export const dashboardCopy = {
  comparisonTitle: "Dashboard before and after comparison",
  before: "Before",
  after: "After",
  heading: "Ready for your approval",
  description: "Prioritized for you. Every action waits for your go-ahead.",
  pendingRequests: "pending requests",
  viewAll: "View all",
  showLess: "Show less",
  review: "Review",
  approve: "Approve",
  done: "Done",
  close: "Close",
  approveRequest: "Approve request",
  emptyMessage: "You’re all caught up. No approvals waiting.",
};

export const initialRequests: DashboardRequest[] = [
  {
    id: 1,
    title: "Book an electrician for a $480 repair",
    context: "Maintenance agent · 38 Oak St, Unit 3",
    status: "Above spending limit",
    time: "14 min",
    image: houseAvatar,
    needsReview: true,
    detail: "The kitchen outlets need a repair. The electrician quoted $480, which exceeds the property's automatic approval limit of $350.",
  },
  {
    id: 2,
    title: "Reply to Emma and arrange Friday’s viewing",
    context: "Leasing agent · 640 Park Ave, Unit 2B",
    status: "Within guidelines",
    time: "5 min",
    image: residentAvatar,
    needsReview: false,
    detail: "Confirm Emma's viewing for Friday at 2 pm and send the property access instructions.",
  },
  {
    id: 3,
    title: "Send Daniel Chen his October summary",
    context: "Owner agent · 3 properties, 18 units",
    status: "Within guidelines",
    time: "28 min",
    image: ownerAvatar,
    needsReview: false,
    detail: "Send the monthly owner summary covering rental income, maintenance expenses, and occupancy across all three properties.",
  },
  {
    id: 4,
    title: "Renew the lease at the existing rate",
    context: "Leasing agent · Willow Court, Unit 8A",
    status: "Renewal decision",
    time: "1 h",
    image: apartmentsAvatar,
    needsReview: true,
    detail: "The current resident requested a 12-month renewal. Review the proposed renewal at the existing monthly rent.",
  },
  {
    id: 5,
    title: "Deliver a 48-hour inspection notice",
    context: "Maintenance agent · 52 Birch Rd, Unit 5",
    status: "Entry notice",
    time: "2 h",
    image: propertyAvatar,
    needsReview: true,
    detail: "Review the notice for the upcoming routine property inspection before it is delivered to the resident.",
  },
  {
    id: 6,
    title: "Confirm the courtyard landscaping visit",
    context: "Maintenance agent · Willow Court",
    status: "Within guidelines",
    time: "3 h",
    image: apartmentsAvatar,
    needsReview: false,
    detail: "Confirm the scheduled landscaping visit for the shared courtyard on Monday morning.",
  },
  {
    id: 7,
    title: "Send a welcome message to the new resident",
    context: "Leasing agent · 38 Oak St, Unit 1",
    status: "Within guidelines",
    time: "4 h",
    image: houseAvatar,
    needsReview: false,
    detail: "Send the new resident their welcome message with move-in details and the property contact information.",
  },
];
