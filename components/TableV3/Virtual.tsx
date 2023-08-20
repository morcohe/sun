
import { useEffect, useState, useRef } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { VariableSizeGrid as Grid } from 'react-window';




type TVirtualTableV3 = {
    scroll : any,
    columns: any,
    rows: any,
    fixedCellWidth: number,
}




const VirtualTableV3 = (props: TVirtualTableV3) => {

    const [tableWidth, setTableWidth] = useState(0);

    const gridRef = useRef<any>();
    const [connectObject] = useState<any>(() => {
        const obj = {};
        Object.defineProperty(obj, 'scrollLeft', {
            get: () => {
                if (gridRef.current) {
                    return gridRef.current?.state?.scrollLeft;
                }
                return null;
            },
            set: (scrollLeft: number) => {
                if (gridRef.current) {
                    gridRef.current.scrollTo({ scrollLeft });
                }
            },
        });

        return obj;
    });

    const resetVirtualGrid = () => {
        gridRef.current?.resetAfterIndices({
            columnIndex: 0,
            shouldForceUpdate: true,
        });
    };

    useEffect(() => resetVirtualGrid, [tableWidth]);

    const renderVirtualList = (rawData: any, { scrollbarSize, ref, onScroll }: any) => {
        ref.current = connectObject;
        const totalHeight = rawData.length * 54;

        return (
            <Grid
                ref={gridRef}
                className="virtual-grid"
                columnCount={props?.columns && props?.columns.length ? props?.columns.length : 10}
                columnWidth={(index: number) => {
                    const { width } = props?.columns && props?.columns[index];
                    return totalHeight > (props?.scroll?.y as number) && props?.columns && index === props?.columns.length - 1
                        ? (width as number) - scrollbarSize - 1
                        : (width as number);
                }}
                height={props?.scroll!.y as number}
                rowCount={rawData.length}
                rowHeight={() => 100}
                width={tableWidth}
                onScroll={({ scrollLeft }: { scrollLeft: number }) => {
                    onScroll({ scrollLeft });
                }}
            >
                {({
                    columnIndex,
                    rowIndex,
                    style,
                }: {
                    columnIndex: number;
                    rowIndex: number;
                    style: React.CSSProperties;
                }) => {
                    if (props?.columns?.length) {
                        let content: any = rawData[rowIndex][props?.columns[columnIndex].dataIndex];
                        if ('render' in props?.columns[columnIndex]) {
                            content = props?.columns[columnIndex].render(content);
                        } else {
                            content = <div style={{marginTop:"20px"}}>{content}</div>
                        }
                        return <div
                            className={classNames("virtual-table-cell")}
                            style={{
                                ...style,
                                boxSizing: 'border-box',
                                padding: "20px",
                                borderBottom: `1px solid lightgray`,
                                overflow: 'auto'
                            }}
                        >
                            {content}
                        </div>
                    }
                    else {
                        return <div
                            className={classNames('virtual-table-cell')}
                            style={{
                                ...style,
                                boxSizing: 'border-box',
                                padding: "20px",
                                borderBottom: `1px solid lightgray`,
                                overflow: 'auto'
                            }}
                        >

                            <p style={{marginTop:"50px"}}>{(rawData[rowIndex] as any)[(props?.columns as any)[columnIndex].dataIndex]}</p>
                        </div>
                    }
                }
            }


            </Grid>
        );
    };

    



    return <ResizeObserver
    onResize={({ width }) => {
        setTableWidth(width);
    }}
>
    {props?.rows && props?.fixedCellWidth && <Table
        className="virtual-table"
        style={{ marginTop: "10px" }}
        tableLayout="fixed"
        pagination={false}
        columns={props?.columns}
        dataSource={props?.rows}
        scroll={props?.scroll}
        components={{
            body: renderVirtualList,
        }}
    />}

</ResizeObserver>



}



export default VirtualTableV3;