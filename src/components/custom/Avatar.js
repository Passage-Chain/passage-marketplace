import React from "react";
import { ReactComponent as UserIcon } from "../../assets/images/icon-user.svg";

export default function ({ image, name, size, color, icon }) {
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #393939",
      }}
    >
      {(image && (
        <img
          className="circular_border"
          alt="avatar"
          src={image}
          width={size}
          height={size}
        />
      )) ||
        icon ||
        (name && (
          <span
            style={{
              fontFamily: "Montserrat",
              color: "#fff",
              textTransform: "capitalize",
              textAlign: "center",
              fontWeight: 600,
              width: size,
            }}
          >
            {getInitials(name)}
          </span>
        )) || <UserIcon />}
    </div>
  );
}
