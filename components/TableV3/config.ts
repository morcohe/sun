

/* Configurations */


export const TABLE_SIZE = {
    BASE_HEIGHT: 350,
    MIN_STEPS_HEIGHT: 0,
    MAX_STEPS_HEIGHT: 500,
    STEP_SIZE: 20
}




/* Styles */




export const STYLES = {

}




/* Types */


export type TConfig = {
    isOriginColumns?: boolean,              //in case we dont supply custom columns (if added you shoud not supply columns)
    fixedColumns?: Array<number>,           //an array of index row numbers to make them fixed to the left 
    columnsToHide?: Array<string>,          //an array of column names we want to hide
    csvExport?: boolean,                    //display csv export button (if added you should also supply a title for the table)
    isRowNumbers?: boolean                  //display row indexes
}


export type TTableV3 = {
    rows: Array<any>,                       //an array of rows (each row is an object)
    columns?: any,                          //an array of antd table column configuration
    config?: TConfig,                       //table configuration object
    isLoading?: boolean,                    //isLoading indicator
    title?: string,                         //table title
    width?: number,                         //width parameter of window
    height?: number
}