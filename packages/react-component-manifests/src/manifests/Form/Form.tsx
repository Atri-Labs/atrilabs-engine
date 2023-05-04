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
  InputNumber,
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

const Form = forwardRef<HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    custom: {
      headers?: {
        source?: "cookies" | "local-storage" | "key-value";
        key: string;
        value: string;
      }[];
      headerKey?: string;
      headerValue?: string;
      url?: string;
      target: string;
      autocomplete: string;
      showResetButton: boolean;
      showSubmitButton: boolean;
      submitButtonBgColor?: string;
      submitButtonColor?: string;
      resetButtonBgColor?: string;
      resetButtonColor?: string;
      labelColor: string;
      labelFontSize: number;
      colon?: boolean;
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
          | "select"
          | "number";
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
          id?: string;
          options?: any;
        };
        checkbox: {
          label?: string;
          id?: string;
          options?: any;
        };
        time: Pick<inputTypes, "id" | "label">;
        file: Pick<inputTypes, "id" | "label"> & {
          multiple?: boolean;
        };
        select: {
          options?: Parameters<typeof Select>;
          label?: string;
          multiple?: boolean;
          id?: string;
        };
        number: inputTypes;
      }[];
      disabled?: boolean;
    };
    onClick: (buttonClicked: "Submit" | "Reset") => void;
    id?: string;
    className?: string;
    // component?:	ComponentType | false //Set the Form rendering element. Do not create a DOM node for false
    fields?: FieldData; //Control of form fields through state management (such as redux). Not recommended for non-strong demand. View example
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
    onSuccess?: Function;
  }>((props, ref) => {
  const [form] = AntdForm.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const getCookie = (cookieName: string) => {
    let cookie: { [key: string]: string } = {};
    document.cookie.split(";").forEach(function(el) {
      let [key, value] = el.split("=");
      cookie[key.trim()] = value as string;
    });
    return cookie[cookieName];
  };

  const onFinish = async (values: any) => {
    const url = props.custom.url ? props.custom.url : "";
    const data = { ...values };
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    props.custom.headers?.forEach((header) => {
      if (header?.source === "cookies" && getCookie(header.key)) {
        headers[header.key] = getCookie(header.key);
      } else if (
        header.source === "local-storage" &&
        localStorage.getItem(header?.key)
      ) {
        headers[header?.key] = localStorage.getItem(header?.key) as string;
      } else if (header.source === "key-value" && header?.value) {
        headers[header.key] = header?.value;
      }
    });


    await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    props.onSuccess && props.onSuccess();
  };

  const formItemStyle = {
    color: props.custom.labelColor,
    fontSize: `${props.custom.labelFontSize}px`,
  };

  return (
    <div ref={ref} style={props.styles} id={props.id}>
      <AntdForm
        form={form}
        className={`${props.className} ${props.attrs?.class}`}
        style={props.styles}
        //antd style
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        target={props.custom.target}
        autoComplete={props.custom.autocomplete}
        disabled={props.custom.disabled}
        onFinish={onFinish}
        colon={props.custom?.colon}
      >
        {props.custom.form.map((element, index) => {
          if (element.selectedOption === "select")
            return (
              element.selectedOption === "select" && (
                <AntdForm.Item
                  key={
                    element[element.selectedOption]
                      ? element[element.selectedOption].id
                      : ""
                  }
                  name={
                    element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""
                  }
                  label={
                    <span style={formItemStyle}>
                      {element[element.selectedOption]
                        ? element[element.selectedOption].label
                        : ""}
                    </span>
                  }
                  id={
                    element[element.selectedOption]
                      ? element[element.selectedOption].id
                      : ""
                  }
                >
                  <Select
                    options={element?.select?.options}
                    mode={element?.select?.multiple ? "multiple" : undefined}
                  />
                </AntdForm.Item>
              )
            );
          else if (element.selectedOption === "file")
            return (
              <AntdForm.Item
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
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
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
                }
              >
                <Checkbox.Group options={element?.checkbox?.options} />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "radio")
            return (
              <AntdForm.Item
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
                }
              >
                <Radio.Group options={element?.radio?.options} />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "color")
            return (
              <AntdForm.Item
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
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
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
                }
              >
                <DatePicker style={{ width: "100%" }} />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "time")
            return (
              <AntdForm.Item
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
                }
              >
                <TimePicker style={{ width: "100%" }} />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "datetimeLocal")
            return (
              <AntdForm.Item
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
                }
              >
                <DatePicker showTime />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "number")
            return (
              <AntdForm.Item
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
                }
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={
                    element[element.selectedOption]
                      ? element[element.selectedOption].placeholder
                      : ""
                  }
                />
              </AntdForm.Item>
            );
          else if (element.selectedOption === "search")
            return (
              <AntdForm.Item
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
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
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
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
                key={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                name={
                  element[element.selectedOption]
                    ? element[element.selectedOption].label
                    : ""
                }
                label={
                  <span style={formItemStyle}>
                    {element[element.selectedOption]
                      ? element[element.selectedOption].label
                      : ""}
                  </span>
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
          {props.custom.showSubmitButton && (
            <Button
              htmlType="submit"
              style={{
                padding: "4px 15px",
                color: props.custom.submitButtonColor,
                backgroundColor: props.custom.submitButtonBgColor,
                border: "1px solid transparent",
              }}
            >
              Submit
            </Button>
          )}
          {props.custom.showResetButton && (
            <Button
              style={{
                padding: "4px 15px",
                color: props.custom.resetButtonColor,
                backgroundColor: props.custom.resetButtonBgColor,
                border: "1px solid #d9d9d9",
              }}
              onClick={onReset}
            >
              Reset
            </Button>
          )}
        </div>
      </AntdForm>
    </div>
  );
});

export default Form;
