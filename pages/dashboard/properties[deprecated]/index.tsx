import { useEffect } from 'react';
import { Typography, Select, Popconfirm } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import { auth } from '../../../src/AccessControl';
import Editable from '../../../components/Editable';
import { useEditable } from '../../../hooks/useEditable';



export async function getServerSideProps({ req }: any) {
    return await auth("Properties", req);
}



const Property = (props: any) => {


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
            title: 'Code',
            dataIndex: 'code',
            fixed: 'left',
            
            editable: false,
        },
        {
            title: 'Condo',
            dataIndex: 'condo',
            
            editable: true
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            
            editable: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            
            editable: true,
        },
        {
            title: 'Line',
            dataIndex: 'line',
            
            editable: true,
        },
        {
            title: 'Provice',
            dataIndex: 'provice',
            
            editable: true,
        },
        {
            title: 'Area',
            dataIndex: 'area',
            
            editable: true,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            
            editable: true,
        },
        {
            title: 'Floor',
            dataIndex: 'floor',
            
            editable: true,
        },
        {
            title: 'Tower',
            dataIndex: 'tower',
            
            editable: true,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                        style={{ width: "150px" }}
                        placeholder="Type"
                        onChange={(e: any) => { setTmpCurEditingSelect({ value: e, name: "type", index: data.findIndex((item: any) => record.key === item.key) }) }}
                        defaultValue={record["type"]}
                    >
                        <Select.Option key={"Studio"} value={"Studio"}>
                            Studio
                        </Select.Option>
                        <Select.Option key={"Duplex"} value={"Duplex"}>
                            Duplex
                        </Select.Option>
                        <Select.Option key={"Penthouse"} value={"Penthouse"}>
                            Penthouse
                        </Select.Option>
                        <Select.Option key={"2Bed 2Bath"} value={"2Bed 2Bath"}>
                            2Bed 2Bath
                        </Select.Option>
                        <Select.Option key={"3Bed 2Bath"} value={"3Bed 2Bath"}>
                            3Bed 2Bath
                        </Select.Option>
                    </Select>
                ) :
                    (record.type);
            },
        },
        {
            title: 'Rent Price',
            dataIndex: 'priceRent',
            
            editable: true,
        },
        {
            title: 'Price Post For Sale',
            dataIndex: 'pricePostForSale',
            
            editable: true,
        },
        {
            title: 'Net Price',
            dataIndex: 'netPrice',
            
            editable: true,
        },
        {
            title: 'Transfer Ownership',
            dataIndex: 'transferOwnership',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                        style={{ width: "150px" }}
                        placeholder="Transfer Ownership"
                        onChange={(e: any) => { setTmpCurEditingSelect({ value: e, name: "transferOwnership", index: data.findIndex((item: any) => record.key === item.key) }) }}
                        defaultValue={record["transferOwnership"]}
                    >
                        <Select.Option key={"(50:50) Include 3%"} value={"(50:50) Include 3%"}>
                            {"(50:50) Include 3%"}
                        </Select.Option>
                        <Select.Option key={"(50:50) Transfer Only"} value={"(50:50) Transfer Only"}>
                            {"(50:50) Transfer Only"}
                        </Select.Option>
                        <Select.Option key={"Come 3%"} value={"Come 3%"}>
                            Come 3%
                        </Select.Option>
                        <Select.Option key={"Come 5%"} value={"Come 5%"}>
                            Come 5%
                        </Select.Option>
                        <Select.Option key={"Net Price"} value={"Net Price"}>
                            Net Price
                        </Select.Option>
                        <Select.Option key={"Pay/Transfer"} value={"Pay/Transfer"}>
                            Pay/Transfer
                        </Select.Option>
                        <Select.Option key={"Condition By Developer"} value={"Condition By Developer"}>
                            Condition By Developer
                        </Select.Option>
                        <Select.Option key={"CO Agency"} value={"CO Agency"}>
                            CO Agency
                        </Select.Option>
                    </Select>
                ) :
                    (record.transferOwnership);
            },
        },
        {
            title: 'Mark',
            dataIndex: 'mark',
            
            editable: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                        style={{ width: "150px" }}
                        placeholder="Status"
                        onChange={(e: any) => { setTmpCurEditingSelect({ value: e, name: "status", index: data.findIndex((item: any) => record.key === item.key) }) }}
                        defaultValue={record["status"]}
                    >
                        <Select.Option key={"Available"} value={"Available"}>
                            Available
                        </Select.Option>
                        <Select.Option key={"Not Available"} value={"Not Available"}>
                            Not Available
                        </Select.Option>
                        <Select.Option key={"Sell Only"} value={"Sell Only"}>
                            Sell Only
                        </Select.Option>
                        <Select.Option key={"Cannot Contact"} value={"Cannot Contact"}>
                            Cannot Contact
                        </Select.Option>
                        <Select.Option key={"Not Pickup"} value={"Not Pickup"}>
                            Not Pickup
                        </Select.Option>
                        <Select.Option key={"Sold"} value={"Sold"}>
                            Sold
                        </Select.Option>
                    </Select>
                ) :
                    (record.status);
            },
        },
        {
            title: 'Date For Update',
            dataIndex: 'dateForUpdate',
            
            editable: true,
        },
        {
            title: 'Property Hub',
            dataIndex: 'PropertyHub',
            
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            fixed: 'right',
            
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
            label: "Code",
            key: "code",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Condo",
            key: "condo",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Owner",
            key: "owner",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Phone",
            key: "phone",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Line",
            key: "line",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Provice",
            key: "provice",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Area",
            key: "area",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Size",
            key: "size",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Floor",
            key: "floor",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Tower",
            key: "tower",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Type",
            key: "type",
            fieldType: {
                type: "input"
            }
        },
        {
            label: "Rent Price",
            key: "priceRent",
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Price Post For Sale',
            key: 'pricePostForSale',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Net Price',
            key: 'netPrice',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Transfer Ownership',
            key: 'transferOwnership',
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Mark",
            key: "mark",
            fieldType: {
                type: "input",
            }
        },
        {
            label: "Status",
            key: "status",
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Date For Update',
            key: 'dateForUpdate',
            fieldType: {
                type: "input",
            }
        },
        {
            label: 'Property Hub',
            key: 'PropertyHub',
            fieldType: {
                type: "input",
            }
        }
    ] as const


    useEffect(() => { init('/api/properties', cols) }, []);



    return <div style={{height:"87vh", overflow:"scroll", position:"absolute", width:"100%", marginLeft:"0%"}}>
        <Editable width={3000} height="63vh" title="Properties" user={props?.user} data={data} columns={cols} form={form} isEditing={isEditing} fetchData={fetchData} handlers={{ filterHandler }} fields={fields} importURL="/api/properties?createType=multi" apiURL="/api/properties" />
        </div>
}

export default Property;