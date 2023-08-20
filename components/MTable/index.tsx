import { useState } from 'react';
import { useEffect } from 'react';
import styles from '../../styles/MTable.module.css';
import MTableService from './core/table.service';
import { getColumns } from './core/column';
import { Button } from 'antd';


const mock = [
    {
        "id": "#111",
        "Name": "Test ticket 1",
        "Description": "Hello, is it me you looking for?!",
        "Priority": "Low",
        "Type": "abcd",
        "Requestor": "Mor Cohen",
        "Agent": "Nashnash",
        "last update": "July 16, 2022 6:51 PM"
    },
    {
        "id": "#222",
        "Name": "Test ticket 2",
        "Description": "Hello, is it me you looking for?!",
        "Priority": "Medium",
        "Type": "a1b1c4",
        "Requestor": "Bibi Natanyahoo",
        "Agent": "Yevgeni T",
        "last update": "June 27, 2022 5:28 PM"
    },
    {
        "id": "#333",
        "Name": "Test ticket 3",
        "Description": "Hello, is it me you looking for?!",
        "Priority": "High",
        "Type": "001234",
        "Requestor": "Hana Banana",
        "Agent": "Amos Hagay",
        "last update": "July 2, 2022 8:26 PM"
    },
]

const mTable = new MTableService();

const MTable = (props: any) => {


    const [cols, setCols] = useState<Array<string>>();
    const [rows, setRows] = useState<Array<any>>();
    const [page, setPage] = useState<number>();
    const [rowsPerPage, setRowsPerPage] = useState<number>();


    useEffect(() => {
        const tmpCols = getColumns(mock[0]);
        setCols(tmpCols);
        mTable.signComponent(setRows);
        mTable.set(mock);
    }, [])




    return (<div>
        <div style={{ padding: "15px", display: "flex", width: "100%", justifyContent: "space-between" }}>
            <h3>Tickets</h3>
            <div>
                <Button>Opened</Button>
                <Button>Closed</Button>
            </div>
        </div>

        <div className={styles.table}>

            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                <Button type="primary" onClick={() => mTable.add({
        "id": "#444",
        "Name": "Test ticket 4",
        "Description": "Hello, is it me you looking for?!",
        "Priority": "Low",
        "Type": "abcd",
        "Requestor": "Yaron fds",
        "Agent": "Moshe Hagshur",
        "last update": "July 1, 2022 11:00 AM"
    })}>add row</Button>
                <p>jjjj</p>
            </div>

            {
                cols && <table style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom:"1.5px dashed rgb(227, 235, 249)" }}>
                            {
                                cols?.map((item: any, index: number) => {
                                    return <th style={{ padding:"25px", paddingLeft:"10px", color: "#dcdcdc" }} key={`th-${index}`} >{item}</th>
                                })
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            rows?.map((item: any, index: number) => {
                                return <tr key={`row-${index}`} className={styles.tr} style={{borderBottom:"1.5px dashed rgb(227, 235, 249)"}}>
                                    {
                                        Object.keys(item)?.map((key: string, keyIndex: number) => {
                                            return <td style={{ padding:"25px", paddingLeft:"10px" }} key={`td-${index}-${keyIndex}`} data-th={item[key]}>{item[key]}</td>
                                        })
                                    }
                                </tr>
                            })
                        }
                    </tbody>

                </table>
            }

<div>
                    footer
                </div>

        </div></div>)


}


export default MTable;