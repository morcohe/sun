import React, { useRef, useState } from 'react';
import { Form, Input, InputNumber, Table, Button, Space, InputRef } from 'antd';
import { useRouter } from 'next/router';
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { BiAddToQueue, BiSearchAlt2 } from 'react-icons/bi';
import { TbPackageImport, TbPackageExport } from 'react-icons/tb';
import mFetcher from '../src/Fetch/Fetcher';
import { CSVLink } from "react-csv";


import { Typography, Divider, Popconfirm, Select, Checkbox, Tag } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import OptionsTag from '../components/Pages/OptionsTag';
import { useEffect } from 'react';
import NewRowModal from './NewRowModal';

import { validators } from '../src/AccessControl/handlers';


import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';





type TProps = {
    title: string,
    page?: string,
    form: any,
    isEditing: any,
    cancel?: any,
    save?: any,
    addRow?: any,
    edit?: any,
    deleteRow?: any,
    setTmpCurEditingSelect?: any,
    tmpCurEditingSelect?: any,
    setTmpCurEditingTags?: any,
    editingKey?: any,
    columns: Array<any> | any,
    data: Array<any>,
    handlers: any,
    fetchData: any,
    fields: any,
    importURL: string,
    apiURL: string,
    width: number | string,
    height?: number | string,
    user?: any,
    import?: boolean,
    export?: boolean,
    hideCreate?: boolean,
    createPath?: string,
    createTitle?: string,
    hideSearch?: boolean,
    hideImport?: boolean,
    hideExport?: boolean,
    hideToolbar?: boolean,
    accessConfig?: any,
    originColumns?: Array<any>,
    refreshTable?: any
}


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: any;
    index: number;
    children: React.ReactNode;
}


const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                >
                    {inputNode}
                </Form.Item>
            ) :
                children

            }
        </td>
    );
};





