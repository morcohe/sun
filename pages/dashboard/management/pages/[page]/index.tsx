import { useEffect } from 'react';
import { Typography, Divider, Button, Popconfirm, Select } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import { auth } from '../../../../../src/AccessControl';
import Editable from '../../../../../components/Editable';
import { useEditable } from '../../../../../hooks/useEditable';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import OptionsTag from '../../../../../components/Pages/OptionsTag';



export async function getServerSideProps({ req }: any) {

    const authRes = await auth("Pages", req);

    if (Object.keys(authRes).includes("redirect")) {
        return authRes;
    }

    else if (req.url.includes("page=")) {
        return {
            props: {
                ...authRes.props,
                page: req.url.split("page=")[1]
            }
        }
    }

    else {
        return {
            props: {
                ...authRes.props,
                page: req.url.replace("/dashboard/management/pages/", "")
            }
        }
    }

}



const Pages = (props: any) => {

    const router = useRouter();


    const redirectBack = () => {
        router.back();
    }


    const {
        form,
        data,
        fetchData,
        editingKey,
        init,
        setDeleteUrl,
        isEditing,
        save,
        deleteRow,
        edit,
        cancel,
        filterHandler,
        setTmpCurEditingSelect,
        tmpCurEditingSelect,
        setTmpCurEditingTags,
        tmpCurEditingTags
    } = useEditable();


    const cols = [
        {
            title: 'Column',
            dataIndex: 'column',
            width: '50px',
            editable: true,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: '50px',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                        key="type-select"
                        style={{ width: "100%" }}
                        placeholder="Type"
                        onChange={(e: any) => {
                            setTmpCurEditingSelect([...tmpCurEditingSelect, { value: [e], name: "type", index: data.findIndex((item: any) => record.key === item.key) }])
                        }
                        }
                        defaultValue={record.type}
                    >
                        <Select.Option key={"Text"} value={"Text"}>
                            Text
                        </Select.Option>
                        <Select.Option key={"Boolean"} value={"Boolean"}>
                            Checkbox
                        </Select.Option>
                        <Select.Option key={"Select"} value={"Select"}>
                            Select
                        </Select.Option>
                    </Select>
                ) :
                    (record.type);
            },
        },

        {
            title: 'Options',
            dataIndex: 'options',
            width: '50px',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                        key="options-select"
                        mode="tags"
                        style={{ width: "100%" }}
                        placeholder="Options"
                        onChange={(e: any) => { 
                            setTmpCurEditingSelect([...tmpCurEditingSelect, { value: e, name: "options", index: data.findIndex((item: any) => record.key === item.key) }]) }}
                        defaultValue={record.options}
                        options={record["options"].map((item: any) => {
                            return {
                                label: item, value: item
                            }
                        })}
                    />
                ) :
                    <OptionsTag key="options-tag" disabled={true} tagsName="options" setTmpCurEditingTags={setTmpCurEditingTags} options={record.options ? record.options.map((r: any) => {
                        if (r === "*") {
                            return "All"
                        } else { return r }
                    }) : []} />;
            }
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
        if (props) {
            init('/api/page?page=' + props?.page, cols);
            setDeleteUrl('/api/page')
        }
    }, [props]);



    return <div>
        <Button onClick={redirectBack} size="large" style={{ display: "flex", gap: "2px", marginTop: "0px", fontSize: "16px", marginLeft: "10px" }} type="link">
            <RiArrowGoBackLine /> <div style={{ marginTop: "-5px" }}>Back</div>
        </Button>
        <Divider style={{ backgroundColor: "lightblue", marginTop: "5px", boxShadow: "0 8px 14.72px 1.28px rgba(154,154,204,.5)" }} />
        <div style={{ width: "100%", padding: "25px", display: "flex", gap: "10px", marginTop: "-20px" }}>
            <h2 style={{ marginLeft: "50px", marginTop: "0px" }}>{`Page ${props.page}`} | </h2>
            <h3 style={{ marginTop: "7px" }}>
                Page management
            </h3>
        </div>

        <div style={{ paddingRight: "5%", paddingLeft: "5%" }}>
            <Divider style={{ backgroundColor: "gray", marginTop: "-15px" }} />
        </div>



        <div style={{ height: "70vh", marginTop: "-20px", overflow: "scroll", position: "absolute", width: "100%", marginLeft: "0%", paddingLeft: "4%", paddingRight: "5%" }}>
            <Editable edit={edit} cancel={cancel} save={save} deleteRow={deleteRow} editingKey={editingKey} width={1000} height="49vh" title={""} data={data} columns={cols} form={form} isEditing={isEditing} fetchData={fetchData} handlers={{ filterHandler }} fields={[]} importURL="" apiURL={`/api/page?page=${props?.page}`} createPath={`/dashboard/management/pages/table/${props.page}/column/create`} createTitle="Add Column" hideImport={true} />
        </div>


    </div>
}

export default Pages;