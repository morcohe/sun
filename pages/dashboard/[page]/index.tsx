import GeneralPage from '../../../components/GeneralPage';
import { auth } from '../../../src/AccessControl';


export async function getServerSideProps({ req }: any) {



    if (req.url.includes("page=")) {
        const authRes = await auth(req.url.split("page=")[1], req);

        if (Object.keys(authRes).includes("redirect")) {
            return authRes;
        }
        return {
            props: {
                ...authRes.props,
                page: req.url.split("page=")[1]
            }
        }
    }

    else {
        const authRes = await auth(req.url.replace("/dashboard/", ""), req);

        if (Object.keys(authRes).includes("redirect")) {
            return authRes;
        }
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