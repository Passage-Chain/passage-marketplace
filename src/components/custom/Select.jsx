import React from "react";
import { Select } from "antd";
import ArrowDownIcon from "../../assets/images-v2/dropdown.svg";
import "./index.scss";

const { Option } = Select;

const CustomSelect = ({
  options = [],
  placeHolder = "Select",
  value,
  onChange,
  style = {},
  suffixIcon = <img src={ArrowDownIcon} alt="arrow icon" />,
  label,
}) => {
  return (
    <>
      {label && <div className="custom-input-label">{label}</div>}
      <Select
        className="custom-select"
        style={style}
        suffixIcon={suffixIcon}
        placeholder={placeHolder}
        dropdownClassName="custom-select-dropdown"
        value={value}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <Option key={option.id} value={option.id}>
            {option.label}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default CustomSelect;
