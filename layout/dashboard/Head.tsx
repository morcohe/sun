import { HiMenuAlt2 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { MdOutlineDarkMode, MdLanguage } from 'react-icons/md';
import { BiUserCircle } from 'react-icons/bi';
import { AiOutlinePoweroff } from 'react-icons/ai';
import { Button, Avatar, Divider } from 'antd';
import { useRouter } from 'next/router';
import mFetcher from '../../src/Fetch/Fetcher';

const Head = (props: any) => {


    const router = useRouter();

    const handleLogout = async () => {
        localStorage.clear();
        try {
            await mFetcher.fetch({ url: "/api/auth", method: "DELETE" });
            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    }



    return (<div className="dashboard-head">

        <div className="menu-burger" >
            <Button onClick={props?.sideNavbarToggler} style={{ padding: "10px", height: "40px" }}>
                {
                    props?.isSideNavbar ? <AiOutlineClose style={{ fontSize: "20px" }} /> : <HiMenuAlt2 style={{ fontSize: "20px" }} />
                }
            </Button>
        </div>



        <div style={{ width: "100%", display: "flex", paddingRight: "0px", justifyContent: "right" }}>

            {/* <div style={{ textAlign: "right", width: "5%", paddingRight: "0px", paddingTop: "25px" }}>
                <MdOutlineDarkMode style={{fontSize:"22px"}} />
            </div>

            <div style={{ textAlign: "right", width: "5%", paddingRight: "30px", paddingTop: "25px" }}>
                <MdLanguage style={{fontSize:"22px"}} />
            </div> */}

            <div style={{ width: "30%", paddingTop: "15px", display: "flex", gap: "10px", justifyContent: "right", backgroundColor: "#fff", paddingRight: "60px", paddingLeft: "0px" }}>
                {/* <Avatar size="large" src={<img src={"https://nextjs.spruko.com/nowa/preview/assets/img/faces/2.jpg"} alt="avatar" />} /> */}

                <div style={{ marginRight: "10px", fontWeight: "400", marginTop: "7px", fontSize: "16px", color: "gray", display: "flex", gap: "5px" }}>
                    <BiUserCircle style={{ fontSize: "19px", marginTop: "4px", color: "#383853" }} />
                    <div>
                        <small style={{ height: "12px", color: "#383853", marginTop: "40px" }}>Welcome, {props?.user?.name}</small>
                        
                    </div>
                </div>

                <div style={{ marginLeft: "0px", marginRight: "0px" }}>
                    <Divider type="vertical" style={{ marginTop: "10px", height: "20px", backgroundColor: "rgb(214, 214, 218)" }} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <Button style={{ marginTop: "10px", marginLeft: "0px", backgroundColor: "#fff", display:"flex", flexDirection:"row", gap:"10px" }} type="link" size="small" onClick={handleLogout} >
                        <AiOutlinePoweroff style={{ marginLeft: "4px", fontSize: "16px", color: "#383853", marginTop: "2px" }} />
                        <small style={{ color: "#383853", marginLeft: "-5px", marginTop: "1px" }}>Logout</small>
                    </Button>

                </div>







            </div>


        </div>





    </div>)

}


export default Head;