export const StarUnrated: React.FC<Starprop> = ({
  unratedColor,
  ratedColor,
}) => {
  return (
    <svg
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.34214 21.957L7.02735 14.6078L7.09416 14.3165L6.86916 14.1197L1.21204 9.17209L8.68362 8.51783L8.98446 8.49149L9.10116 8.21295L12 1.29392L14.8988 8.21295L15.0155 8.49149L15.3164 8.51783L22.788 9.17209L17.1308 14.1197L16.9058 14.3165L16.9726 14.6078L18.6579 21.957L12.2599 18.0637L12 17.9055L11.7401 18.0637L5.34214 21.957Z"
        fill={unratedColor}
        stroke="none"
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
      width="24"
      height="23"
      viewBox="0 0 24 23"
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
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.34214 21.957L7.02735 14.6078L7.09416 14.3165L6.86916 14.1197L1.21204 9.17209L8.68362 8.51783L8.98446 8.49149L9.10116 8.21295L12 1.29392L14.8988 8.21295L15.0155 8.49149L15.3164 8.51783L22.788 9.17209L17.1308 14.1197L16.9058 14.3165L16.9726 14.6078L18.6579 21.957L12.2599 18.0637L12 17.9055L11.7401 18.0637L5.34214 21.957Z"
        fill={ratedColor}
        stroke="none"
      />
    </svg>
  );
};
interface Starprop {
  unratedColor: string;
  ratedColor: string;
}
