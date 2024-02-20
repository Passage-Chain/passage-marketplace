import Cookies from "js-cookie";

const SetCookie = (cookieName, userInput) => {
  Cookies.set(cookieName, userInput, {
    expires: 1, // 1 day
    secure: true,
    sameSite: 'strict',
    path: '/'
  })
}

export default SetCookie;