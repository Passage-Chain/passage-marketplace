import store from "../store"

export const STREAM_API_KEY = "pnnhx5jm4h3a"

export const ENABLE_PHOTO_UPLOAD = false;

export const getToken = () => {
  const state = store.getState()
  return state?.account?.token
}

export const validateEmail = (email) => {
  const emailRegex = new RegExp(
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
  );
  return emailRegex.test(email)
}

export const validateUserName = (userName) => {
  const userNameRegex = new RegExp(/^[a-zA-Z0-9_ ]*$/i)
  return userNameRegex.test(userName)
}
