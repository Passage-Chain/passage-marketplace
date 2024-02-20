import Cookies from "js-cookie";

const RemoveCookie = (cookieName, userInput) => {
  Cookies.remove(cookieName)
}

export default RemoveCookie;