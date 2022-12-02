export const StarUnrated: React.FC<Starprop> = ({
  unratedColor,
  ratedColor,
}) => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
        fill={unratedColor}
      />
    </svg>
  );
};
export const StarHalfRated: React.FC<Starprop> = ({
  unratedColor,
  ratedColor,
}) => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 15.275L10 6.625V0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275Z"
        fill={unratedColor}
      />
      <path
        d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0V15.275L3.825 19Z"
        fill={ratedColor}
      />
    </svg>
  );
};
export const StarRated: React.FC<Starprop> = ({ unratedColor, ratedColor }) => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
        fill={ratedColor}
      />
    </svg>
  );
};
interface Starprop {
  unratedColor: string;
  ratedColor: string;
}
