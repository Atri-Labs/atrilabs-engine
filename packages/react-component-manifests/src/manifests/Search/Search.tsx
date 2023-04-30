import React, { forwardRef, ReactNode } from "react";
import { Input } from "antd";

const SearchInput = Input.Search;

export enum InputSize {
  LARGE = "large",
  MIDDLE = "middle",
  SMALL = "small",
}

export enum InputStatus {
  ERROR = "error",
  WARNING = "warning",
}

const Search = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    id?: string;
    className?: string;
    custom: {
      enterButton?: boolean | ReactNode; //Whether to show an enter button after input. This property conflicts with the addonAfter property
      loading?: boolean; //Search box with loading
      onSearch: (
        value: string,
        event?:
          | React.ChangeEvent<HTMLInputElement>
          | React.MouseEvent<HTMLElement>
          | React.KeyboardEvent<HTMLInputElement>
      ) => void; //The callback function triggered when you click on the search-icon or press the Enter key
      value: string;
      placeholder: string;
      isPasswordField?: boolean;
      size?: InputSize; //The size of the input box. Note: in the context of a form, the middle size is used	large | middle | small
      addonAfter?: ReactNode; //The label text displayed after (on the right side of) the input field
      addonBefore?: ReactNode; //The label text displayed before (on the left side of) the input field
      allowClear?: boolean | { clearIcon: ReactNode }; //	If allow to remove input content with clear icon
      bordered?: boolean; //Whether has border style
      defaultValue?: string; //The initial input content
      disabled?: boolean; //Whether the input is disabled
      id?: string; //The ID for input
      maxLength?: number; //The max length
      showCount?:
        | boolean
        | {
            formatter: (info: {
              value: string;
              count: number;
              maxLength?: number;
            }) => ReactNode;
          }; //Whether show text count
      status?: InputStatus; //Set validation status	'error' | 'warning'
      prefix?: ReactNode; //The prefix icon for the Input
      suffix?: ReactNode; //The suffix icon for the Input
      type?: string; //The type of input, see: MDN( use Input.TextArea instead of type="textarea")
    };
  }
>((props, ref) => {
  const { custom } = props;
  return (
    // moved ref to div, while passing prefix and suffix ref was losing focus and the selection was not working without refreshing the editor
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <SearchInput
        style={props.styles}
        className={props.className}
        {...custom}
      />
    </div>
  );
});

export default Search;