const Editable = (props: TProps) => {


    const router = useRouter();
    // Determines if modal is visible.
    const [isOpen, setOpen] = useState<boolean>();
    const [users, setUsers] = useState<Array<any>>([]);


    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);


    const getUsers = async () => {
        try {
            const fRes = await mFetcher.fetch({ url: `/api/users`, method: "GET" })
            const tmp = fRes.data?.data?.map((user: any) => {
                return { value: user.name, label: user.name };
            })
            setUsers(tmp);
            return tmp;
        } catch (error) {
            console.error(error);
        }
    }



    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: any,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };



    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });



    const mergedColumns = props?.columns?.map((col: any) => {
        if (Object.keys(col).includes("type")) {
            if (col.type === "Text") {
                return {
                    ...col,
                    editable: true,
                    onCell: (record: any) => ({
                        record: record,
                        inputType: 'text',
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: props?.isEditing(record),
                    }),
                    ...getColumnSearchProps(col.title),
                    render: (_: any, record: any) => {
                        return record[col.dataIndex]
                    },

                }
            }
            else if (col.type === "Tag") {
                return {
                    ...col,
                    render: (_: any, record: any) => {
                        const editable = props?.isEditing(record);

                        let tmpOptions: any = [];
                        if (Object.keys(record).includes("assignedUsers")) {
                            tmpOptions = users;
                        }
                        return editable ?
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder={col.title}
                                onChange={(e: any) => { props?.setTmpCurEditingSelect([...props?.tmpCurEditingSelect, { value: e, name: col.dataIndex, index: props?.data.findIndex((item: any) => record.key === item.key) }]) }}
                                defaultValue={record[col.dataIndex] ? record[col.dataIndex] : []}
                                options={tmpOptions}
                            />
                            :
                            <OptionsTag disabled={true} tagsName={col.title} setTmpCurEditingTags={props?.setTmpCurEditingTags} options={record[col.dataIndex] ? record[col.dataIndex] : []} />;
                    }
                }
            }
            else if (col.type === "Select") {
                return {
                    ...col,
                    render: (_: any, record: any) => {
                        if (record[col.dataIndex]) {
                            let tmpTags;
                            try {
                                tmpTags = JSON.parse(record[col.dataIndex].replaceAll(`'`, `"`));
                            } catch (error) {
                                tmpTags = [record[col.dataIndex]];
                            }
                            const editable = props?.isEditing(record);
                            return editable ?
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={col.title}
                                    onChange={(e: any) => { props?.setTmpCurEditingSelect([...props?.tmpCurEditingSelect, { value: e, name: col.dataIndex, index: props?.data.findIndex((item: any) => record.key === item.key) }]) }}
                                    defaultValue={tmpTags}
                                >
                                    {
                                        typeof col?.options !== 'string' ? col?.options?.map((item: any) => {
                                            return <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        })
                                            :
                                            JSON.parse(col?.options).map((item: any) => {
                                                return <Select.Option key={item} value={item}>
                                                    {item}
                                                </Select.Option>
                                            })
                                    }
                                </Select>
                                :
                                tmpTags[0];
                        }
                        else {
                            return null;
                        }
                    }
                }
            }
            else if (col.type === "Boolean") {
                return {
                    ...col,
                    render: (_: any, record: any) => {
                        const editable = props?.isEditing(record);
                        return editable ?
                            <Checkbox onChange={(e: any) => {
                                record[col.dataIndex] = e.target.checked;
                            }} defaultChecked={record[col.dataIndex]} />
                            :
                            record[col.dataIndex] ? <div>V</div> : <div>X</div>
                    }
                }
            }
        }


        else if (col.title === "Operation") {
            return {
                ...col,
                render: (_: any, record: any) => {
                    const editable = props?.isEditing(record);
                    return editable ? <span>
                        <Typography.Link onClick={() => {
                            props?.save(record.key);
                        }} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={() => {
                            props?.cancel();
                        }}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                        :
                        <div style={{ display: "flex", gap: "15px" }}>
                            {
                                router.pathname.includes('management') ?
                                    <Typography.Link disabled={props?.editingKey !== ''} onClick={() => {
                                        props?.edit(record);
                                    }}>
                                        <FiEdit style={{ fontSize: "18px", color: "#383853" }} />
                                    </Typography.Link>
                                    :
                                    validators.isEdit(props?.accessConfig, props?.user, record['assignedUsers']) ?
                                        <Typography.Link disabled={props?.editingKey !== ''} onClick={() => {
                                            props?.edit(record);
                                        }}>
                                            <FiEdit style={{ fontSize: "18px", color: "#383853" }} />
                                        </Typography.Link>
                                        :
                                        null
                            }

                            {
                                router.pathname.includes('management') ?
                                    <Typography.Link disabled={props?.editingKey !== ''} onClick={() => props?.deleteRow(record.key)}>
                                        <TiDeleteOutline style={{ fontSize: "20px", color: "#f34343" }} />
                                    </Typography.Link>
                                    :
                                    validators.isDelete(props?.accessConfig, props?.user, record['assignedUsers']) ?
                                        <Typography.Link disabled={props?.editingKey !== ''} onClick={() => props?.deleteRow(record.key)}>
                                            <TiDeleteOutline style={{ fontSize: "20px", color: "#f34343" }} />
                                        </Typography.Link>
                                        :
                                        null
                            }

                        </div>;
                },
            }
        }

        else if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: any) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: props?.isEditing(record),
            }),
        };
    });




    const redirectToCreate = () => {
        if (props.createPath) {
            if(typeof window !== 'undefined'){
            router.push(props.createPath);
            }
        } else {
            if(typeof window !== 'undefined'){
            router.push(`${props?.title.toLowerCase()}/create`);
            }
        }
    }





    const onImportSubmit = async (data: any, file: any) => {
        setOpen(false);
        try {
            await mFetcher.fetch({ url: props?.importURL, method: "POST", data: data.validData, headers: { "createType": "multi" } });
            if (props.data.length) {
                await props?.refreshTable();
            } else {
                router.reload();
            }

        } catch (error) {
            console.error(error);
        }


    }


    useEffect(() => {
        getUsers();
    }, []);








    return <div style={{ width: "83%", display: "block", overflow: "auto" }}>

        <h3 style={{ marginTop: "10px", marginLeft: "30px", fontSize: "1.5rem", color: "#7987a1" }}>
            {props?.title}
        </h3>

        {!props?.hideToolbar && <div style={{ zIndex: "999", marginTop: "30px", display: "flex", justifyContent: "space-between", paddingLeft: "25px", paddingRight: "30px" }}>
            <div style={{ display: "flex", gap: "10px" }}>

                {
                    props.hideCreate === false && router?.pathname?.includes('management') ?
                        <Button style={{ borderRadius: "15px", backgroundColor: "#4a4a69", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }} onClick={redirectToCreate} >
                            <BiAddToQueue style={{ fontSize: "16px", marginTop: "3px" }} />
                            <div style={{ fontSize: "12px", marginTop: "1px" }}>{props.createTitle ? props.createTitle : "Create"}</div>
                        </Button>
                        :
                        validators.hasAdd(props?.accessConfig) === true ? <NewRowModal addRow={props?.addRow} columns={props.originColumns ? props.originColumns : props.columns} name={props.page ? props.page : ""} />
                            :
                            router?.pathname?.includes('users') || router?.pathname?.includes('management/pages') ?
                                <Button style={{ borderRadius: "15px", backgroundColor: "#4a4a69", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }} onClick={redirectToCreate} >
                                    <BiAddToQueue style={{ fontSize: "16px", marginTop: "3px" }} />
                                    <div style={{ fontSize: "12px", marginTop: "1px" }}>{props.createTitle ? props.createTitle : "Create"}</div>
                                </Button> : null
                }


                {
                    !props.hideImport && router.pathname.includes('management') ?
                        <Button style={{ borderRadius: "15px", backgroundColor: "#2ab9a4", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }} onClick={() => { setOpen(true) }} >
                            <TbPackageImport style={{ fontSize: "16px", marginTop: "3px" }} />
                            <div style={{ fontSize: "12px", marginTop: "1px" }}>Import</div>
                        </Button>
                        :
                        validators.hasImport(props?.accessConfig) ? <Button style={{ borderRadius: "15px", backgroundColor: "#2ab9a4", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }} onClick={() => { setOpen(true) }} >
                            <TbPackageImport style={{ fontSize: "16px", marginTop: "3px" }} />
                            <div style={{ fontSize: "12px", marginTop: "1px" }}>Import</div>
                        </Button>
                            :
                            null
                }

                {
                    !props.hideExport && router.pathname.includes('management') ?
                        <CSVLink
                            filename={`${props?.title ? props?.title : 'Exported Table'}.csv`}
                            data={props?.data}
                        >
                            <Button style={{ borderRadius: "15px", backgroundColor: "#2ab9a4", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }} >

                                <TbPackageExport style={{ fontSize: "16px", marginTop: "3px" }} />
                                <div style={{ fontSize: "12px", marginTop: "1px" }}>Export</div>

                            </Button>
                        </CSVLink>
                        :
                        validators.hasExport(props?.accessConfig) && props?.data.length ? <CSVLink
                            filename={`${props?.title ? props?.title : 'Exported Table'}.csv`}
                            data={props?.data}
                        >
                            <Button style={{ borderRadius: "15px", backgroundColor: "#2ab9a4", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }} >

                                <TbPackageExport style={{ fontSize: "16px", marginTop: "3px" }} />
                                <div style={{ fontSize: "12px", marginTop: "1px" }}>Export</div>

                            </Button>
                        </CSVLink>
                            :
                            null
                }



            </div>

            {
                !props.hideSearch && router.pathname.includes('management') ?
                    <div style={{ display: "flex", gap: "10px", marginTop: "0px" }}>
                        <div style={{ marginTop: "0px", color: "gray" }}><BiSearchAlt2 style={{ fontSize: "20px", marginTop: "3px" }} /> </div>
                        <div><Input placeholder="Search" style={{ borderRadius: "20px", border: "none", boxShadow: "0 10px 14.72px 1.28px rgba(168, 168, 189, 0.25)", height: "40px", marginTop: "-15px" }} onChange={props?.handlers?.filterHandler} /></div>
                    </div>
                    :
                    validators.hasSearch(props?.accessConfig) ? <div style={{ display: "flex", gap: "10px", marginTop: "0px" }}>
                        <div style={{ marginTop: "0px", color: "gray" }}><BiSearchAlt2 style={{ fontSize: "20px", marginTop: "3px" }} /> </div>
                        <div><Input placeholder="Search" style={{ borderRadius: "20px", border: "none", boxShadow: "0 10px 14.72px 1.28px rgba(168, 168, 189, 0.25)", height: "40px", marginTop: "-15px" }} onChange={props?.handlers?.filterHandler} /></div>
                    </div>
                        :
                        null
            }



        </div>}

        <div style={{ width: "100%", marginTop: "30px", border: "1px solid #4ec2f0", borderRadius: "15px", padding: "25px", display: "block", overflow: "auto", overflowX: "hidden", backgroundColor: "#fff", boxShadow: "0 20px 14.72px 1.28px rgba(168, 168, 189, 0.25)" }}>

            <Form form={props?.form} component={false}>
                <Table
                    style={{ position: "relative" }}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    scroll={{ x: props.width }}
                    bordered
                    dataSource={props?.data?.length ? props?.data : []}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ defaultPageSize: 25, showSizeChanger: true }}
                />
            </Form>


        </div>
        <ReactSpreadsheetImport isOpen={isOpen} onClose={() => setOpen(false)} onSubmit={onImportSubmit} fields={props?.fields} />
    </div>;
};



export default Editable;