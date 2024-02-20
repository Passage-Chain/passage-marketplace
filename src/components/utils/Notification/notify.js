import store from "../../../store";
import {
  setNotification,
  setType,
  remove,
  truncate,
  setVisibility
} from "../../../redux/notificationSlice";

const TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

const notify = (notification, type) => {
  const options = {
    ...notification,
    time: notification.time || new Date(),
    type: type || TYPES.SUCCESS
  }
  store.dispatch(setNotification(options))
  store.dispatch(setVisibility(true))
};

const clear = (index) => {
  store.dispatch(remove(index))
}

const clearAll = () => {
  store.dispatch(truncate())
}

const hide = () => {
  store.dispatch(setVisibility(false))
  clearAll()
}

const show = () => {
  store.dispatch(setVisibility(true))
}

class Notify {
  static success(notification) {
    notify(notification, TYPES.SUCCESS);
  }
  static error(notification) {
    /*notify(notification, TYPES.ERROR);*/
  }
  static info(notification) {
    notify(notification, TYPES.INFO);
  }
  static clear(index) {
    clear(index)
  }
  static clearAll() {
    clearAll()
  }
  static hide() {
    hide()
  }
  static show() {
    show()
  }
}

export default Notify;
