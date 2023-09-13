import { useState } from "react";


export function useCols() {

  const [isEdit, setEdit] = useState<boolean>(false);



  

  // useEffect(() => {
  //   if (curItemChangedIndex > -1) {
  //     //running after table data updating (after saving changes on GUI)
  //     saveRowEdit(data[curItemChangedIndex]);
  //   }
  // }, [data]);



  return {
    setEdit,
    isEdit
  }

}