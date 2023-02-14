import React, { forwardRef } from "react";

type inputTypes = {
  label?: string;
  id?: string;
  placeholder?: string;
};

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
        };
        checkbox: {
          label?: string;
          labels?: string[];
          id?: string[];
          value?: string[];
        };
        time: Pick<inputTypes, "id" | "label">;
        file: Pick<inputTypes, "id" | "label"> & {
          multiple?: boolean;
        };
        select: {
          selectOptions?: string[];
          selectLabel?: string;
          selectIdentifier?: string;
          multiple?: boolean;
        };
      }[];
    };
    onClick: (buttonClicked: "Submit" | "Reset") => void;
    className?: string;
  }
>((props, ref) => {
  console.log("Form", props.custom.form);
  return (
    <form
      ref={ref}
      className={props.className}
      style={props.styles}
      target={props.custom.target}
      autoComplete={props.custom.autocomplete}
    >
      {props.custom.form.map((element, index) => {
        if (element.selectedOption === "select")
          return (
            element.selectedOption === "select" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  columnGap: "1em",
                  alignItems: "baseline",
                }}
                key={index}
              >
                <label
                  htmlFor={
                    element.select ? element.select.selectIdentifier : ""
                  }
                >
                  {element.select ? element.select.selectLabel : ""}
                </label>
                <select
                  id={element.select ? element.select.selectIdentifier : ""}
                  style={{ padding: "0.5em" }}
                  multiple={element.select ? element.select.multiple : false}
                >
                  {element.select ? (
                    element.select.selectOptions?.map((option, index) => {
                      return <option key={index}>{option}</option>;
                    })
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            )
          );
        else if (element.selectedOption === "file")
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                columnGap: "1em",
                alignItems: "baseline",
              }}
              key={index}
            >
              <label htmlFor={element.file ? element.file.id : ""}>
                {element.file ? element.file.label : ""}
              </label>
              <input
                type="file"
                multiple={element.file ? element.file.multiple : false}
                id={element.file ? element.file.id : ""}
                style={{
                  padding: "0.5em",
                  width: "95px",
                  color: "transparent",
                }}
              />
            </div>
          );
        else if (element.selectedOption === "checkbox")
          return (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "end",
                columnGap: "1em",
                alignItems: "baseline",
              }}
              key={index}
            >
              <div>{element.checkbox ? element.checkbox.label : ""}</div>
              {element.checkbox &&
                element.checkbox.labels?.map((l, i) => (
                  <div key={i}>
                    <input
                      type="checkbox"
                      id={element.checkbox.id ? element.checkbox.id[i] : ""}
                      value={
                        element.checkbox.value ? element.checkbox.value[i] : ""
                      }
                    />
                    <label
                      htmlFor={
                        element.checkbox.id ? element.checkbox.id[i] : ""
                      }
                      style={{ paddingLeft: "0.5em" }}
                    >
                      {l}
                    </label>
                  </div>
                ))}
            </div>
          );
        else if (element.selectedOption === "radio")
          return (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "end",
                columnGap: "1em",
                alignItems: "baseline",
              }}
              key={index}
            >
              <div>{element.radio ? element.radio.label : ""}</div>
              {element.radio &&
                element.radio.labels?.map((l, i) => (
                  <div key={i}>
                    <input
                      type="radio"
                      id={element.radio.id ? element.radio.id[i] : ""}
                      value={element.radio.value ? element.radio.value[i] : ""}
                      name={element.radio.name || ""}
                    />
                    <label
                      htmlFor={element.radio.id ? element.radio.id[i] : ""}
                      style={{ paddingLeft: "0.5em" }}
                    >
                      {l}
                    </label>
                  </div>
                ))}
            </div>
          );
        else if (
          element.selectedOption === "color" ||
          element.selectedOption === "time" ||
          element.selectedOption === "date" ||
          element.selectedOption === "datetimeLocal"
        )
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                columnGap: "1em",
                alignItems: "baseline",
              }}
              key={index}
            >
              <label
                htmlFor={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
              >
                {element[element.selectedOption]
                  ? element[element.selectedOption].label
                  : ""}
              </label>
              <input
                type={
                  element.selectedOption === "datetimeLocal"
                    ? "datetime-local"
                    : element.selectedOption
                }
                id={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                style={{ padding: "0.5em" }}
              />
            </div>
          );
        else if (
          element.selectedOption === "text" ||
          element.selectedOption === "password" ||
          element.selectedOption === "email" ||
          element.selectedOption === "search" ||
          element.selectedOption === "url"
        )
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                columnGap: "1em",
                alignItems: "baseline",
              }}
              key={index}
            >
              <label
                htmlFor={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
              >
                {element[element.selectedOption]
                  ? element[element.selectedOption].label
                  : ""}
              </label>
              <input
                type={element.selectedOption}
                placeholder={
                  element[element.selectedOption]
                    ? element[element.selectedOption].placeholder
                    : ""
                }
                id={
                  element[element.selectedOption]
                    ? element[element.selectedOption].id
                    : ""
                }
                style={{ padding: "0.5em" }}
              />
            </div>
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
    </form>
  );
});

export default Form;
