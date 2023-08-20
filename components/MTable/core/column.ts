

export const getColumns = (rowObject: any, columnsToHide?: Array<string>) => {
    const keys = Object.keys(rowObject);
    if(columnsToHide){
        const filtered = filterColumns(keys, columnsToHide);
        return filtered;
    } else {
        return keys;
    }
}


const filterColumns = (columns: Array<string>, columnsToHide: Array<string>) => {
    return columns.filter((key: string) => !columnsToHide.includes(key))
}