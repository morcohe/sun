import mFetcher from '../Fetch/Fetcher';
import { managementRoutes } from '../Router';
import GRepository from '../../db/GenericCRUD.service';
import Role from '../../db/Role/Role.model';


type TRole = "Seeking" | "Marketing" | "Sales" | "Admin" | "SuperAdmin";


export const auth = async (page: string, req: any) => {
    try {
        mFetcher.setAuthorization(req.cookies["atkn"]);
        const resp = await mFetcher.fetch({ url: `http://e-utopia.ai:4001/api/auth?page=${page}`, method: "GET", isOutboundRequest: false });
        if(page === 'Login' && resp.data.success === true){
            return { redirect: { destination: '/dashboard', permanent: false, }, }
        }
        else if (resp.data.success === true) {
            return {
                props: {
                    user: resp.data.data
                }
            };
        }
        else if (page !== "Login") {
            return { redirect: { destination: '/login', permanent: false, }, }
        }
        return {
            props: {}
        };
    } catch (error) {
        if (page !== "Login") {
            return { redirect: { destination: '/login', permanent: false, }, }
        }
        return {
            props: {}
        };
    }
}




export const ac = async (page: string, role: TRole) => {

    if (Object.keys(managementRoutes).includes(page)) {
        return managementRoutes[page].allowed.includes(role);
    }
    else {
        const roleRepo = new GRepository(Role, "Role");
        const allowedPages: any = await roleRepo.getAll({ name: role });
        console.log("ALLOWED PAGES: ", allowedPages)
        for await (const role of allowedPages) {
            if (role["page"].toLowerCase() === page.toLowerCase()) {
                return true;
            }
        }

        return false;
    }
}