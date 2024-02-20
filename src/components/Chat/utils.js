import moment from 'moment'
import chatService from "../../services/chatService"

export const getFormatedTime = (date, hour12 = true) => {
  if (!date) return "";
  const dateObj = new Date(date);
  const formatedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12
  });

  return formatedTime;
};

export const getFormatedDate = date => {
  if (!date) return "";
  const dateObj = new Date(date);
  const yyyy = dateObj.getFullYear();
  let mm = dateObj.getMonth() + 1; 
  let dd = dateObj.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = mm + '/' + dd + '/' + yyyy;
  return formattedToday
}

export const isPastDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const now = new Date()
  now.setHours(0,0,0,0);
  return dateObj < now
}

export const getDurationFromNow = (date) => {
  return moment(date).fromNow()
}

export const getSecretKey = async () => {
  try {
    const response = await chatService.getChatSecretKey()
    return response.data?.token
  } catch (err) {
    console.log(err)
  }
}