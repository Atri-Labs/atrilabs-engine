export type DragTemplateCompType = {
  text: string;
};

export const DragTemplateComp: React.FC<DragTemplateCompType> = (props) => {
  return <div>{props.text}</div>;
};
