import type { NextApiRequest, NextApiResponse } from 'next'
import { findByEmail } from '../../db/User/User.repository';
import { validateUser } from '../../src/handleHash';
import { sign, extract } from '../../src/jwt';
import { setCookie, deleteCookie, removeCookies } from 'cookies-next';
//import { ac } from '../../src/AccessControl';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  //check login credentials and if are valid authorize the user 
  if (req.method === "POST") {
    try {
      const credentials = req.body;
      if (typeof credentials.email === 'string' && typeof credentials.password === 'string') {
        const user = await findByEmail(credentials.email);
        const isValid = await validateUser(user.hash, credentials.password);
        
        if (isValid) {
          const token = sign({ id: user.id, name: user.name, email: user.email, role: user.role });
          console.log(">>>>TOKEN IS VALID!!: ", user, token)
          setCookie('atkn', token, {
            req, res,
            maxAge: 60 * 59, // 59 minutes
            //secure: true,
            httpOnly: true,
            //path: '/',
            sameSite: 'lax'
          });

          return res.status(200).send({
            success: true, data: {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
              }
            }
          });
        } else {
          return res.status(401).send({ success: false, message: "Invalid Credentials" });
        }
      } else {
        console.log("INVALID CREDENTIALS: ", credentials);
        return res.status(401).send({ success: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }


  //check user authentication
  else if (req.method === "GET") {
    try {

      let accessToken: any = "";

      try {
        accessToken = req.headers.authorization?.replaceAll("Bearer ", "");
        if (accessToken.includes("undefined")) {
          return res.status(401).send("Token Expired");
        }
      } catch (error) {
        return res.status(401).send("Unauthorized");
      }

      if (accessToken && typeof accessToken !== 'undefined') {
        const extracted = extract(accessToken);
        console.log("accessToken: ", accessToken)
        if (extracted.expired === true) {
          return res.status(401).send("Token Expired");
        } else {
          if (typeof req.query["page"] === "string") {
            // const hasAccess = await ac(req.query["page"], extracted.data.role);
            // if (hasAccess) {
            //   return res.status(200).send({ success: true, message: "REDIRECT", data: "/dashboard" });
            // }
            const user = {
              id: extracted?.data?.id,
              name: extracted?.data?.name,
              email: extracted?.data?.email,
              role: extracted?.data?.role,
              lastActivate: extracted?.data?.lastActive
            }
            return res.status(200).send({ success: true, message: "allowed", data: user });
          }

          return res.status(404).send({ success: false, message: "Page is not exist" });
        }
      }
      else {
        return res.status(500).send({ success: false, message: "Access token type must be string" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }

  else if (req.method === "DELETE") {
    try {

      try {
        removeCookies("atkn", { req, res });
        return res.status(200).send({ success: true });
      } catch (error) {
        deleteCookie("atkn", { req, res });
        return res.status(200).send({ success: true });
      }
      

    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }
}




