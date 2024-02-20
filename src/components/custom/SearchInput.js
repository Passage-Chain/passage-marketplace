import React, { useState } from "react";
import { Input } from "antd";
import { ReactComponent as SearchIcon } from "../../assets/images-v2/search.svg";
import "./index.scss";

const styles = {
  minSearchWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    border: "1px solid #C3CFD5",
    borderRadius: 100,
    cursor: "pointer",
  },
  searchIcon: {
    width: 12.5,
    height: 12.5,
  },
};

const SearchInput = ({
  fullWidth = false,
  placeholder = "Search...",
  value,
  onChange,
  maxLength = 50,
  expanded = false,
  style = {},
  suffix,
  prefix,
  onKeyDown = () => {}
}) => {
  const [expand, setExpand] = useState(expanded);

  const handleSearch = (e) => {
    onChange(e.target.value);
  };

  return (
    <div
      style={{ width: fullWidth ? "100%" : "default" }}
      className="custom-search-container"
    >
      {!expand ? (
        <div style={styles.minSearchWrapper}>
          <SearchIcon
            style={styles.searchIcon}
            onClick={() => setExpand(true)}
          />
        </div>
      ) : (
        <Input
          className="custom-search-input"
          placeholder={placeholder}
          onChange={handleSearch}
          value={value}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
          suffix={
            suffix || (
              <SearchIcon
                className="cursor-pointer"
                onClick={() => (expanded ? "" : setExpand(false))}
              />
            )
          }
          prefix={prefix}
          style={{ ...style }}
        />
      )}
    </div>
  );
};

export default SearchInput;
