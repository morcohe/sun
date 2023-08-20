import { Input, Select, Button } from 'antd';
import Swal from 'sweetalert2';
import { useState, useRef } from 'react';
import mFetcher from '../../src/Fetch/Fetcher';



const columnTypes = [
    { label: 'Text', value: 'Text' },
    { label: 'Checkbox', value: 'Boolean' },
    { label: 'Select', value: 'Select' },
];



const CreateColumnForm = (props: any) => {

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


    const onFinish = async (e: any) => {
        if(selectValue === "Select"){
            await save({
                name: inputName,
                type: selectValue,
                options
            });
        } else {
            await save({
                name: inputName,
                type: selectValue
            });
        }
        
        setInputName("");
        setSelectValue("Text");
        setOptions([]);
    }


    const save = async (payload: any) => {
        try {

            const fRes = await mFetcher.fetch({ url: `/api/page?op=create&entity=column&table=${props.table}`, method: 'POST', data: payload });
            console.log("Fetch Response: ", fRes.data);
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `The column "${name}" has been created`,
                confirmButtonText: "Ok"
              }).then((result) => {
                if (result.isConfirmed) {
                  props.done();
                }
              });

        } catch (error) {
            console.error(error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `The column "${name}" not created`,
                confirmButtonText: "Try Again"
              });
        }
        
    };



    return <div style={{display:"flex", flexDirection:"column", gap:"25px"}}>


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

export default CreateColumnForm;