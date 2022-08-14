import { gray900 } from "@atrilabs/design-system";

export type NumberInputProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const NumberInput: React.FC<NumberInputProps> = (props) => {
  return (
    <input
      type={"number"}
      value={props.value}
      onChange={props.onChange}
      style={{
        height: "25px",
        backgroundColor: gray900,
        border: "none",
        outline: "none",
        color: "white",
        padding: "0 4px",
        minWidth: "none",
        width: "calc(100% - 0.5rem)",
      }}
    />
  );
};
