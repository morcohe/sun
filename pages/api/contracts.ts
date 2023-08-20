import type { NextApiRequest, NextApiResponse } from 'next';
import { create, createMulti, findAll, update, remove } from '../../db/Contract/Contract.repository';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const contracts = await findAll();
      console.log(req.body);
      return res.status(200).send({ success: true, data: contracts });
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
      const createdContract = await create(req.body);
      return res.status(200).send({ success: true, data: createdContract });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedContract: any = await update(req.body.key, req.body);
      return res.status(200).send({ success: true, data: { id: updatedContract?.id } });
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
