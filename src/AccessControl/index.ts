import mFetcher from '../Fetch/Fetcher';
import { managementRoutes } from '../Router';
import GRepository from '../../db/GenericCRUD.service';
import Role from '../../db/Role/Role.model';
import { sign, extract } from '../../src/jwt';

type TRole = "Seeking" | "Marketing" | "Sales" | "Admin" | "SuperAdmin";


export const auth = async (page: string, req: any) => {
    try {

        mFetcher.setAuthorization(req.cookies["atkn"]?.replaceAll("Bearer ", ""));
        let accessToken: string;

        try {
            accessToken = req.cookies["atkn"]?.replaceAll("Bearer ", "");
            if (accessToken.includes("undefined")) {
                throw new Error("Token Expired");
            }
        } catch (error) {
            throw new Error("Unauthorized");
        }

        if (accessToken && typeof accessToken !== 'undefined') {
            const extracted = extract(accessToken);
            if (extracted.expired === true) {
                throw new Error("Token Expired");
            } else {
                const user = {
                    id: extracted?.data?.id,
                    name: extracted?.data?.name,
                    email: extracted?.data?.email,
                    role: extracted?.data?.role,
                    lastActivate: extracted?.data?.lastActive ? extracted?.data?.lastActive : ""
                }
                if (page === 'Login') {
                    return { redirect: { destination: '/dashboard', permanent: false, }, }
                } else {
                    return {
                        props: { user: user }
                    };
                }
            }
        }
        throw new Error("failed");
        
    } catch (error) {
        if (page !== "Login") {
            return { redirect: { destination: '/login', permanent: false, }, }
        } else {
            return {
                props: {}
            };
        }
    }
}




export const ac = async (page: string, role: TRole) => {

    if (Object.keys(managementRoutes).includes(page)) {
        return managementRoutes[page].allowed.includes(role);
    }
    else {
        const roleRepo = new GRepository(Role, "Role");
        const allowedPages: any = await roleRepo.getAll({ name: role });
        for await (const role of allowedPages) {
            if (role["page"].toLowerCase() === page.toLowerCase()) {
                return true;
            }
        }

        return false;
    }
}