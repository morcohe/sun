import { useEffect, useState } from 'react';
import { Popconfirm, Divider, Button } from 'antd';
import { auth } from '../../../../src/AccessControl';
import mFetcher from '../../../../src/Fetch/Fetcher';
import { useRouter } from 'next/router';
import { BsTable } from 'react-icons/bs';
import { BiAddToQueue } from 'react-icons/bi';


export async function getServerSideProps({ req }: any) {
    return await auth("Pages", req);
}



const Pages = () => {

    const [data, setData] = useState([]);
    const router = useRouter();


    const init = async () => {
        try {
            const fRes = await mFetcher.fetch({
                url: '/api/page?page=all', method: 'GET'
            })
            setData(fRes?.data.data);
        } catch (error) {
            console.error(error)
        }
    }


    const redirectToCreate = () => {
        if(typeof window !== 'undefined'){
            router.push(`/dashboard/management/pages/create`);
        }
    }


    const handleDeleteTable = async (table: string) => {
        try {
            const fRes = await mFetcher.fetch({
                url: `/api/page?entity=table&name=${table}`, method: 'DELETE'
            })
            setData(data?.filter((item:string)=>item !== table));
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => { init() }, []);



    return <div>
        <div style={{ width: "100%", padding: "25px", display: "flex", gap: "10px", marginTop: "-10px" }}>
            <h2 style={{ marginLeft: "50px", marginTop: "0px" }}>Tables | </h2>
            <h3 style={{ marginTop: "7px" }}>
                Tables management
            </h3>
        </div>


        <div style={{ paddingRight: "5%", paddingLeft: "5%" }}>
            <Divider style={{ backgroundColor: "gray", marginTop: "-15px" }} />
        </div>

        <div style={{ paddingRight: "5%", paddingLeft: "5%", display: "flex", gap: "25px" }}>
            <div style={{ marginTop: "4px" }}>
                Actions:
            </div>
            <Button style={{ borderRadius: "15px", backgroundColor: "#4a4a69", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }} onClick={redirectToCreate} >
                <BiAddToQueue style={{ fontSize: "16px", marginTop: "3px" }} />
                <div style={{ fontSize: "12px", marginTop: "1px" }}>Create Table</div>
            </Button>
        </div>

        <div style={{ paddingRight: "5%", paddingLeft: "5%" }}>
            <Divider style={{ backgroundColor: "gray", marginTop: "25px" }} />
        </div>


        <div>
            <ul style={{ padding: "150px", paddingTop: "0px", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                {
                    data?.length > 0 && data?.map((item: string, index: number) => {
                        return <li style={{ marginTop: "30px", width: "200px", listStyle: "none", height: "200px", borderRadius: "15px", textAlign: "center", padding: "10px", paddingTop: "3%", backgroundColor: "#fff", boxShadow: "0 8px 14.72px 1.28px rgba(154,154,204,.25)" }} key={index}>
                            <div>
                                <BsTable style={{ fontSize: "40px" }} />
                            </div>
                            <div style={{ marginTop: "5px" }}>
                                <b style={{ fontSize: "18px" }}>Name: </b> {item}
                            </div>
                            <div style={{ display: "flex", gap: "10px", textAlign: "center", width: "100%", justifyContent: "center" }}>
                                <Button style={{ fontSize: "14px", marginTop: "15px", borderRadius: "30px", borderColor: "lightblue", boxShadow: "0 8px 14.72px 1.28px rgba(154,154,204,.25)", color: "#fff", backgroundColor: "#0074d9" }} type="dashed" onClick={(e: any) => {
                                    if(typeof window !== 'undefined'){
                                        router.push(`/dashboard/management/pages/${item}`)
                                    }
                                    }}>Open</Button>
                                <Popconfirm title="Delete this table?" onConfirm={(e: any) => handleDeleteTable(item)} >
                                    <Button style={{ fontSize: "14px", marginTop: "15px", borderRadius: "30px", borderColor: "lightblue", boxShadow: "0 8px 14.72px 1.28px rgba(154,154,204,.25)", color: "#fff", backgroundColor: "#f76262" }} type="dashed" >Delete</Button>
                                </Popconfirm>

                            </div>

                        </li>
                    })
                }
            </ul>
        </div>
    </div>
}

export default Pages;