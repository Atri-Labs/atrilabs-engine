import { gray900 } from "@atrilabs/design-system";

export type TextInputProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const TextInput: React.FC<TextInputProps> = (props) => {
  return (
    <input
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
        width: "100%",
      }}
    />
  );
};
