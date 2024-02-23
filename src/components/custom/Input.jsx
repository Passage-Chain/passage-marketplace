import React from "react";
import { Input } from "antd";
import "./index.scss"

const { TextArea } = Input;

const CustomInput = ({
  width = "100%",
  height = 40,
  placeHolder,
  onChange,
  value,
  maxLength,
  prefix,
  rows,
  fontColor = "#ffffff",
  label,
  type = "text",
  error,
  disable,
  divWidth = "100%",
  suffix
}) => {
  return (
    <div style={{ width: divWidth }}>
      {label && (
        <div className="custom-input-label">
          {label}
        </div>
      )}
      {rows ? (
        <TextArea
          className="custom-input-area"
          style={{ color: fontColor }}
          placeholder={placeHolder}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          prefix={prefix}
          rows={rows}
          type={type}
          
        />
      ) : (
        <Input
          className="custom-input"
          style={{ height, color: fontColor }}
          placeholder={placeHolder}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          prefix={prefix}
          type={type}
          disabled={disable}
          suffix={suffix}
        />
      )}
      <div
        style={{
          font: "normal normal normal 12px/18px Open Sans",
          color: "#E82218",
          marginBottom: 2,
        }}
      >
        {error}
      </div>
    </div>
  );
};

export default CustomInput;
