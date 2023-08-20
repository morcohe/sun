import GeneralPage from '../../../components/GeneralPage';
import { auth } from '../../../src/AccessControl';


export async function getServerSideProps({ req }: any) {
    
    const authRes = await auth("Pages", req);
    
    if(Object.keys(authRes).includes("redirect")){
        return authRes;
    }
    
    else if (req.url.includes("page=")) {
        return {
            props: {
                ...authRes.props,
                page: req.url.split("page=")[1]
            }
        }
    } 
    
    else {
        return {
            props: {
                ...authRes.props,
                page: req.url.replace("/dashboard/", "")
            }
        }
    }
    
}




const Page = (props: any) => {

    return <GeneralPage page={props?.page} key={props?.page} />
        
}

export default Page;