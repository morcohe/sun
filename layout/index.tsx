
import { useRouter } from 'next/router';
//import Navbar from './navbar';
import DashboardLayout from '../layout/dashboard';


const Layout = (props: any) => {

    const router = useRouter();



    if (router.pathname.includes("dashboard")) {
        return <DashboardLayout>{props.children}</DashboardLayout>
    } else {
        if(!router.pathname.includes("dashboard")){
            return <div className="bg-dark" style={{ width: "100%" }}>
            {/* <Navbar /> */}
            <div>
                {props.children}
            </div>
        </div>
        } else {
            return null;
        }
    }



}

export default Layout