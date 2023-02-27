import React, {
  forwardRef,
  ReactNode,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
} from "react";
import { Input, InputRef } from "antd";
const SearchInput = Input.Search;

const Search = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom: { value: string; placeholder: string };
    enterButton?: boolean | ReactNode; //Whether to show an enter button after input. This property conflicts with the addonAfter property
    loading?: boolean; //Search box with loading
    onSearch: (value: string, event?: any) => void; //The callback function triggered when you click on the search-icon or press the Enter key
    // @TODO: Need to check any type
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  return (
    <SearchInput
      ref={(node: InputRef) => {
        if (typeof ref === "function") {
          ref(node?.input || null);
        } else if (ref) {
          ref.current = node?.input || null;
        }
      }}
      {...restProps}
      {...custom}
      value={props.custom.value}
    />
  );
});

export default Search;
