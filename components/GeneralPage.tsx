import { Divider, Button } from 'antd';
import Editable from '../components/Editable';
import { useEditable } from '../hooks/useEditable';
import { RiArrowGoBackLine } from 'react-icons/ri';
import mFetcher from '../src/Fetch/Fetcher';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { validators } from '../src/AccessControl/handlers';


let cols: Array<any> = [];
let columns: Array<any> = [];
let fields: Array<any> = [];

const GeneralPage = (props: any) => {

    const router = useRouter();
    const [pageAccessConfig, setPageAccessConfig] = useState<any>({});
    const [user, setUser] = useState<any>({});

    const {
        form,
        data,
        fetchData,
        editingKey,
        init,
        setSaveURL,
        setDeleteUrl,
        isEditing,
        save,
        deleteRow,
        addRow,
        edit,
        cancel,
        filterHandler,
        setTmpCurEditingSelect,
        setTmpCurEditingTags,
        tmpCurEditingSelect,
        setTmpCurEditingInputs,
        refreshTable
    } = useEditable();


    const validation = async () => {
        try {
            const fRes = await mFetcher.fetch({ url: `/api/role?by=page,name&page=${props?.page}`, method: "GET" });
            setPageAccessConfig(fRes?.data?.data[0]);
        } catch (error) {
            console.error(error);
        }
    }


    const initialize = async () => {
        try {
            if (typeof window !== 'undefined') {
                const usr = localStorage.getItem('user');
                if (usr) {
                    setUser(JSON.parse(usr));
                }
            }
            const fRes = await mFetcher.fetch({ url: `/api/page?what=columns,records&who=${props?.page}`, method: "GET" })
            columns = fRes.data.data.columns;
            await initColumns(fRes.data.data.columns, fRes.data.data.data);
            return fRes.data.data;
        } catch (error) {
            console.error(error);
        }
    }




    const getEmptyColumns = async (columns: Array<any>, rows: any) => {
        let colMap: any = {};
        let counter = 0;
        let emptyColumns = [];

        for await (const col of columns) {
            colMap[col.column] = false;
        }

        for await (const row of rows) {
            for await (const key of Object.keys(row)) {
                if (Object.keys(colMap).includes(key)) {
                    if (row[key].length > 0 && colMap[key] === false) {
                        colMap[key] = true;
                        counter++;
                        if (Object.keys(colMap).length <= counter) {
                            break;
                        }
                    }
                    if (Object.keys(colMap).length <= counter) {
                        break;
                    }
                }

            }
        }
        if (Object.keys(colMap).length > counter) {
            for await (const key of Object.keys(colMap)) {
                if (colMap[key] === false) {
                    emptyColumns.push(key);
                }
            }
        }
        return emptyColumns;
    }




    const initColumns = async (columns: Array<any>, rows: any) => {
        for await (const col of columns) {
            fields.push({
                label: col.column[0].toUpperCase() + col.column.slice(1),
                key: col.column,
                fieldType: {
                    type: 'input'
                }
            })
        }
        const emptyColumns = await getEmptyColumns(columns, rows);
        let tmpCols = [];
        for await (const col of columns) {
            let colName = '';
            if (Object.keys(col).includes("column")) {
                colName = col.column;
            } else {
                colName = col.name;
            }

            if (emptyColumns.includes(colName)) {
                continue;
            } else {
                let tmp: any = {
                    title: colName[0].toUpperCase() + colName.slice(1),
                    dataIndex: colName,
                    width: '50px',
                    type: col.type
                };
                if (Object.keys(col).includes("options")) {
                    tmp = {
                        ...tmp,
                        options: col.options
                    }
                }
                tmpCols.push(tmp);
            }
        }

        let filteredRows = [];
        for await (const row of rows) {
            let count = 0;
            for await (const i of tmpCols) {
                if (row[i["dataIndex"]]?.length > 0) {
                    filteredRows.push(row);
                    break;
                }
                if (count >= tmpCols?.length) {
                    break;
                }
                count++;
            }
        }

        tmpCols.push({
            title: 'Operation',
            dataIndex: 'operation',
            width: '50px',
            fixed: 'right'
        });


        cols = [...tmpCols];


        await init(`/api/page?what=columns,records&who=${props?.page}`, tmpCols, filteredRows);
    }



    useEffect(() => {
        validation();
        initialize();
        setSaveURL('/api/record');
        setDeleteUrl('/api/record');
    }, []);





    return <div>

        <div style={{ width: "100%", padding: "25px", display: "flex", gap: "10px", marginTop: "-20px" }}>
            <h2 style={{ marginLeft: "50px", marginTop: "0px" }}>{`${props.page}`}</h2>
        </div>

        <div style={{ paddingRight: "5%", paddingLeft: "5%" }}>
            <Divider style={{ backgroundColor: "gray", marginTop: "-15px" }} />
        </div>



        <div style={{ height: "70vh", marginTop: "-20px", overflow: "scroll", position: "absolute", width: "100%", marginLeft: "0%", paddingLeft: "4%", paddingRight: "5%" }}>
            <Editable refreshTable={refreshTable} tmpCurEditingSelect={tmpCurEditingSelect} user={user} accessConfig={pageAccessConfig} addRow={addRow} setTmpCurEditingTags={setTmpCurEditingTags} setTmpCurEditingSelect={setTmpCurEditingSelect} editingKey={editingKey} deleteRow={deleteRow} edit={edit} cancel={cancel} save={save} width={cols?.length > 0 ? cols?.length * 150 : 1000} height="49vh" title={""} page={props.page} data={data} columns={cols} form={form} isEditing={isEditing} fetchData={fetchData} handlers={{ filterHandler }} fields={fields} importURL={`/api/record?createType=multi&page=${props?.page}`} apiURL={`/api/page?what=columns,records&who=${props?.page}`} import={false} export={false} createPath={`/dashboard/management/pages/table/${props.page}/column/create`} createTitle="Add Column" originColumns={columns} />
        </div>


    </div >
}


export default GeneralPage;