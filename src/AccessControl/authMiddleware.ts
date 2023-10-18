import { extract } from '../jwt';


export const getAuthenticatedUser = async (cookies: string | undefined) => {

  if (!cookies) {
    console.log(NOT_DEFINED);
    throw new Error(NOT_DEFINED);
  }

  const splittedCookies: Array<string> = cookies?.split(" ");
  for await (const cookie of splittedCookies) {
    if (cookie.startsWith(PREFIX)) {
      const accessToken = cookie?.replaceAll(PREFIX, "");
      if (accessToken && typeof accessToken !== 'undefined') {
        const extracted = extract(accessToken);
        return extracted.data;
      } else {
        console.log(WRONG);
        throw new Error(WRONG);
      }
    }
  }

  console.log(NOT_FOUND)
  throw new Error(NOT_FOUND);

}


const WRONG = "[Extract Cookie Error] Something is wrong with the cookie";
const NOT_DEFINED = "[Extract Cookie Error] Received undefined cookied";
const NOT_FOUND = "[Extract Cookie Error] Cookie not found";

const PREFIX = "atkn=";