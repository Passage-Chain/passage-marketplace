import React from "react";

const colors = {
  error: {
    background: "none",
    border: "#EC6363",
    color: "#EC6363",
  },
  primary: {
    background: "none",
    border: "#ffffff",
    color: "#FFFFFF",
  },
  white: {
    background: '#ffffff',
    border: "#000000",
    color: "#000000",
  }
};

const Button = ({ label, icon, type = "primary", onClick, btnStyle = {}, labelStyle = {}, disabled }) => {
  return (
    <button
      className={disabled ? 'btn-disabled' : ''}
      style={{
        height: 40,
        padding: "17px 11px",
        background: colors[type]?.background,
        border: `1.5px solid ${colors[type]?.border}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 29,
        gap: 8,
        minWidth: 107,
        cursor: "pointer",
        fontFamily: 'Ignazio Text',
        ...btnStyle,
      }}
      onClick={onClick}
    >
      {icon && <img src={icon} width={10} alt={'image_icon'} />}
      <span
        style={{
          fontSize: 14,
          color: colors[type]?.color,
          fontFamily: 'Ignazio Text',
          ...labelStyle
        }}
      >
        {label}
      </span>
    </button>
  );
};

export default Button;
