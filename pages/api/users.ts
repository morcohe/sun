// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { create, createMulti, findAll, update, remove } from '../../db/User/User.repository';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const users = await findAll();
      console.log(req.body);
      return res.status(200).send({ success: true, data: users });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } else if (req.method === "POST") {
    try {
      console.log("QUERY: ", req.query)
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
