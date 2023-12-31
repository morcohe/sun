import { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { auth } from '../../../../src/AccessControl';
import RoleTable from '../../../../components/Roles/RoleTable';
import mFetcher from '../../../../src/Fetch/Fetcher';


export async function getServerSideProps({ req }: any) {
    return await auth("Roles", req);
}


const Roles = (props: any) => {

    const [roles, setRoles] = useState<any>([]);
    const [pages, setPages] = useState<any>([]);
    const [pageColumns, setPageColumns] = useState({});


    const init = async () => {
        try {
            const fColumnListRes = await mFetcher.fetch({
                url: '/api/page?columns=all', method: 'GET'
            })
            
            setPageColumns(fColumnListRes?.data.data)
            const fTablesRes = await mFetcher.fetch({ url: `/api/page?page=all`, method:"GET" });
            let tmpPageList = [];
            for await (const p of fTablesRes?.data?.data){
                tmpPageList.push({
                    label: p, value: p
                })
            }
            setPages(tmpPageList);
            const fRes = await mFetcher.fetch({ url: `/api/role?role=all`, method:"GET" });
            setRoles(fRes?.data?.data);
        } catch (error) {
            console.error(error);
        }
        
    }

 

    useEffect(() => {
        init();
    }, [])

    


    return <div style={{height:"95vh", overflow:"scroll", position:"absolute", width:"100%", marginLeft:"-2%"}}>
        
        <div style={{ width: "90%", padding: "25px", display: "flex", gap: "10px", marginTop: "-10px" }}>
            <h2 style={{ marginLeft: "50px", marginTop: "0px" }}>{`Roles`}</h2>
            
        </div>

        <div style={{ paddingRight: "20%", paddingLeft: "2%" }}>
            <Divider style={{ backgroundColor: "gray", marginTop: "-15px" }} />
        </div>

        <small style={{marginLeft:"5%"}}>
            * If columns cell is empty - Page will not be accessible to the specified role
        </small>
        <br/><br/>


    <div style={{display:"flex", flexDirection:"column", gap:"50px", paddingRight: "2%", paddingLeft: "2%"}}>
    {
            Object.keys(roles)?.map((role: string, index: number) => {
                return <div key={`role-${index}`}>
                    <RoleTable pageColumns={pageColumns} role={role} title={role} data={roles[role]} pages={pages} />
                </div>
            })
        }
    </div>
        




    </div>
}

export default Roles;