
import { Divider, Button } from 'antd';
import { useRouter } from 'next/router';
import CreatePageForm from '../../../../components/Pages/CreatePageForm';
import { auth } from '../../../../src/AccessControl';
import { RiArrowGoBackLine } from 'react-icons/ri';

export async function getServerSideProps({ req }: any) {
    return await auth("Pages", req);
}

const CreatePage = (props: any) => {

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
            <h2 style={{ marginLeft: "50px", marginTop: "0px" }}>New Table | </h2>
            <h3 style={{marginTop:"7px"}}>
            Create a custom page with data table
        </h3>
        </div>

        <div style={{paddingRight:"5%", paddingLeft:"5%"}}>
            <Divider style={{backgroundColor:"gray", marginTop:"-15px"}} />
        </div>
        
        <CreatePageForm done={redirectBack} />
    </div>
}

export default CreatePage;