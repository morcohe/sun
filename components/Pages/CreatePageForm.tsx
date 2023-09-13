import { Input, Button, Upload } from 'antd';
import Swal from 'sweetalert2';
import { MinusCircleOutlined } from '@ant-design/icons';
import { ExcelRenderer } from 'react-excel-renderer';
import CreatePageFormColumn from './Column';
import { useState } from 'react';
import mFetcher from '../../src/Fetch/Fetcher';
import { useEffect } from 'react';


type TColumn = {
    name: string,
    type: "Text" | "Boolean" | "Select",
    options: Array<string>
}


const CreatePageForm = (props: any) => {

    const [data, setData] = useState<Array<TColumn>>([]);
    const [name, setName] = useState<string>("");

    const [loadedFile, setLoadedFile] = useState<any>({ cols: [], rows: [] });
    const [isFileLoaded, setFileLoaded] = useState<boolean>(false);


    const mergeLoadedFileColumnsIntoData = async () => {
        let tmpData = [...data];
        for await (const col of loadedFile.cols) {
            let tmpCol: TColumn = {
                name: col.name,
                type: "Text",
                options: []
            }
            tmpData = [...tmpData, tmpCol];
        }
        setData(tmpData);
        setFileLoaded(true);
    }

    const isColExist = async (name: string, arr: Array<any>) => {
        for await (const x of arr) {
            if(name === x.name){
                return true;
            }
        }
        return false;
    }

    const initLoadedFile = async (data: any) => {
        let cols = [...data.cols];
        let newCols = [];
        let counter = 0;
        for await (const col of data.rows[0]) {
            let tmp = { ...cols[counter] };
            tmp.name = col;
            newCols.push(tmp);
            counter++;
        }
        setLoadedFile({
            cols: newCols,
            rows: data.rows.slice(1)
        });
    }


    const fileHandler = async (event: any) => {
        let fileObj = event.target.files[0];
        ExcelRenderer(fileObj, (err: any, resp: any) => {
            if (err) {
                console.log(err);
            }
            else {
                initLoadedFile(resp);
            }
        });
    }


    const onFinish = async () => {
        try {

            const fRes = await mFetcher.fetch({ url: '/api/page', method: 'POST', data: { name, data } });
            //console.log("Fetch Response: ", fRes?.data);

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



    useEffect(() => {
        //console.log("> loadedFile: ", loadedFile);
        if (loadedFile.cols.length > 0 && isFileLoaded === false) {
            mergeLoadedFileColumnsIntoData();
        }
    }, [loadedFile]);



    return <div style={{ width: "100%", paddingLeft: "5%", paddingRight: "5%" }}>



        <div style={{ marginTop: "50px" }}>
            <h3>Name</h3>
            <Input onChange={(e: any) => setName(e?.target?.value)} value={name} size="large" placeholder="Enter a name for the page" style={{ width: "100%", height: "50px", boxShadow: "0 8px 14.72px 1.28px rgba(154,154,204,.1)", borderRadius: "15px" }} />
        </div>


        {
            data?.length > 0 && <div style={{ width: "100%", marginTop: "40px", padding: "50px", border: "solid 1px gray", borderRadius: "15px" }}>
                <div>
                    <h3>
                        Columns
                    </h3>
                </div>
                <ul style={{ marginTop: "20px" }}>
                    {
                        data?.length && data?.map((col: any, index: number) => {
                            return <li style={{ display: "flex", gap: "15px" }} key={index}>
                                <div>
                                    <Button onClick={(e: any) => handleRemoveColumn(index)} style={{ color: "red", marginTop: "-3px" }} type="link" icon={<MinusCircleOutlined rev={false} />}>

                                    </Button>
                                </div>
                                <div style={{ display: "flex", gap: "15px" }}>
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


        <div style={{ width: "100%", marginTop: "40px", padding: "50px", border: "solid 1px gray", borderRadius: "15px" }}>

            <div>
                <h3>
                    Option A - Import columns from file
                </h3>
            </div>

            <div style={{ marginTop: "50px", display: "flex", gap: "15px" }}>
                <input type="file" onChange={fileHandler.bind(this)} style={{ "padding": "10px", marginTop: "-10px" }} />
            </div>

            <div>
                <p>
                    In case you are importing colummns from file and you need to configure some columns:
                    <br />1. complete the table creation.
                    <br />{"2. Go to tables -> chose the required table -> find the column you want to config -> click the 'Edit' button."}
                </p>
            </div>

        </div>







        {/* <OutTable data={loadedFile.rows} columns={loadedFile.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" /> */}




        <div style={{ width: "100%", marginTop: "40px", padding: "50px", border: "solid 1px gray", borderRadius: "15px" }}>
            <CreatePageFormColumn addColumn={addColumn} />
        </div>


        <div style={{ width: "100%", marginTop: "50px" }}>
            <Button onClick={onFinish} style={{ width: "100%", height: "50px", boxShadow: "0 8px 14.72px 1.28px rgba(154,154,204,.1)" }} size="large" type="primary">
                Save and finish
            </Button>
        </div>

    </div>
}

export default CreatePageForm;