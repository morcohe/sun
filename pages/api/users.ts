import type { NextApiRequest, NextApiResponse } from 'next';
import { create, createMulti, findAll, update, remove } from '../../db/User/User.repository';
import { getAuthenticatedUser } from '../../src/AccessControl/authMiddleware';


export const config = {
  api: {
      bodyParser: {
          sizeLimit: '50mb',
      },
  },
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  let user: any;

  try {
    user = await getAuthenticatedUser(req.headers?.cookie);
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }


  if (req.method === "GET") {
    try {
      const users = await findAll();
      return res.status(200).send({ success: true, data: users });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } else if (req.method === "POST") {
    try {
      const createType = req.query["createType"];
      if(createType && createType === "multi"){
        const created = await createMulti(req.body);
        return res.status(200).send({ success: true, data: created });
      }
      const createdUser = await create(req.body);
      return res.status(200).send({ success: true, data: createdUser });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedUser: any = await update(req.body.key, req.body);
      return res.status(200).send({ success: true, data: { id: updatedUser?.id } });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } else if (req.method === "DELETE") {
    try {
      const id: any = req.query.id;
      await remove(id);
      return res.status(200).send({ success: true, data: { id: id } });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }

}
