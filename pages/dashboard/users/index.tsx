import { useEffect } from 'react';
import { Typography, Select, Popconfirm } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import { auth } from '../../../src/AccessControl';
import Editable from '../../../components/Editable';
import { useEditable } from '../../../hooks/useEditable';



export async function getServerSideProps({ req }: any) {
    return await auth("Users", req);
}



const Users = (props: any) => {

    
    const { 
        form, 
        data, 
        fetchData,
        editingKey, 
        init, 
        isEditing, 
        setTmpCurEditingSelect, 
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
                    onChange={(e: any) => { setTmpCurEditingSelect({ value: e, name: "role", index: data.findIndex((item:any) => record.key === item.key)}) }} 
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
                    <div style={{ display:"flex", gap:"15px"}}>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            <FiEdit style={{fontSize:"18px", color:"#383853"}} />
                        </Typography.Link>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => deleteRow(record.key)}>
                            <TiDeleteOutline style={{fontSize:"20px", color:"#f34343"}} />
                        </Typography.Link>
                    </div>
    
                );
            },
        }
    ];


    const fields = [
        {
            // Visible in table header and when matching columns.
            label: "ID",
            // This is the key used for this field when we call onSubmit.
            key: "id",
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            }
        },
        {
            // Visible in table header and when matching columns.
            label: "Role",
            // This is the key used for this field when we call onSubmit.
            key: "role",
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            }
        },
        {
            // Visible in table header and when matching columns.
            label: "Name",
            // This is the key used for this field when we call onSubmit.
            key: "name",
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            }
        },
        {
            // Visible in table header and when matching columns.
            label: "Email",
            // This is the key used for this field when we call onSubmit.
            key: "email",
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            }
        },
        {
            // Visible in table header and when matching columns.
            label: "Phone",
            // This is the key used for this field when we call onSubmit.
            key: "phone",
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            }
        },
        {
            // Visible in table header and when matching columns.
            label: "Password",
            // This is the key used for this field when we call onSubmit.
            key: "password",
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            }
        }
    ] as const

    useEffect( () => { init('/api/users', cols) }, []);



    return <Editable width={800} title="Users" data={data} columns={cols} form={form} isEditing={isEditing} fetchData={fetchData} handlers={{ filterHandler }} fields={fields} importURL="/api/users?createType=multi" apiURL="/api/users" />
}

export default Users;