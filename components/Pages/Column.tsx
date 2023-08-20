import { Form, Input, Select, Button, notification, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import { useEffect } from 'react';




const columnTypes = [
    { label: 'Text', value: 'Text' },
    { label: 'Checkbox', value: 'Boolean' },
    { label: 'Select', value: 'Select' },
];



const CreatePageFormColumn = (props: any) => {

    
    const [inputName, setInputName] = useState<string>("");
    const [selectValue, setSelectValue] = useState<"Text" | "Boolean" | "Select">("Text");
    const [options, setOptions] = useState<Array<string>>([]);
    const [inputOption, setInputOption] = useState<string>("");
    const inputRef: any = useRef<any>();



    const handleNameChange = (value: any) => {
        if(value?.target?.value?.length){
            setInputName(value?.target?.value);
        }
    };


    const handleSelectChange = (optionValue: "Text" | "Boolean" | "Select") => {
        setSelectValue(optionValue);
    };


    const handleAddOption = () => {
        if(inputOption.length){
            setOptions([ ...options, inputOption ])
            setInputOption("");
        }
    }


    const handleRemoveOption = (op: string) => {
        const tmpOptions = options?.filter((opt: string) => op !== opt);
        setOptions(tmpOptions);
    }


    const onFinish = (e: any) => {
        if(selectValue === "Select"){
            props?.addColumn({
                name: inputName,
                type: selectValue,
                options
            });
        } else {
            props?.addColumn({
                name: inputName,
                type: selectValue
            });
        }
        
        setInputName("");
        setSelectValue("Text");
        setOptions([]);
    }


    return <div style={{display:"flex", flexDirection:"column", gap:"25px"}}>

        <div style={{display:"flex", gap:"7px"}}>
            <h3>New Column | </h3>
            <p style={{marginTop:"2px"}}>Add a column to your table</p>
        </div>

        <div>
        <p>Title:</p>
            <Input value={inputName} onChange={handleNameChange} size="large" name="columnName" placeholder="Enter a name for the column" />
        </div>

        <div>
            <p>Type:</p>
            <Select onChange={handleSelectChange} style={{width:"100%"}} size="large" placeholder="Select the column type" value={selectValue} options={columnTypes} />
        </div>


        {
            selectValue === "Select" && <div>
                <ul>
                {
                    options?.map((item: string, index: number) => {
                        return <li style={{display:"flex", gap:"15px"}}>
                            <div>Option {index} : {item}</div>
                            <div><Button onClick={()=>handleRemoveOption(item)}>Remove</Button></div>
                        </li>
                    })
                }
                </ul>
                
                <div style={{display:"flex", gap:"15px"}}>
                    <input ref={inputRef} value={inputOption} placeholder="Enter option" onChange={(e:any)=>setInputOption(e.target.value)} />
                    <Button onClick={handleAddOption}>+ Add</Button>
                </div>
                
            </div>
        }


        <div>
            <Button onClick={onFinish}>
                Submit Column
            </Button>
        </div>
    </div>
}

export default CreatePageFormColumn;