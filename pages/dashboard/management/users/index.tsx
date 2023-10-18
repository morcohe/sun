import { useEffect } from 'react';
import { Typography, Select, Popconfirm } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import { auth } from '../../../../src/AccessControl';
import Editable from '../../../../components/Editable';
import { useEditable } from '../../../../hooks/useEditable';
import mFetcher from '../../../../src/Fetch/Fetcher';
import { fields } from './conf';


export async function getServerSideProps({ req }: any) {
    return await auth("Users", req);
}



const Users = () => {


    const initUsers = async () => {
        try {
            if (typeof window !== 'undefined') {
                const fRes = await mFetcher.fetch({
                    url: 'http://localhost:4001/api/users', method: 'GET'
                })
                init('/api/users', cols, fRes?.data?.data);
                return fRes?.data;
            }
        } catch (error) {
            console.error(error);
        }
    }


    const {
        form,
        data,
        fetchData,
        editingKey,
        init,
        isEditing,
        setTmpCurEditingSelect,
        tmpCurEditingSelect,
        save,
        deleteRow,
        edit,
        cancel,
        filterHandler
    } = useEditable();


    const cols = [
        {
            title: 'ID',
            dataIndex: 'uid',
            width: '30px',
            editable: false,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: '50px',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Role"
                        onChange={(e: any) => { setTmpCurEditingSelect([...tmpCurEditingSelect, { value: e, name: "role", index: data.findIndex((item: any) => record.key === item.key) }]) }}
                        defaultValue={record.role}
                    >
                        <Select.Option key={"Admin"} value={"Admin"}>
                            Admin
                        </Select.Option>
                        <Select.Option key={"Marketing"} value={"Marketing"}>
                            Marketing
                        </Select.Option>
                        <Select.Option key={"Sales"} value={"Sales"}>
                            Sales
                        </Select.Option>
                        <Select.Option key={"Seeking"} value={"Seeking"}>
                            Seeking
                        </Select.Option>
                    </Select>
                ) :
                    (record.role);
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '50px',
            editable: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '50px',
            editable: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: '50px',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            fixed: 'right',
            width: '30px',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div style={{ display: "flex", gap: "15px" }}>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            <FiEdit style={{ fontSize: "18px", color: "#383853" }} />
                        </Typography.Link>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => deleteRow(record.key)}>
                            <TiDeleteOutline style={{ fontSize: "20px", color: "#f34343" }} />
                        </Typography.Link>
                    </div>

                );
            },
        }
    ];




    useEffect(() => {
        initUsers();
    }, []);



    return <div style={{...styleConf.main}}>
        <Editable
            edit={edit} cancel={cancel} save={save} deleteRow={deleteRow}
            editingKey={editingKey} width={conf.width} height={conf.height} 
            title={conf.title} data={data} columns={cols} form={form} 
            isEditing={isEditing} fetchData={fetchData} handlers={{filterHandler}} 
            fields={fields} importURL={conf.importApi} apiURL={conf.api}
        />
    </div>
}



const styleConf: any = {
    main: {
        height: "95vh",
        overflow: "scroll",
        position: "absolute",
        width: "100%",
        marginLeft: "0%"
    }
}


const conf = {
    title: "Users",
    width: 1000,
    height: "63vh",
    api: "/api/users",
    importApi: "/api/users?createType=multi"
}



export default Users;