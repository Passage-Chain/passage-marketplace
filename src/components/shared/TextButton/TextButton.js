import {React} from "react"

function TextButton(props) {
  const buttonStyle = {
    backgroundColor: props.color,
    border: "none",
    color: "white",
    display: "inline-block",
    fontSize: "12px",
    lineHeight: "3",
    textAlign: "center",
    fontFamily: "Niveau Grotesk Bold",
    borderRadius: "21px",
    padding: "0 65%",
  };

  return (
    <div style={{ display: "inline-block" }}>
      <button style={buttonStyle}>
        {props.text}
      </button>
    </div>
  );
}

export default TextButton;
