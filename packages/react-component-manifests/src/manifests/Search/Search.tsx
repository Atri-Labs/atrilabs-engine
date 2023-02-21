import React, {
  forwardRef,
  ReactNode,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
} from "react";
import { Input } from "antd";
const SearchInput = Input.Search;

const Search = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { value: string; placeholder: string };
    enterButton?: boolean | ReactNode; //Whether to show an enter button after input. This property conflicts with the addonAfter property
    loading?: boolean; //Search box with loading
    onSearch: (value: string, event?: any) => void; //The callback function triggered when you click on the search-icon or press the Enter key
    // @TODO: Need to check any type
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  return <SearchInput {...restProps} {...custom} />;
});

export default Search;
