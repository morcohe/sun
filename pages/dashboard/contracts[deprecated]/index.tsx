import { useEffect } from 'react';
import { Typography, Select, Popconfirm } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import { auth } from '../../../src/AccessControl';
import Editable from '../../../components/Editable';
import { useEditable } from '../../../hooks/useEditable';



export async function getServerSideProps({ req }: any) {
    return await auth("Contracts", req);
}



const Contract = (props: any) => {


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
            title: 'Move In',
            dataIndex: 'moveIn',
            width: '150px',
            editable: false,
        },
        {
            title: 'Move Out',
            dataIndex: 'moveOut',
            width: '150px',
            editable: true
        },
        {
            title: 'Rental Period',
            dataIndex: 'rentalPeriod',
            width: '150px',
            editable: true,
        },
        {
            title: 'Rent price',
            dataIndex: 'rentPrice',
            width: '150px',
            editable: true,
        },
        {
            title: 'Sell Price',
            dataIndex: 'sellPrice',
            width: '150px',
            editable: true,
        },
        {
            title: 'Name Tanant',
            dataIndex: 'nameTanant',
            width: '150px',
            editable: true,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            width: '150px',
            editable: true,
        },
        {
            title: 'Age Tenant',
            dataIndex: 'ageTenant',
            width: '150px',
            editable: true,
        },
        {
            title: 'Name Owner',
            dataIndex: 'nameOwner',
            width: '150px',
            editable: true,
        },
        {
            title: 'Name Condo',
            dataIndex: 'nameCondo',
            width: '150px',
            editable: true,
        },
        {
            title: 'No. Room',
            dataIndex: 'noRoom',
            width: '150px',
            editable: true,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '150px',
            editable: true,
        },
        {
            title: 'Present By',
            dataIndex: 'presentBy',
            width: '150px',
            editable: true,
        },
        {
            title: 'TM30',
            dataIndex: 'tm30',
            width: '150px',
            editable: true,
        },
        {
            title: 'Contract Sing',
            dataIndex: 'contractSing',
            width: '150px',
            editable: true,
        },
        {
            title: 'Furnsihed List',
            dataIndex: 'furnsihedList',
            width: '150px',
            editable: true,
        },
        {
            title: 'Draft Contract',
            dataIndex: 'draftContract',
            width: '150px',
            editable: true,
        },
        {
            title: 'Advert From',
            dataIndex: 'advertFrom',
            width: '150px',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            fixed: 'right',
            width: '100px',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <span style={{ width: "400px" }}>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 4 }}>
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


    const fields = [
        {
            label: 'Move In',
            key: 'moveIn',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Move Out',
            key: 'moveOut',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Rental Period',
            key: 'rentalPeriod',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Rent price',
            key: 'rentPrice',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Sell Price',
            key: 'sellPrice',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Name Tanant',
            key: 'nameTanant',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Phone Number',
            key: 'phone',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Age Tenant',
            key: 'ageTenant',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Name Owner',
            key: 'nameOwner',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Name Condo',
            key: 'nameCondo',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'No. Room',
            key: 'noRoom',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Location',
            key: 'location',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Present By',
            key: 'presentBy',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'TM30',
            key: 'tm30',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Contract Sing',
            key: 'contractSing',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Furnsihed List',
            key: 'furnsihedList',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Draft Contract',
            key: 'draftContract',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Advert From',
            key: 'advertFrom',
            fieldType: {
                type: "input",
            }
        }
    ] as const


    useEffect(() => { init('/api/contracts', cols) }, []);



    return <div style={{height:"87vh", overflow:"scroll", position:"absolute", width:"100%", marginLeft:"0%"}}>
    <Editable width={3000} height="63vh" title="Contracts" data={data} columns={cols} form={form} isEditing={isEditing} fetchData={fetchData} handlers={{ filterHandler }} fields={fields} importURL="/api/contracts?createType=multi" apiURL="/api/contracts" />
    </div>
}

export default Contract;