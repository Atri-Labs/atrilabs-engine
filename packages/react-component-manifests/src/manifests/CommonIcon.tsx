export type CommonIconsProps = {
  name: string;
  svg: React.FC;
};

export const CommonIcon: React.FC<CommonIconsProps> = (props) => {
  return <div>{props.name}</div>;
};
