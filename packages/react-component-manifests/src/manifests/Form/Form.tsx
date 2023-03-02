import React, { forwardRef } from "react";
import {
  Form as AntdForm,
  Upload,
  Button,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Checkbox,
  Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

type inputTypes = {
  label?: string;
  id?: string;
  placeholder?: string;
};

const enum LabelAlign {
  LEFT = "left",
  RIGHT = "right",
}

const enum FormLayout {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
  INLINE = "inline",
}

const enum ComponentSize {
  SMALL = "small",
  MIDDLE = "middle",
  LARGE = "large",
}
interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const Form = forwardRef<
  HTMLFormElement,
  {
    styles: React.CSSProperties;
    custom: {
      target: string;
      autocomplete: string;
      showResetButton: boolean;
      submitButtonBgColor?: string;
      submitButtonColor?: string;
      resetButtonBgColor?: string;
      resetButtonColor?: string;
      form: {
        selectedOption:
          | "none"
          | "text"
          | "password"
          | "color"
          | "date"
          | "datetimeLocal"
          | "email"
          | "url"
          | "search"
          | "radio"
          | "checkbox"
          | "time"
          | "file"
          | "select";
        text: inputTypes;
        password: inputTypes;
        color: Pick<inputTypes, "id" | "label">;
        date: Pick<inputTypes, "id" | "label">;
        datetimeLocal: Pick<inputTypes, "id" | "label">;
        email: inputTypes;
        url: inputTypes;
        search: inputTypes;
        radio: {
          label?: string;
          name?: string;
          labels?: string[];
          id?: string[];
          value?: string[];
          selectOptions?: any;
        };
        checkbox: {
          label?: string;
          labels?: string[];
          id?: string[];
          value?: string[];
          selectOptions?: any;
        };
        time: Pick<inputTypes, "id" | "label">;
        file: Pick<inputTypes, "id" | "label"> & {
          multiple?: boolean;
        };
        select: {
          selectOptions?: any;
          //selectOptions?: string[];
          selectLabel?: string;
          selectIdentifier?: string;
          multiple?: boolean;
        };
      }[];
    };
    onClick: (buttonClicked: "Submit" | "Reset") => void;
    className?: string;

    colon?: boolean; //Configure the default value of colon for Form.Item. Indicates whether the colon after the label is displayed (only effective when prop layout is horizontal)
    disabled?: boolean; //Set form component disable, only available for antd components
    // component?:	ComponentType | false //Set the Form rendering element. Do not create a DOM node for false
    fields?: FieldData; //Control of form fields through state management (such as redux). Not recommended for non-strong demand. View example
    //form?:
    initialValues?: object; //Set value by Form initialization or reset
    labelAlign?: LabelAlign; //The text align of label of all items left | right
    labelWrap?: boolean; //whether label can be wrap
    labelCol?: object; //Label layout, like <Col> component. Set span offset value like {span: 3, offset: 12} or sm: {span: 3, offset: 12}
    layout?: FormLayout; //Form layout	horizontal | vertical | inline
    name?: string; //Form name. Will be the prefix of Field id
    preserve?: boolean; //Keep field value even when field removed
    requiredMark?: boolean | "optional"; //Required mark style. Can use required mark or optional mark. You can not config to single Form.Item since this is a Form level config
    scrollToFirstError?: boolean; //| Options //Auto scroll to first failed field when submit
    size?: ComponentSize; //Set field component size (antd components only)
    //validateMessages?:	ValidateMessages //Validation prompt template, description see below
    validateTrigger?: string | string[]; //Config field validate trigger
    wrapperCol?: object; //The layout for input controls, same as labelCol
    onFieldsChange?: Function; //	Trigger when field updated
    onFinish?: Function; //	Trigger after submitting the form and verifying data successfully
    onFinishFailed?: Function; //	Trigger after submitting the form and verifying data failed
    onValuesChange?: Function; //Trigger when value updated
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  return (
    <div ref={ref} style={props.styles}>
      <AntdForm
        className={props.className}
        style={props.styles}
        //antd style
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        target={props.custom.target}
        autoComplete={props.custom.autocomplete}
      >
        {props.custom.form.map((element, index) => {
          if (element.selectedOption === "select")
            return (
              element.selectedOption === "select" && (
                <AntdForm.Item
                  label={
                    element[element.selectedOption]
                      ? element[element.selectedOption].selectLabel
                      : ""
                  }
                >
                  <Select options={element?.select?.selectOptions} />
                </AntdForm.Item>
              )
            );
          else if (element.selectedOption === "file")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <Upload>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </AntdForm.Item>
            );
          else if (element.selectedOption === "checkbox")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <Checkbox.Group options={element?.checkbox?.selectOptions} />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "radio")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <Radio.Group options={element?.radio?.selectOptions} />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "color")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <input
                  type={element.selectedOption}
                  id={
                    element[element.selectedOption]
                      ? element[element.selectedOption].id
                      : ""
                  }
                />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "date")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <DatePicker />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "time")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <TimePicker />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "datetimeLocal")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <DatePicker showTime />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "search")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <Input.Search
                  placeholder={
                    element[element.selectedOption]
                      ? element[element.selectedOption].placeholder
                      : ""
                  }
                />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "password")
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <Input.Password
                  placeholder={
                    element[element.selectedOption]
                      ? element[element.selectedOption].placeholder
                      : ""
                  }
                />
              </AntdForm.Item>
            );
          else if (
            element.selectedOption === "text" ||
            element.selectedOption === "email" ||
            element.selectedOption === "url"
          )
            return (
              <AntdForm.Item
                label={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
              >
                <Input
                  placeholder={
                    element[element.selectedOption]
                      ? element[element.selectedOption].placeholder
                      : ""
                  }
                />
              </AntdForm.Item>
            );
          return <div key={index}></div>;
        })}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
            alignItems: "baseline",
          }}
        >
          <button
            style={{
              padding: "4px 15px",
              color: props.custom.submitButtonColor,
              backgroundColor: props.custom.submitButtonBgColor,
              border: "1px solid transparent",
            }}
          >
            Submit
          </button>
          {props.custom.showResetButton && (
            <button
              style={{
                padding: "4px 15px",
                color: props.custom.resetButtonColor,
                backgroundColor: props.custom.resetButtonBgColor,
                border: "1px solid #d9d9d9",
              }}
            >
              Reset
            </button>
          )}
        </div>
      </AntdForm>
    </div>
  );
});

export default Form;
