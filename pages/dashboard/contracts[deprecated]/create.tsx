
import { Divider, Button } from 'antd';
import { useRouter } from 'next/router';
import CreateContractForm from '../../../components/Contracts/CreateContractForm';
import { auth } from '../../../src/AccessControl';
import { RiArrowGoBackLine } from 'react-icons/ri';


export async function getServerSideProps({ req }: any) {
    return await auth("Contracts", req);
}

const CreateProperty = (props: any) => {

    const router = useRouter();


    const redirectToContracts = () => {
        router.back();
    }


    return <div style={{ width: "100%" }}>
        <Button onClick={redirectToContracts} size="large" style={{ display: "flex", gap: "2px", marginTop: "0px", fontSize: "16px", marginLeft: "10px" }} type="link">
            <RiArrowGoBackLine /> <div style={{ marginTop: "-5px" }}>Back to contracts</div>
        </Button>
        <Divider style={{backgroundColor:"gray", marginTop:"5px"}} />
        <div style={{ width: "100%", padding: "25px", display: "flex", justifyContent: "space-between", marginTop: "-20px" }}>
            <h2 style={{ marginLeft: "50px", marginTop: "0px" }}>Create New Contract</h2>
        </div>

        <CreateContractForm />
    </div>
}

export default CreateProperty;