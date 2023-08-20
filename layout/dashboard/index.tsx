import Head from './Head';
import SideNavbar from './SideNavbar';
import Page from './Page';
import Breadcrumbs from './Breadcrumbs';
import { useState } from 'react';
import { useEffect } from 'react';

const DashboardLayout = (props: any) => {

    const [isSideNavbar, setSideNavbar] = useState(false);
    const [user, setUser] = useState();

    const sideNavbarToggler = () => {
        setSideNavbar(!isSideNavbar);
    }

    useEffect(()=>{
        if(typeof window !== 'undefined'){
            const lsUser = localStorage.getItem("user");
            if(typeof lsUser === 'string'){
                setUser(JSON.parse(lsUser));
            }
          }
    },[]);

    return <div dir="ltr" style={{ display: "flex", width: "100%", position: "fixed", flexDirection:"row-reverse" }}>
        
        <div style={{ width: "100%", display:"flex", flexDirection:"column", gap:"0px" }}>
            <Head user={user} sideNavbarToggler={sideNavbarToggler} isSideNavbar={isSideNavbar} />
            {/* <Breadcrumbs /> */}
            <Page>
                
                {props.children}
            </Page>
        </div>
        {user && <SideNavbar isSideNavbar={isSideNavbar} user={user} />}
    </div>
}


export default DashboardLayout;