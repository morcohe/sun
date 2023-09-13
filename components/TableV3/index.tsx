
import { useEffect, useState, useRef } from 'react';
import { CSVLink } from "react-csv";
//import { CiExport, CiBoxList } from 'react-icons/ci';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { Table, Input, InputNumber, Button, Empty, Modal, Checkbox, Tooltip } from 'antd';
import { TABLE_SIZE } from './config';


import type { InputRef } from 'antd';
import type { TTableV3 } from './config';


const moment = require('moment');



const { BASE_HEIGHT, MIN_STEPS_HEIGHT, MAX_STEPS_HEIGHT, STEP_SIZE } = TABLE_SIZE;

const SMALL_SCREEN_MAX_WIDTH = 600;
const SMALL_SCREEN_MAX_FIXED_CELL_WIDTH = 82;

const TableV3 = (props: TTableV3) => {


    const [originColumns, setOriginColumns] = useState<Array<any>>();   //a copy of props?.columns
    const [columns, setColumns] = useState<Array<any>>();               //the final form of columns array
    const [originRows, setOriginRows] = useState<Array<any>>([]);
    const [rows, setRows] = useState<Array<any>>([]);                     //the final form of rows list to display in the table
    const [rowsCounter, setRowsCounter] = useState<number>(0);
    
    const searchInput = useRef<InputRef>(null);                         //column search input reference

    const [visibleColumnsModal, setVisibleColumnsModal] = useState<boolean>(false);     //a boolean state of selecting visible columns modal visibility
    const [visibleColumns, setVisibleColumns] = useState<any>({});                      //an object of key:value {columnName: boolean} of columns to display

    const [tableHeight, setTableHeight] = useState<number>(90);

    const [globalSearchInput, setGlobalSearchInput] = useState<string>("");

    const [fixedCellWidth, setFixedCellWidth] = useState<number>(props?.width && props.width < SMALL_SCREEN_MAX_WIDTH ? SMALL_SCREEN_MAX_FIXED_CELL_WIDTH : 200);

    const scroll: any = { x: props?.width && props?.width < SMALL_SCREEN_MAX_WIDTH ? 500 : 1300, y: (props?.height ? props?.height / 1.9 : BASE_HEIGHT) + tableHeight };





    const handleInputChangeTableHeight = (value: number) => {
        if (value >= MIN_STEPS_HEIGHT && value <= MAX_STEPS_HEIGHT) {
            setTableHeight(value);
        }
    }

    /**
     * @description Updating the columns to be displayed state
     * @param name name of the column
     */
    const handleChangeVisibleColumns = (name: string) => {
        setVisibleColumns({
            ...visibleColumns,
            [name]: !visibleColumns[name]
        });
    }



    const handleGlobalSearchInputChange = (e: any) => {
        const textInput = e?.target?.value;
        if (textInput.length >= 3) {
            setGlobalSearchInput(textInput);
        } else {
            if (globalSearchInput !== "") {
                setGlobalSearchInput("");
            }
        }
    }



    const handleGlobalSearchUpdate = async () => {
        if (typeof globalSearchInput === "string" && originRows?.length > 0) {
            if (globalSearchInput?.length < 3) {
                setRows(originRows);
            } else {
                let tmpRows = [];
                for await (const row of originRows) {
                    for await (const col of Object.keys(row)) {
                        if (col !== "index" && col !== "key" && typeof globalSearchInput === "string") {
                            if (row[col]?.toLowerCase().includes(globalSearchInput.toLowerCase())) {
                                tmpRows.push(row);
                                break;
                            }
                        }

                    }
                }
                setRows(tmpRows);
            }
        }

    }



    /**
     * @description Handling column searching
     * @param selectedKeys 
     * @param confirm 
     * @param dataIndex 
     */
    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: any) => void,
        dataIndex: any,
    ) => {
        confirm();
    };



    /**
     * @description Reset the column search input
     * @param clearFilters 
     */
    const handleReset = (clearFilters: () => void) => { clearFilters(); };



    /**
     * @description add fitering and sorting functionalities to the table
     * @param dataIndex 
     */
    const getColumnSearchProps = (dataIndex: any) => ({

        //rendering the drop down search box of the column  
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (

            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>

                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>

                    <Button type="link" size="small" onClick={() => clearFilters && handleReset(clearFilters)} >
                        Reset
                    </Button>

                    <Button style={{ color: "red" }} type="link" size="small" onClick={() => { close(); }} >
                        X Close
                    </Button>

                </div>

                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />

                <Button
                    onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{ width: "100%" }}
                >
                    Apply
                </Button>

            </div>

        ),

        //rendering the filter icon
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ marginRight: fixedCellWidth === SMALL_SCREEN_MAX_FIXED_CELL_WIDTH ? "5px" : "0px", color: filtered ? '#1890ff' : '#155ea2', fontSize: fixedCellWidth === SMALL_SCREEN_MAX_FIXED_CELL_WIDTH ? "12px" : "16px", marginTop: fixedCellWidth === SMALL_SCREEN_MAX_FIXED_CELL_WIDTH ? "10px" : "1px" }} />
        ),

        onFilter: (value: any, record: any) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text: any) => text
    });


    const getCellWidth = (index: number, settedWidth?: any) => {
        //if the column is fixed
        if (props?.config?.fixedColumns?.length && props?.config?.fixedColumns?.includes(index)) {
            //if the width screen size is PC
            if (props?.width && props?.width >= SMALL_SCREEN_MAX_WIDTH) {
                return 150;
            } else {
                //if the width screen size is smartphone
                return fixedCellWidth;
            }
        }
        //the column is not fixed
        else {
            //if the width already configured
            if (settedWidth) {
                return settedWidth;
            }
            //if the width is not configured
            else {
                //if the width screen size is PC
                if (props?.width && props?.width >= SMALL_SCREEN_MAX_WIDTH) {
                    return 350;
                }
                //if the width screen size is smartphone
                else {
                    return 250;
                }
            }
        }
    }


    /**
     * @description in case there is no supplied custom columns array, 
     * this function will make a columns array from rows keys (using the first row keys).
     */
    const handleOriginColumns = async () => {
        
        let firstRow: any = props?.rows[0];
        let lastRow: any = props?.rows[props?.rows.length-1];
        let middleRow: any = props?.rows[props?.rows.length/2];

        const combinedRowColumns = { ...firstRow, ...middleRow, ...lastRow }
        
        let tmpCols = [];
        let index = 0;

        //in case we configured the table to display rows indexes
        if (props?.config?.isRowNumbers) {
            tmpCols.push({
                title: <p style={{ fontWeight: "bold", marginTop: "10px", marginLeft:"20%" }}>ID</p>,
                width: 60,
                dataIndex: 'index',
                key: 'index',
                fixed: 'left',
                responsive: ['lg'],
                render: (value: string) => <div style={{ height: "100%", paddingBottom: "0px", paddingTop: "0%", left: "0px", marginLeft:"50%", textAlign:"center" }}>
                    {value}
                </div>
            });
            index++;
        }

        const titleFormats = [
            {
                from: "DomainName",
                to: "Domain"
            },
            {
                from: "ServerName",
                to: "Server"
            },
        ]

        const formatColumnTitle = async (title: string) => {
            let formated = title;
            for await (const x of titleFormats) {
                if (x.from === title) {
                    formated = x.to;
                    break;
                }
            }
            return <p style={{ fontWeight: "bold", marginTop: "0px" }}>{formated}</p>;
        }



        for await (const prop of Object.keys(combinedRowColumns)) {
            let tmpCol: any = {
                key: prop,
                title: await formatColumnTitle(prop),
                dataIndex: prop,
                width: getCellWidth(index),
                fixed: props?.config?.fixedColumns?.length && props?.config?.fixedColumns?.includes(index) ? "left" : null,
                ...getColumnSearchProps(prop),
                render: (value: string) => <div style={{ height: "100%", paddingBottom: "0px", paddingTop: "0%", left: "0px", paddingLeft:"15px" }}>
                    {
                        value?.length > 100 ?
                            <div style={{ width: "120%", height: "95%", marginTop: "-15px", backgroundColor: value?.length > 100 ? "#c9fff8" : "transparent", paddingRight: "0px", margin: "auto", paddingLeft: props?.config?.fixedColumns?.length && props?.config?.fixedColumns?.includes(index) ? "0px" : value?.length > 100 ? "30px" : "0px", overflow: value?.length > 100 ? "hidden" : "scroll" }}>
                                <pre style={{ height: "100px", fontSize: "12px", width: "110%", color: "#6f4c9b", paddingLeft: props?.width && props?.width < 500 ? "10px" : "25px", paddingRight: "5px", marginTop: "10px", marginBottom: "10px", overflow: "scroll", maxWidth: "100%", wordWrap: "normal", whiteSpace: "normal" }}>
                                    {value}
                                </pre>
                            </div>
                            :
                            <div style={{marginLeft:"15px", width:"100%", wordBreak:"break-word"}}>{value}</div>
                    }
                </div>
            }
            
            tmpCols.push(tmpCol);
            index++;
        }

        setColumns(tmpCols);
        setOriginColumns(tmpCols);

    }


    const handleRender = (value: string, col: any, isFixed?: any) => {

        if (isFixed) {
            //console.log(">> value of render isFixed: ", isFixed)
            return <div style={{ marginLeft: "10px", paddingLeft: "10px" }}>{value}</div>;
        }
        if (value?.length < 30) {
            if (Object.keys(col)?.includes("render")) {
                return col["render"](`${value}`);
            } else {
                return <div>{value}</div>;
            }
        } else {
            if (Object.keys(col)?.includes("render")) {
                return <div>
                    <Tooltip title={value}>
                        {col["render"](`${value}`)}
                    </Tooltip>
                </div>;
            } else {
                return <div>
                    <Tooltip title={value}>
                        <div>{value.slice(0, 20)}...</div>
                    </Tooltip>
                </div>;
            }
        }

    }


    /**
     * @description Initialize the columns state as serialized/parsed.
     */
    const initColumns = async () => {
        if (props?.config?.isOriginColumns) {
            await handleOriginColumns();
        } else {

            let tmpCols = [];

            if (props?.config?.isRowNumbers) {
                tmpCols.push({
                    title: <p style={{ fontWeight: "bold", marginTop: "10px" }}>ID</p>,
                    width: 5,
                    dataIndex: 'index',
                    key: 'index',
                    isSearch: true,
                    fixed: 'left'
                });
            }

            let index = 0;

            for await (const col of props?.columns) {
                if (props?.config?.isRowNumbers && index === 0) {
                    index = 1;
                    continue;
                }
                if (!props?.config?.columnsToHide?.includes(col["key"])) {

                    let tmpCol: any = {
                        key: col["key"],
                        title: <div style={{ fontWeight: "bold", marginTop: "10px" }}>{col["title"]}</div>,
                        dataIndex: col["dataIndex"],
                        render: (value: string) => handleRender(value, col),
                        width: col["fixed"] && col["fixed"] === "left" ? props?.width && props?.width < SMALL_SCREEN_MAX_WIDTH ? fixedCellWidth : col["width"] : col["width"],
                        fixed: col["fixed"],
                        filters: col["filters"],
                        onFilter: col["onFilter"],
                        sorter: col["sorter"],
                        sortDirections: col["sortDirections"]
                    }


                    if (col.isSearch) {
                        tmpCol = {
                            ...tmpCol,
                            ...getColumnSearchProps(col["key"])
                        }
                    }
                    if (col.isTimeSort) {
                        tmpCol = {
                            ...tmpCol,
                            sorter: (a: any, b: any) => moment(b?.time) - moment(a?.time),
                            sortDirections: ['descend']
                        }
                    }
                    tmpCols.push(tmpCol);
                }

                index++;
            }

            setColumns(tmpCols);
            setOriginColumns(tmpCols);
        }
    }



    /**
     * @description Initialize the rows state and parse them into antd table row shape
     */
    const initRows = async () => {
        let tmpRows = [];
        let index = 0;

        for await (const row of props?.rows) {

            let tmpRow: any = {
                "key": index,
                ...row
            };

            //in case we configured the table to display rows indexes we will add the idex property
            if (props?.config?.isRowNumbers) {
                tmpRow = {
                    index,
                    ...tmpRow
                }
            }

            tmpRows.push(tmpRow);
            index++;

        }

        setOriginRows(tmpRows);
        setRows(tmpRows);

    }



    /**
     * @description Handling the columns to be displayed
     */
    const initVisibleColumns = async () => {
        if (!Object.keys(visibleColumns).length && columns) {
            let tmp = {};
            for await (const col of columns) {
                tmp = { ...tmp, [col["key"]]: true };
            }
            setVisibleColumns(tmp);
        }
    }



    useEffect(() => {
        initColumns();
    }, [props?.columns]);


    useEffect(() => {
        if (props?.width && props?.width < SMALL_SCREEN_MAX_WIDTH) {
            setFixedCellWidth(SMALL_SCREEN_MAX_FIXED_CELL_WIDTH);
        } else {
            setFixedCellWidth(200);
        }
    }, [props]);


    useEffect(() => {
        if (columns) {
            initVisibleColumns();
            initRows();
        }
    }, [columns]);


    useEffect(() => {
        handleGlobalSearchUpdate();
    }, [globalSearchInput]);


    useEffect(() => {
        setRowsCounter(rows.length);
    }, [rows]);


    


    const styles: any = {
        loader: { textAlign: "center", marginTop: "6%", fontSize: "24px", paddingBottom: "5%" },
        empty: { textAlign: "center", marginTop: "6%", fontSize: "24px", paddingBottom: "5%" }
    }


    return <div className="table-v3-container">

        <div style={{ width: "100%", padding: "10px", paddingTop: "10px", display: "flex", justifyContent: "space-around" }}>

            <div style={{ width: "100%", display: "flex", gap: "20px", marginTop: "5px" }}>
                <Button onClick={() => {
                    setVisibleColumnsModal(!visibleColumnsModal);
                }} size="large" style={{ display: "flex", gap: "5px" }}>
                    Select Columns
                    {/* <CiBoxList style={{ fontSize: "20px", marginTop: "2px" }} /> */}
                </Button>


                {
                    props?.config?.csvExport && rows && <CSVLink
                        filename={`${props?.title ? props?.title : 'Exported Table'}.csv`}
                        data={props?.rows}
                    >
                        <Button size="large" style={{ display: "flex", gap: "5px" }}>
                            Export
                            {/* <CiExport style={{ fontSize: "20px", marginTop: "2px" }} /> */}
                        </Button>
                    </CSVLink>
                }

                {
                    props?.width && props?.width >= SMALL_SCREEN_MAX_WIDTH && <div style={{ width: "25%", display: "flex", justifyContent: "left", gap: "10px", marginTop: "0px" }}>
                        <div style={{ marginTop: "10px" }}>
                            Height:
                        </div>
                        <div style={{ width: "5%" }}>
                            <InputNumber step={STEP_SIZE} min={MIN_STEPS_HEIGHT} max={MAX_STEPS_HEIGHT} size="small" style={{ height: "38px", width: "60px", marginTop: "1px", paddingTop: "8px" }} value={tableHeight} onChange={(e: any) => handleInputChangeTableHeight(e)} />
                        </div>
                    </div>
                }



                <div style={{ width: "100%", display: "flex", justifyContent: "left", gap: "5px", marginTop: "0px" }}>
                    <div style={{ marginTop: "10px" }}>
                        Rows:
                    </div>
                    <div style={{ marginTop: "10px", fontStyle:"italic" }}>
                        {rowsCounter}
                    </div>
                </div>




            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "right", gap: "10px", marginTop: "5px", paddingRight: props?.width && props?.width < SMALL_SCREEN_MAX_WIDTH ? "0px" : "0px" }}>
                <div style={{ display: "flex", gap: "3px" }}>
                    <div>
                        <SearchOutlined style={{ marginRight: "0px", fontSize: props?.width && props?.width < SMALL_SCREEN_MAX_WIDTH ? "12px" : "14px", marginTop: "14px" }} />
                    </div>
                    <div style={{ marginTop: "10px", fontSize: props?.width && props?.width < SMALL_SCREEN_MAX_WIDTH ? "12px" : "14px" }}>
                        Search:
                    </div>
                </div>

                <div style={{ width: props?.width && props?.width < SMALL_SCREEN_MAX_WIDTH ? "90%" : "25%" }}>
                    <Input style={{ height: "38px", marginTop: "0px" }} placeholder="Type here..." onChange={handleGlobalSearchInputChange} />
                </div>
            </div>


        </div>



        {
            props?.isLoading ? <div style={{ ...styles.loader }}>
                <LoadingOutlined /> Loading...
            </div>
                :
                rows && fixedCellWidth && <Table
                    className="virtual-table"
                    style={{ marginTop: "5px" }}
                    tableLayout="fixed"
                    pagination={false}
                    columns={columns}
                    dataSource={rows}
                    scroll={scroll}
                    onChange={(a,b,c, d)=> { setRowsCounter(d?.currentDataSource?.length) }}
                />
        }


        {
            props?.isLoading === false && !rows && !props?.rows && <div style={{ ...styles.empty }}>
                <Empty />
            </div>
        }



        <Modal onCancel={() => setVisibleColumnsModal(false)} onOk={() => {

            let tmp: any = [];
            Object.keys(visibleColumns).map((name: string) => {
                if (visibleColumns[name]) {
                    tmp.push(name);
                    setVisibleColumns({
                        ...visibleColumns,
                        [name]: true
                    })
                } else {
                    setVisibleColumns({
                        ...visibleColumns,
                        [name]: false
                    })
                }
            });

            setColumns(originColumns?.filter((x: any) => tmp.includes(x["key"])));
            setVisibleColumnsModal(false);


        }} open={visibleColumnsModal} title="Columns to display" >
            <ul>
                {
                    Object.keys(visibleColumns).map((item: string, index: number) => {
                        return <li key={`table-column-visibility-checkbox-${index}`}>
                            <Checkbox checked={visibleColumns[item]} onClick={(e: any) => handleChangeVisibleColumns(item)} >
                                {item[0].toLocaleUpperCase() + item.slice(1)}
                            </Checkbox>
                        </li>
                    })
                }
            </ul>

        </Modal>
    </div>



}



export default TableV3;