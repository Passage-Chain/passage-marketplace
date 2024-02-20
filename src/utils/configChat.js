import { StreamChat } from "stream-chat";
import { STREAM_API_KEY } from "../configs";
// import { getSecretKey } from '../components/Chat/utils';

export async function initiateChat(account) {
  const client = StreamChat.getInstance(STREAM_API_KEY);

  const secretKey = "test";
  try {
    await client.connectUser(
      {
        id: account.id,
        name: account.username,
      },
      "secretKey"
    );
  } catch (err) {
    console.log("error", err);
  }

  return client;
}
