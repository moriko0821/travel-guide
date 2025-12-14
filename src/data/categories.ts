export type CategoryFilterType =
  | "all"
  | "city"
  | "nature"
  | "restaurant"
  | "museum"
  | "hotel"
  | "other";

export const CATEGORY_OPTIONS: { value: Exclude<CategoryFilterType, "all"> }[] =
  [
    { value: "city" },
    { value: "nature" },
    { value: "restaurant" },
    { value: "museum" },
    { value: "hotel" },
    { value: "other" },
  ];
