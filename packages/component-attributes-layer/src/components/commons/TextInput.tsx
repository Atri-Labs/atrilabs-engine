import ControlledInput from "./ControlledInput";

export type TextInputProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const TextInput: React.FC<TextInputProps> = (props) => {
  return <ControlledInput value={props.value} onChange={props.onChange} />;
};
