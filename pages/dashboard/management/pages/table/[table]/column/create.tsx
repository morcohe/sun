
import { Divider, Button } from 'antd';
import { useRouter } from 'next/router';
import CreateColumnForm from '../../../../../../../components/Pages/CreateColumnForm';
import { auth } from '../../../../../../../src/AccessControl';
import { RiArrowGoBackLine } from 'react-icons/ri';

export async function getServerSideProps({ req }: any) {
    
    const authRes = await auth("Pages", req);
    
    if(Object.keys(authRes).includes("redirect")){
        return authRes;
    }
    
    else if (req.url.includes("table=")) {
        return {
            props: {
                ...authRes.props,
                page: req.url.split("table=")[1]
            }
        }
    } 
    
    else {
        return {
            props: {
                ...authRes.props,
                page: req.url.replace("/dashboard/management/pages/table/", "").split("/")[0]
            }
        }
    }
    
}





const CreateColumn = (props: any) => {

    const router = useRouter();


    const redirectBack = () => {
        router.back();
    }


    return <div style={{ width: "100%" }}>
        <Button onClick={redirectBack} size="large" style={{ display: "flex", gap: "2px", marginTop: "0px", fontSize: "16px", marginLeft: "10px" }} type="link">
            <RiArrowGoBackLine /> <div style={{ marginTop: "-5px" }}>Back</div>
        </Button>
        <Divider style={{backgroundColor:"lightblue", marginTop:"5px", boxShadow:"0 8px 14.72px 1.28px rgba(154,154,204,.5)"}} />
        <div style={{ width: "100%", padding: "25px", display: "flex", gap: "10px", marginTop: "-10px" }}>
            <h2 style={{ marginLeft: "50px", marginTop: "0px" }}>New Column | </h2>
            <h3 style={{marginTop:"7px"}}>
            Create a new column for the table: {props?.page}
        </h3>
        </div>

        <div style={{paddingRight:"5%", paddingLeft:"5%"}}>
            <Divider style={{backgroundColor:"gray", marginTop:"-15px"}} />
        </div>

        <div style={{paddingRight:"5%", paddingLeft:"5%"}}>
        <CreateColumnForm done={redirectBack} table={props.page} />
        </div>
        
        
    </div>
}

export default CreateColumn;