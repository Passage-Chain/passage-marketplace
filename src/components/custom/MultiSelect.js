import React from "react";
import Multiselect from "multiselect-react-dropdown";

import  { ReactComponent as CloseIcon}  from "../../assets/images/icon-close-x.svg"

const styles = {
  multiselectContainer: {},
  searchBox: {
    borderRadius: 30,
    border: "1px solid #101010",
    background: "#101010 0% 0% no-repeat padding-box",
    paddingLeft: "20px",
    paddingRight: "20px",
    display: "flex",
    alignItems: "center",
  },
  inputField: {
    font: "normal normal 300 20px/24px Montserrat",
    color: "#ffffff",
    padding: "8px 18px",
    width: "100%",
  },
  chips: {
    background: "#333333",
    height: 35,
    borderRadius: 18,
    marginBottom: 0,
  },
  optionContainer: {
    background: "#2E2E2E 0% 0% no-repeat padding-box",
    border: "2px solid #464646",
    borderRadius: 30,
    font: 'normal normal medium 15px/19px Montserrat',
    color: '#E3E3E3'
  },
  option: {
    background: "#2E2E2E 0% 0% no-repeat padding-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: '12px 16px'
  },
  groupHeading: {},
};

const CustomMultiSelect = ({
  options,
  selectedValues,
  width = "100%",
  height,
  placeHolder,
  optionValueDecorator = null,
  onSearch,
  onSelect,
  onRemove,
  displayValue = "name"
}) => {
  return (
    <>
      <Multiselect
        className="custom-multi-select"
        style={{ ...styles, searchBox: { ...styles.searchBox, height, width } }}
        options={options}
        selectedValues={selectedValues}
        onSelect={onSelect}
        onRemove={onRemove}
        displayValue={displayValue}
        placeholder={placeHolder}
        optionValueDecorator={optionValueDecorator ? optionValueDecorator : (name) => name}
        onSearch={onSearch}
        customCloseIcon={<CloseIcon style={{ width: 17, height: 17 }} />}
        emptyRecordMsg={null}
      />
    </>
  );
};

export default CustomMultiSelect;
