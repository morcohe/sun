import type { NextApiRequest, NextApiResponse } from 'next';
import { extract } from '../../src/jwt';
import Role from '../../db/Role/Role.model';
import GRepository from '../../db/GenericCRUD.service';


export const config = {
  api: {
      bodyParser: {
          sizeLimit: '50mb',
      },
  },
}


const groupBy = function(xs:any, key:any) {
  return xs.reduce(function(rv:any, x:any) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

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
      const roleRepo = new GRepository(Role, "Role");
      const query = req.query;
      let found: any;
      if(query.by === 'page,name'){
        found = await roleRepo.getAll({ name: user?.role, page: query.page });
        return res.status(200).send({ success: true, data: found });
      }
      else if(query.role === "all"){
        found = await roleRepo.getAll();
        found = groupBy(found, "name");
      } else {
        found = await roleRepo.getAll({ name: user?.role });
      }
      return res.status(200).send({ success: true, data: found });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } 
  


  // else if (req.method === "POST") {

  //   try {
      
  //     const roleRepo = new GRepository(Role, "Role");

  //     if(req.query.op === "create" && req.query.entity === "column"){
  //       let tmpRow: any = {
  //         id: uuid_v4(),
  //         name: req.query.table,
  //         column: req.body.name,
  //         type: req.body.type,
  //         options: []
  //       };
        
  //       const created = await roleRepo.setOne(tmpRow);
  //       return res.status(200).send({ success: true, data: created });
  //     }

  //     const page = req.body;

  //     for await (const row of page.data){
  //       let tmpRow: any = {
  //         id: uuid_v4(),
  //         name: page.name,
  //         column: row.name,
  //         type: row.type,
  //         options: []
  //       };
        
  //       const created = await roleRepo.setOne(tmpRow);
  //     }
      
  //     return res.status(200).send({ success: true });

  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({ success: false, message: error });
  //   }

  // } 
  
  else if (req.method === "PUT") {
    try {
      console.log(">>>>PUTTT::: ", req.body)
      const roleRepo = new GRepository(Role, "Role");
      let tmp: any = {};
      for await (const x of Object.keys(req.body)){
        if(x !== 'key'){
          tmp[x] = req.body[x]
        }
      }
      const updatedRole: any = await roleRepo.updateOne({ id: req.body.key }, {...tmp});
      console.log("### UDATED ROLE: ", updatedRole)
      return res.status(200).send({ success: true, data: updatedRole });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  } 
  
  else if (req.method === "DELETE") {
    try {
      const roleRepo = new GRepository(Role, "Role");
      if(req.query.entity === "table"){
        await roleRepo.removeAll({ name: req?.query?.name });
        return res.status(200).send({ success: true });
      } else {
        const id: any = req.query.id;
        await roleRepo.removeOne({ id });
        return res.status(200).send({ success: true, data: { id: id } });
      }
      
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }

}
