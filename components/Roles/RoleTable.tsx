import { useEffect } from 'react';
import { Typography, Divider, Button, Popconfirm, Select, Checkbox, Tag } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
//import { auth } from '../../../../src/AccessControl';
import Editable from '../../components/Editable';
import { useEditable } from '../../hooks/useEditable';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import OptionsTag from '../../components/Pages/OptionsTag';



const roleOptions = [
    { "label": "All", "value": "*" },
    { "label": "Own", "value": "Own" },
    { "label": "Super Admin", "value": "SuperAdmin" },
    { "label": "Admin", "value": "Admin" },
    { "label": "Marketing", "value": "Marketing" },
    { "label": "Sales", "value": "Sales" },
    { "label": "Seeking", "value": "Seeking" }
]

const RoleTable = (props: any) => {

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
        tmpCurEditingTags,
    } = useEditable();


    const cols = [
        {
            title: 'Table',
            dataIndex: 'page',
            width: '100px',
            editable: false,
        },
        {
            title: 'Columns',
            dataIndex: 'columns',
            width: '170px',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? 
                
                <Select
                    key="columns-select"
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="columns"
                        onChange={(e: any) => { setTmpCurEditingSelect([...tmpCurEditingSelect,{ value: e, name: "columns", index: data.findIndex((item: any) => record.key === item.key) }]) }}
                        defaultValue={record.columns[0] === "*" ? props?.pageColumns[record.page].map((opt:any)=> { return {label:opt, value:opt} }) : record.columns}
                        options={props?.pageColumns ? props?.pageColumns[record.page].map((opt:any)=> { return {label:opt, value:opt} }) : []}
                    />
                :
                    <OptionsTag tmpCurEditingTags={props?.tmpCurEditingTags} key="columns-tags" disabled={true} tagsName="columns" setTmpCurEditingTags={setTmpCurEditingTags} options={props?.pageColumns ? record.columns[0] === "*" ? 
                    ["All"]
                    : 
                    record.columns.length > 0 ? record.columns
                    :
                    [<small style={{color:"red"}}>None - Page is not accessible</small>]
                    :
                    [<small style={{color:"red"}}>None - Page is not accessible</small>]
                } 
                    />;
                
            }
        },
        {
            title: 'Read',
            dataIndex: 'read',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                    key="read-select"
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Read"
                        onChange={(e: any) => { setTmpCurEditingSelect([...tmpCurEditingSelect,{ value: e, name: "read", index: data.findIndex((item: any) => record.key === item.key) }]) }}
                        defaultValue={record.read}
                        options={roleOptions}
                    />
                ) :
                    <OptionsTag key="read-tags" disabled={true} tagsName="read" setTmpCurEditingTags={setTmpCurEditingTags} options={record.read ? record.read.map((r:any)=> {
                        if(r === "*"){
                            return "All"
                        } else { return r }
                    }): []} />;
            },
        },
        {
            title: 'Write',
            dataIndex: 'write',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ?
                    <Checkbox onChange={(e: any) => {
                        record.write = e.target.checked;
                    }} defaultChecked={record.write} />
                    :
                    record.write ? <div>V</div> : <div>X</div>
            }
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                    key="edit-select"
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Edit"
                        onChange={(e: any) => { setTmpCurEditingSelect([...tmpCurEditingSelect,{ value: e, name: "edit", index: data.findIndex((item: any) => record.key === item.key) }]) }}
                        defaultValue={record.edit}
                        options={roleOptions}
                    />
                ) :
                    <OptionsTag key="edit-tags" disabled={true} tagsName="edit" setTmpCurEditingTags={setTmpCurEditingTags} options={record.edit ? record.edit.map((r:any)=> {
                        if(r === "*"){
                            return "All"
                        } else { return r }
                    }) : []} />;
            }
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                    key="delete-select"
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Delete"
                        onChange={(e: any) => { setTmpCurEditingSelect([...tmpCurEditingSelect,{ value: e, name: "delete", index: data.findIndex((item: any) => record.key === item.key) }]) }}
                        defaultValue={record.delete}
                        options={roleOptions}
                    />
                ) :
                    <OptionsTag key="delete-tags" disabled={true} tagsName="delete" setTmpCurEditingTags={setTmpCurEditingTags} options={record.delete ? record.delete.map((r:any)=> {
                        if(r === "*"){
                            return "All"
                        } else { return r }
                    }) : []} />;
            }
        },
        {
            title: 'Import',
            dataIndex: 'import',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ?
                <Checkbox key="import-checkbox" onChange={(e: any)=>{
                    record.import = e.target.checked;
                }} defaultChecked={record.import} />
                :
                record.import ? <div>V</div> : <div>X</div>
            }
        },
        {
            title: 'Export',
            dataIndex: 'export',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ?
                <Checkbox key="export-checkbox" onChange={(e: any)=>{
                    record.export = e.target.checked;
                }} defaultChecked={record.export} />
                :
                record.export ? <div>V</div> : <div>X</div>
            }
        },
        {
            title: 'Assign',
            dataIndex: 'assign',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Select
                    key="assign-select"
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Assign"
                        onChange={(e: any) => { setTmpCurEditingSelect([...tmpCurEditingSelect,{ value: e, name: "assign", index: data.findIndex((item: any) => record.key === item.key) }]) }}
                        defaultValue={record.assign}
                        options={roleOptions}
                    />
                ) :
                    <OptionsTag key="assign-tag" disabled={true} tagsName="assign" setTmpCurEditingTags={setTmpCurEditingTags} options={record.assign ? record.assign.map((r:any)=> {
                        if(r === "*"){
                            return "All"
                        } else { return r }
                    }) : []} />;
            }
        },
        {
            title: 'Search',
            dataIndex: 'search',
            editable: false,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ?
                <Checkbox key="search-checkbox" onChange={(e: any)=>{
                    record.search = e.target.checked;
                }} defaultChecked={record.search} />
                :
                record.search ? <div>V</div> : <div>X</div>
            }
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            fixed: 'right',
            width: '100px',
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
            init('/api/role?role=' + props?.role, cols, props?.data);
            setDeleteUrl('/api/role')
        }
    }, [props]);


    

    return <div>

        <div style={{ height: "100%", marginTop: "0px", overflow: "scroll", width: "120%", marginLeft: "0%", paddingLeft: "1%", paddingRight: "2%" }}>
            <Editable edit={edit} cancel={cancel} save={save} deleteRow={deleteRow} editingKey={editingKey}  width={1100} height="100%" title={props.title} data={data} columns={cols} form={form} isEditing={isEditing} fetchData={fetchData} handlers={{ filterHandler }} fields={[]} importURL="" apiURL={`/api/role?role=${props?.role}`} hideImport={true} hideExport={true} createPath={`/dashboard/management/pages/table/${props.page}/column/create`} hideCreate={true} hideSearch={true} hideToolbar={false} />
        </div>

    </div>
}


export default RoleTable;