import { toast } from "react-toastify";
import Error_Notification from "../../assets/images/error_notification.png";
import Success_Notification from "../../assets/images/success_notification.png";

import CloseIcon from "../../assets/images/icon-cross.svg";

const styles = {
  container: {
    height: "100%",
    width: "100%",
    bottom: 0,
    right: 0,
    zIndex: 9999,
    display: "flex",
    gap: 10,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
    padding: 6,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "column",
  },
  headerTxt: {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
  },
  headerError: {
    color: "#DE4729",
  },
  headerSuccess: {
    color: "#6ABE69",
  },
  close: {
    height: 17,
    width: 17,
    fill: "#ffffff",
    opacity: 1,
  },
  body: {
    cursor: "pointer",
    lineHeight: 1.3,
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 12,
    color: "#9A9C9D",
    marginLeft: 32,
  },
  toast: {
    width: 436,
    borderRadius: 13,
    boxSizing: "border-box",
    position: "relative",
    padding: 0,
  },
  timeStamp: {
    marginRight: 5,
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 10,
    color: "#C4C4C4",
  },
  left: {
    padding: 5,
  },
  middle: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 5,
  },
  right: {
    position: "absolute",
    top: 5,
    right: 10,
  },
};

function ToastContent({ title, children, onClose, type, logo, onClick }) {
  return (
    <div style={{ ...styles.container }}>
      <div style={{ ...styles.left }}>
        {type === "ERROR" ? (
          <img src={Error_Notification} alt="Error" />
        ) : (
          logo || <img src={Success_Notification} alt="Success" />
        )}
      </div>

      <div style={{ ...styles.middle }} onClick={() => onClick && onClick()}>
        {type === "ERROR" ? (
          <span style={{ ...styles.headerTxt, ...styles.headerError }}>
            {title}
          </span>
        ) : (
          <span style={{ ...styles.headerTxt, ...styles.headerSuccess }}>
            {title}
          </span>
        )}
        {children}
      </div>

      <span style={{ ...styles.right }}>
        <span style={{ ...styles.timeStamp }}>Now</span>
        <img
          style={{ cursor: "pointer" }}
          src={CloseIcon}
          height={10}
          width={10}
          alt="Cross"
          onClick={onClose}
        />
      </span>
    </div>
  );
}

const TYPES = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
};

const getToast = (title = "Notification", content, meta = {}, type) => {
  toast(
    ({ closeToast }) => (
      <ToastContent
        onClose={closeToast}
        title={title}
        type={type}
        logo={meta?.logo}
        onClick={meta?.handleClick}
      >
        {content}
      </ToastContent>
    ),
    {
      closeButton: false,
      hideProgressBar: true,
      style: {
        ...styles.toast,
        //border: `1px solid ${COLORS[type]}`,
        ...meta?.style,
      },
      autoClose: 5000,
    }
  );
};

class Toast {
  static success(title, content, meta) {
    getToast(title, content, meta, TYPES.SUCCESS);
  }
  static error(title, content, meta) {
    getToast(title, content, meta, TYPES.ERROR);
  }
  static info(title, content, meta) {
    getToast(title, content, meta, TYPES.INFO);
  }
  // Simplify errors from smart contracts
  static contractError(content, meta) {
    try {
      getToast("Error", content.split(".")[0], meta, TYPES.ERROR);
    } catch (e) {
      getToast("Error", content, meta, TYPES.ERROR);
    }
  }
}

export default Toast;
