import type { NextApiRequest, NextApiResponse } from 'next';
import { create, createMulti, findAll, update, remove } from '../../db/Property/Property.repository';
import { extract } from '../../src/jwt';


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
      let properties: any;
      if(user.role === "Seeking"){
        properties = await findAll({ where: { addedBy: user.id } });
      } 
      else if(user.role === "Marketing"){
        const allowedColumns = ["code", "condo", "priceRent", "pricePostForSale", "mark", "status", "dateForUpdate"];
        properties = await findAll();
        let filtered = [];
        for await (const col of properties){
          filtered.push({
            "code": col.code, 
            "condo": col.condo, 
            "priceRent": col.priceRent,
             "pricePostForSale": col.pricePostForSale, 
             "mark": col.mark, 
             "status": col.status, 
             "dateForUpdate": col.dateForUpdate
          })
        }
        return res.status(200).send({ success: true, data: filtered });
      }
      else if(user.role === "Sales"){
        properties = await findAll();
        const notAllowedColumns = ["owner","phone","line"];
        let filtered = [];
        for await (const col of properties){
          let toAdd: any = {};
          for await (const item of Object.keys(col)){
            if(!notAllowedColumns.includes(item)){
              toAdd[item] = col[item];
            }
          }
          filtered.push(toAdd);
        }
        return res.status(200).send({ success: true, data: filtered });
      }
      else {
        properties = await findAll();
      }
      
      return res.status(200).send({ success: true, data: properties });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } else if (req.method === "POST") {
    try {
      const createType = req.query["createType"];
      if(createType && createType === "multi"){
        const created = await createMulti(req.body, user);
        return res.status(200).send({ success: true, data: created });
      }
      const createdProperty = await create({ ...req.body, addedBy: user.id });
      return res.status(200).send({ success: true, data: createdProperty });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedProperty: any = await update(req.body.key, req.body);
      return res.status(200).send({ success: true, data: { id: updatedProperty?.id } });
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
