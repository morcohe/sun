import type { NextApiRequest, NextApiResponse } from 'next';
import { create, createMulti, findAll, update, remove } from '../../db/Property/Property.repository';
import { extract } from '../../src/jwt';
import Page from '../../db/Page/Page.model';
import GRepository from '../../db/GenericCRUD.service';
import { uuid as uuid_v4 } from "uuidv4";
import Record from '../../db/Record/Record.model';
import Role from '../../db/Role/Role.model';

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

      const query = req.query;
      const pageRepo = new GRepository(Page, "Page");
      let found: any;

      if(user.role === 'SuperAdmin' && req?.headers?.referer?.includes("management")){
        
        //returns an dictionary object of page and its columns
        if(query.columns === "all"){
          found = await pageRepo.getAll();
          let columnList: any = {};
          for await (const row of found) {
            if(!Object.keys(columnList).includes(row.name)){
              columnList[row.name] = [];
            }
            if(!columnList[row.name].includes(row.column)){
              columnList[row.name] = [ ...columnList[row.name], row.column ]
            }
          }
          return res.status(200).send({ success: true, data: columnList });
        }

        //returns a list of page names
        else if (query.page === "all") {
          found = await pageRepo.getAll();
          let pagesList: Array<string> = [];
          for await (const row of found) {
            if (!pagesList.includes(row.name)) {
              pagesList.push(row.name);
            }
          }
          found = pagesList;
          return res.status(200).send({ success: true, data: found });
        } else {
          found = await pageRepo.getAll({ name: query.page });
          return res.status(200).send({ success: true, data: found });
        }
      }

      const roleRepo = new GRepository(Role, "Role");
      const foundRole: any = await roleRepo.getAll({ name: user?.role, page: query.who });
      console.log("FOUND ROLE: ", foundRole)

      if (!foundRole.length) {
        return res.status(401).send("Unauthorized");
      }

      const allowedColumns: any = foundRole[0].columns;
      console.log("ALLOWED COLUMNS: ", allowedColumns)

      

      

      if (query.page === "all") {
        found = await pageRepo.getAll();
        let pagesList: Array<string> = [];
        for await (const row of found) {
          if (!pagesList.includes(row.name)) {
            pagesList.push(row.name);
          }
        }
        found = pagesList;
      } 
      else if (query.what === "columns,records") {
        const recordRepo = new GRepository(Record, "Record");
        const tmpFoundColumns: any = await pageRepo.getAll({ name: query.who });
        
        let foundColumns;
        if(allowedColumns[0] !== "*"){
          foundColumns = tmpFoundColumns.filter((x:any)=> allowedColumns.includes(x.column.toLowerCase()) || allowedColumns.includes(x.column))
        }
        else {
          foundColumns = tmpFoundColumns;
        }
        //console.log("FOUND COLUMNS: ", foundColumns)
        
        let filteredColumns = [...foundColumns];

        
          filteredColumns = [];
          for await (const col of foundColumns) {
            if (allowedColumns[0] !== "*") {
              if (allowedColumns.includes(col?.column)) {
                filteredColumns.push({
                  id: col.id,
                  name: col.name,
                  column: col.column,
                  type: col.type,
                  options: col.options.length ? col.options : col.options
                });
              }
            } else {
              filteredColumns.push({
                id: col.id,
                name: col.name,
                column: col.column,
                type: col.type,
                options: col.options.length ? col.options : col.options
              });
            }
          }
        


        console.log("FILTERED COLUMNS: ", filteredColumns)

        let filteredRecords = [];
        const foundRecords: any = await recordRepo.getAll({ page: query.who });
        //console.log("FOUND RECORDS: ", foundRecords)


        for await (const rec of foundRecords) {
          let tmp: any = {};
          for await (const k of Object.keys(rec?.data)) {
            if (allowedColumns[0] !== "*") {
              if (allowedColumns.includes(k)) {
                tmp = { id: rec.id, assignedUsers: rec.assignedUsers, ...rec.data }
              }
            } else {
              tmp = { id: rec.id, assignedUsers: rec.assignedUsers, ...rec.data }
            }
          }
          filteredRecords.push(tmp);
        }



        //console.log("FILTERED RECORDS: ", filteredRecords)

        const filtered = { columns: filteredColumns, data: filteredRecords };
        //console.log("FINAL FILTER: ", filtered)
        return res.status(200).send({ success: true, data: { ...filtered } });
      }

      else {
        found = await pageRepo.getAll({ name: query.page });
      }
      
      return res.status(200).send({ success: true, data: found });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }




  else if (req.method === "POST") {

    try {

      const page = req.body;
      const pageRepo = new GRepository(Page, "Page");

      if (req.query.op === "create" && req.query.entity === "column") {
        let tmpRow: any = {
          id: uuid_v4(),
          name: req.query.table,
          column: page.name,
          type: page.type,
          options: []
        };
        
        const created = await pageRepo.setOne(tmpRow);
        return res.status(200).send({ success: true, data: created });
      }

      

      for await (const row of page.data) {
        let tmpRow: any = {
          id: uuid_v4(),
          name: page.name,
          column: row.name,
          type: row.type,
          options: []
        };
        
        const created = await pageRepo.setOne(tmpRow);
      }

      await pageRepo.setOne({
        id: uuid_v4(),
          name: page.name,
          column: "assignedUsers",
          type: "Tag",
          options: []
      });

      return res.status(200).send({ success: true });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }

  }




  else if (req.method === "PUT") {
    try {
      const pageRepo = new GRepository(Page, "Page");
      const updatedProperty: any = await pageRepo.updateOne({ id: req.body.key }, { id: req.body.id, column: req.body.column, type: req.body.type, options: req.body.options });
      return res.status(200).send({ success: true, data: updatedProperty });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }



  else if (req.method === "DELETE") {
    try {
      const pageRepo = new GRepository(Page, "Page");
      const roleRepo = new GRepository(Role, "Role");
      if (req.query.entity === "table") {
        await pageRepo.removeAll({ name: req?.query?.name });
        await roleRepo.removeAll({ page: req?.query?.name });
        return res.status(200).send({ success: true });
      } else {
        const id: any = req.query.id;
        await pageRepo.removeOne({ id });
        return res.status(200).send({ success: true, data: { id: id } });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error });
    }
  }

}
