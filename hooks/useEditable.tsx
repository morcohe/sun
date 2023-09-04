import { useState, useEffect } from "react";
import mFetcher from "../src/Fetch/Fetcher";
import { Form, notification } from 'antd';


export function useEditable() {

  const [url, setUrl] = useState<string>('');
  const [deleteUrl, setDeleteUrl] = useState<string>('');
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [originData, setOriginData] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [editingKey, setEditingKey] = useState('');
  const [saveURL, setSaveURL] = useState('');

  // In case that we added a custom dropdown input select we hold its state
  const [tmpCurEditingSelect, setTmpCurEditingSelect] = useState<Array<any>>([]);

  // In case that we added a custom tags input we hold its state
  const [tmpCurEditingTags, setTmpCurEditingTags] = useState<any>([]);

  // Holding the current editing row index
  const [curItemChangedIndex, setCurItemChangedIndex] = useState<number>(-1);

  const [tmpCurEditingInputs, setTmpCurEditingInputs] = useState<any>([]);



  // This function MUST run first - initializing table configuration
  const init = async (baseUrl: string, tmpColumns: any[], data?: any) => {
    initColumns([...tmpColumns]);
    await initData(baseUrl, data);
  }


  const addRow = (row: any) => {
    console.log("NEW ROW: ", row)
    console.log("FIRST DATA ROW: ", data[0])
    setData([row, ...data]);
  }


  const refreshTable = async () => {
    const response = await mFetcher.fetch({ url: url, method: "GET" });
    setData([...response.data.data.data, ...data]);
    setOriginData([...response.data.data.data, ...data]);
  }



  // Fetching the data to render in the table
  const fetchData = async (baseUrl: string) => {
    try {
      const response = await mFetcher.fetch({ url: baseUrl, method: "GET" });
      console.log("===>FETCH DATA: ", response.data.data)
      setData(response.data.data);
      setOriginData(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error)
    }
  }


  const initData = async (baseUrl: string, data?: any) => {
    setUrl(baseUrl);
    try {
      let fetchedData;
      if (data) {
        setData(data);
        setOriginData(data);
        fetchedData = data;
      } else {
        fetchedData = await fetchData(baseUrl);
      }

      let tmp: any[] = [];
      for await (const row of fetchedData) {
        tmp.push({
          key: row.uid ? row.uid : row.code ? row.code : row.id,
          ...row
        })
      }
      setData(tmp);
    } catch (error) {
      console.error(error);
    }
  }


  const initColumns = (tmpColumns: any[]) => {
    setColumns(tmpColumns);
  }


  // Fetching the data to update
  const saveRowEdit = async (payload: any) => {
    try {
      console.log(">Payload before saving row: ", payload)
      await mFetcher.fetch({ url: saveURL ? saveURL : url, method: "PUT", data: payload });
      notification.success({
        message: "Record Updated Successfuly",
        duration: 10
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Failed to update record",
        duration: 10
      });
    }
  }



  // Fetching a record to delete
  const deleteRow = async (id: string) => {
    try {
      await mFetcher.fetch({ url: deleteUrl.length > 0 ? `${deleteUrl}?id=${id}` : `${url}?id=${id}`, method: "DELETE" });
      const index = data.findIndex((item: any) => id === item.key);
      if (index > -1) {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
        notification.success({
          message: "Record Deleted Successfuly",
          duration: 10
        });
      } else {
        notification.error({
          message: "Failed to delete record",
          description: "Could not find the row index",
          duration: 10
        })
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Failed to delete record",
        duration: 10
      })
    }
  }



  // Indicates editing state
  const isEditing = (record: any) => record.key === editingKey;



  const edit = (record: any & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    const index = data.findIndex((item: any) => record.key === item.key);
    if (index > -1) {
      setCurItemChangedIndex(index)
    }

    setEditingKey(record.key);
  };



  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as any;
      let newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {

        let item = newData[index];
        console.log("SAVE - item: ", item)

        if (tmpCurEditingSelect.length) {
          for await (const x of tmpCurEditingSelect) {
            item[x.name] = [...x.value];
          }
        }
        else if (tmpCurEditingTags.length) {
          item[tmpCurEditingTags.name] = [...tmpCurEditingTags.values];
        }

        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setData(newData);
        setEditingKey('');
        setTmpCurEditingSelect([]);
        setTmpCurEditingTags([]);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };



  const cancel = () => { setEditingKey('') };


  const filterHandler = async (input: any) => {
    const txt: string = input.target.value;
    if (txt.length > 2) {
      let tmp: any = [];
      for await (const row of originData) {
        for await (const item of Object.keys(row)) {
          if (typeof row[item] === 'string') {
            if (row[item]?.toLowerCase().includes(txt)) {
              tmp = [...tmp, row];
              break;
            }
          }
        }
      }
      setData(tmp);
    } else {
      setData(originData);
    }
  };



  useEffect(() => {
    if (curItemChangedIndex > -1) {
      //running after table data updating (after saving changes on GUI)
      saveRowEdit(data[curItemChangedIndex]);
    }
  }, [data]);


  useEffect(() => {
    console.log("tmpCurEditingInputs CHANGED: ", tmpCurEditingInputs)
  }, [tmpCurEditingInputs]);



  return {
    init,
    setDeleteUrl,
    setSaveURL,
    isEditing,
    edit,
    save,
    cancel,
    setTmpCurEditingSelect,
    tmpCurEditingSelect,
    setTmpCurEditingTags,
    setTmpCurEditingInputs,
    tmpCurEditingTags,
    editingKey,
    addRow,
    deleteRow,
    form,
    data,
    fetchData,
    clmns: columns,
    filterHandler,
    setData,
    refreshTable
  }

}