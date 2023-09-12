import type { NextApiRequest, NextApiResponse } from 'next';
import { extract } from '../../src/jwt';
import Record from '../../db/Record/Record.model';
import GRepository from '../../db/GenericCRUD.service';
import { uuid as uuid_v4 } from "uuidv4";


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

  let user;

  try {
    const accessToken = req.headers?.cookie?.replaceAll("atkn=", "");
    if (accessToken && typeof accessToken !== 'undefined') {
      const extracted = extract(accessToken);
      user = extracted.data;
    }

  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
  
  
  

  if (req.method === "GET") {
    try {
      const recordRepo = new GRepository(Record, "Record");
      const query = req.query;
      let found: any;
      if (query.page === "all") {
        found = await recordRepo.getAll();
      } else {
        found = await recordRepo.getAll({ page: query.page });
      }
      return res.status(200).send({ success: true, data: found });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }




  else if (req.method === "POST") {

    try {

      const recordRepo = new GRepository(Record, "Record");

      if (req.query["createType"] && req.query["createType"] === "multi") {
        let recordsToAdd = [];
        for await (const record of req.body) {
          const sameRecord = await recordRepo.getAll({
            page: req.query.page,
            data: record
          });
          if(sameRecord.length <= 1){
            recordsToAdd.push({
              id: uuid_v4(),
              page: req.query.page,
              data: record,
              author: user.name,
              assignedUsers: [user.name]
            })
          }
        }
        const created = await recordRepo.setMulti(recordsToAdd);
        return res.status(200).send({ success: true, data: created });
      }

      const sameRecord = await recordRepo.getAll({
        page: req.body.page,
        data: req.body.data
      });

      if(sameRecord.length <= 1){
        let tmpRow: any = {
          id: uuid_v4(),
          page: req.body.page,
          data: req.body.data,
          author: user.name,
          assignedUsers: [user.name]
        };
  
        const created = await recordRepo.setOne(tmpRow);
        return res.status(200).send({ success: true, data: created });
      }

      
      return res.status(500).send({ success: false, message: "There are already similar 2 records (maximum duplicates: 1)" });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }

  }




  else if (req.method === "PUT") {
    try {
      const recordRepo = new GRepository(Record, "Record");
      const found: any = await recordRepo.getOne({ id: req.body.key });
      const recordProps = Object.keys(found);

      let newRecord: any = { data: {} };

      for await (const col of recordProps) {
        if (col !== "data") {
          newRecord[col] = typeof req.body[col] !== 'undefined' ? req.body[col] : "";
        }
      }
      for await (const col of Object.keys(req.body)) {
        if (!Object.keys(newRecord).includes(col)) {
          if (col !== "key") {
            newRecord["data"] = { ...newRecord["data"], [col]: typeof req.body[col] !== 'undefined' ? req.body[col] : "" }
          }
        }
      }

      newRecord["page"] = found["page"];

      const updatedRecord: any = await recordRepo.updateOne({ id: found.id }, {...newRecord, author: found.author});
      return res.status(200).send({ success: true, data: updatedRecord });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }




  else if (req.method === "DELETE") {
    try {
      const recordRepo = new GRepository(Record, "Record");
      if (req.query.entity === "page") {
        await recordRepo.removeAll({ page: req?.query?.page });
        return res.status(200).send({ success: true });
      } else {
        const id: any = req.query.id;
        await recordRepo.removeOne({ id });
        return res.status(200).send({ success: true, data: { id: id } });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }

}
