import React from "react";
import { StarHalfRated, StarRated, StarUnrated } from "./components";
export const RatingContainer: React.FC<RatingContainerProp> = ({
  total,
  rating,
  unratedColor,
  ratedColor,
}) => {
  const fullRatings = Math.floor(rating);
  const halfRatings = Math.ceil(rating) - fullRatings;
  const nonRatings = total - Math.ceil(rating);
  const fullRatingStars = Array.from(Array(fullRatings).keys()).map(
    (_, index) => {
      return (
        <StarRated
          key={index.toString()}
          unratedColor={unratedColor}
          ratedColor={ratedColor}
        ></StarRated>
      );
    }
  );
  const halfRatingStars = Array.from(Array(halfRatings).keys()).map(
    (_, index) => {
      return (
        <StarHalfRated
          key={index.toString()}
          unratedColor={unratedColor}
          ratedColor={ratedColor}
        ></StarHalfRated>
      );
    }
  );
  let nonRatingStars;
  if (nonRatings >= 0) {
    nonRatingStars = Array.from(Array(nonRatings).keys()).map((_, index) => {
      return (
        <StarUnrated
          key={index.toString()}
          unratedColor={unratedColor}
          ratedColor={ratedColor}
        ></StarUnrated>
      );
    });
  }
  return (
    <div>
      {fullRatingStars}
      {halfRatingStars}
      {nonRatingStars}
    </div>
  );
};
interface RatingContainerProp {
  total: number;
  rating: number;
  unratedColor: string;
  ratedColor: string;
}
