export type TabbedContentProps = {
  tabs: number;
  name: string;
};

export const TabbedContent: React.FC<TabbedContentProps> = (props) => {
  return <div style={{ height: "24px" }}>{props.name}</div>;
};
