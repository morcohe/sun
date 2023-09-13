import { Modal, Button, Input, Select, Checkbox, Form } from "antd";
import { useState, useEffect } from "react";
import { BiAddToQueue } from 'react-icons/bi';
import mFetcher from "../src/Fetch/Fetcher";
import { useForm } from "antd/lib/form/Form";


type TProps = {
    columns: Array<any>,
    name: string,
    addRow: any
}


const filterObject = (obj: any, keys: Array<string>) => {
    return Object.keys(obj).
        filter((key) => !keys.includes(key)).
        reduce((cur, key) => { return Object.assign(cur, { [key]: obj[key] }) }, {});
}


const NewRowModal = (props: TProps) => {


    const [isVisible, setVisible] = useState<boolean>(false);
    const [form, setForm] = useState<any>({});
    const [fform] = useForm();



    const initData = async () => {
        let tmp: any = {};
        for await (const col of props?.columns) {
            tmp[col.column] = col.type === "Boolean" ? false : col.type === "Select" ? col.options[0] : '';
        }
        setForm(tmp);
    }


    const handleInputChange = (name: string, value: string) => {
        setForm({
            ...form,
            [name]: value
        })
    }


    const handleSelectChange = (name: string, e: any) => {
        setForm({
            ...form,
            [name]: e
        })
    }


    const handleCheckboxChange = (name: string, e: any) => {
        setForm({
            ...form,
            [name]: e.target.checked
        })
    }




    const onSubmit = async () => {
        const payload = filterObject(fform.getFieldsValue(), ['Operation', 'AssignedUsers']);

        try {
            const fRes = await mFetcher.fetch({ url: `/api/record`, method: "POST", data: { page: props?.name, data: payload } })

            if (fRes?.data?.success === true) {
                const tmp = {
                    ...fRes?.data?.data,
                    ...fRes?.data?.data?.data,
                    key: fRes?.data?.data?.id
                }
                const toAdd = filterObject(tmp, ['data', 'page']);
                props?.addRow(toAdd);
                onCancel();
            }
            await initData();
        } catch (error) {
            console.error(error);
        }
    }





    const onCancel = () => {
        setVisible(!isVisible);
        fform.resetFields();
    }



    useEffect(() => {
        initData();
    }, []);


    return <div>
        <Button style={{ borderRadius: "15px", backgroundColor: "#4a4a69", color: "#fff", display: "flex", gap: "5px", boxShadow: "0 2px 5px 1px rgba(154,154,204,.15)" }}
            onClick={() => setVisible(!isVisible)} >
            <BiAddToQueue style={{ fontSize: "16px", marginTop: "3px" }} />
            <div style={{ fontSize: "12px", marginTop: "1px" }}>Add Record</div>
        </Button>

        <Modal title="Add Record" visible={isVisible} onOk={onSubmit} onCancel={onCancel}>
            <Form form={fform} onFinish={onSubmit}>
                <div style={{ width: "100%", display: "flex", gap: "30px", flexDirection: "column" }}>
                    {
                        props?.columns?.map((col: any, index: number) => {
                            if (col.type === "Text") {
                                return <div key={`new-row-modal-input-${col.column}-${index}`} style={{ display: "flex", gap: "25px" }}>
                                    <div style={{ fontSize: "12px", width: "30%", paddingTop: "7px" }}>{col.column}: </div>
                                    <Form.Item style={{ width: "50%" }} name={col.column}>
                                        <Input title={col.column} onChange={(e: any) => handleInputChange(col.column, e.target.value)} />
                                    </Form.Item>

                                </div>
                            }
                            else if (col.type === "Select") {
                                return <div key={`new-row-modal-input-${col.column}-${index}`} style={{ display: "flex", gap: "25px" }}>
                                    <div style={{ fontSize: "12px", width: "30%", paddingTop: "7px" }}>{col.column}: </div>
                                    <Form.Item style={{ width: "50%" }} name={col.column}>
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder={col.column}
                                            onChange={(e: any) => { handleSelectChange(col.column, e) }}
                                            defaultValue={{ value: typeof col.options === 'string' ? JSON.parse(col.options)[0] : col.options[0], label: typeof col.options === 'string' ? JSON.parse(col.options)[0] : col.options[0] }}
                                            options={typeof col.options !== 'string' ? col.options?.map((item: any) => {
                                                return { value: item, label: item }
                                            })
                                                :
                                                JSON.parse(col.options)?.map((item: any) => {
                                                    return { value: item, label: item }
                                                })
                                            }
                                        />
                                    </Form.Item>

                                </div>
                            }
                            else if (col.type === "Boolean") {
                                return <div key={`new-row-modal-input-${col.column}-${index}`} style={{ display: "flex", gap: "25px" }}>
                                    <div style={{ fontSize: "12px", width: "21.5%", paddingTop: "3px" }}>{col.column}: </div>
                                    <Form.Item style={{ width: "50%" }} name={col.column}>
                                        <Checkbox onChange={(e: any) => {
                                            handleCheckboxChange(col.column, e);
                                        }} />
                                    </Form.Item>

                                </div>
                            }
                            return <></>
                        })
                    }
                </div>
            </Form>

        </Modal>
    </div>
}


export default NewRowModal;