


class TableV3 {

    visibleColumns: any = null;

    constructor(){

    }


    setVisibleColumns = (value: any) => this.visibleColumns = value;

    getVisibleColumns = () => this.visibleColumns;


    handleChangeVisibleColumns = (name: string, checked: boolean) => {
        console.log(">>> handleChangeVisibleColumns: ", name, checked);
        this.visibleColumns[name] = checked;
    }




}


const tv3 = new TableV3();
export default tv3;