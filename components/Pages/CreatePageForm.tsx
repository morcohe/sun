import { Input, Button } from 'antd';
import Swal from 'sweetalert2';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import CreatePageFormColumn from './Column';
import { useState } from 'react';
import mFetcher from '../../src/Fetch/Fetcher';



const CreatePageForm = (props: any) => {

    const [data, setData] = useState<Array<any>>([]);
    const [name, setName] = useState<string>("");




    const onFinish = async () => {
        try {

            const fRes = await mFetcher.fetch({ url: '/api/page', method: 'POST', data: { name, data } });
            console.log("Fetch Response: ", fRes.data);
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `The page "${name}" has been created`,
                confirmButtonText: "Ok"
              }).then((result) => {
                setName("");
                setData([]);
                if (result.isConfirmed) {
                  props.done();
                }
              });

        } catch (error) {
            console.error(error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `The page "${name}" not created`,
                confirmButtonText: "Try Again"
              });
        }
        
    };



    const addColumn = (columnData: any) => {
        if (columnData) {
            setData([...data, columnData]);
        }
    };



    const handleRemoveColumn = (index: number) => {
        let filteredData = [...data];
        filteredData?.splice(index, 1);
        setData(filteredData);
    }



    return <div style={{ width: "100%", paddingLeft:"5%", paddingRight:"5%" }}>

        

        <div style={{marginTop:"50px"}}>
            <h3>Name</h3>
            <Input onChange={(e:any)=>setName(e?.target?.value)} value={name} size="large" placeholder="Enter a name for the page" style={{ width: "100%", height:"50px", boxShadow:"0 8px 14.72px 1.28px rgba(154,154,204,.1)", borderRadius:"15px" }} />
        </div>

        {
            data?.length > 0 && <div style={{ width: "100%", marginTop: "50px", padding: "50px", border: "solid 1px gray", borderRadius: "15px" }}>
                <div>
                    <h3>
                        Columns
                    </h3>
                </div>
                <ul style={{marginTop:"20px"}}>
                    {
                        data?.length && data?.map((col: any, index: number) => {
                            return <li style={{ display: "flex", gap: "15px" }} key={index}>
                                <div>
                                    <Button onClick={(e:any)=>handleRemoveColumn(index)} style={{ color: "red", marginTop:"-3px" }} type="link" icon={<MinusCircleOutlined />}>

                                    </Button>
                                </div>
                                <div style={{display:"flex", gap:"15px"}}>
                                    <p><b>Column Name:</b> {col.name}</p>
                                    <p><b>Column Type:</b> {col.type}</p>
                                    {
                                        col.options && <p><b>Column Options:</b> {JSON.stringify(col.options)}</p>
                                    }
                                    
                                </div>

                            </li>
                        })
                    }
                </ul>
            </div>
        }


        <div style={{ width: "100%", marginTop: "50px", padding: "50px", border: "solid 1px gray", borderRadius: "15px" }}>
            <CreatePageFormColumn addColumn={addColumn} />
        </div>


        <div style={{width:"100%", marginTop:"50px"}}>
            <Button onClick={onFinish} style={{width:"100%", height:"50px", boxShadow:"0 8px 14.72px 1.28px rgba(154,154,204,.1)"}} size="large" type="primary">
                Save and finish
            </Button>
        </div>

    </div>
}

export default CreatePageForm;