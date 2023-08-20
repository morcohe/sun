
import { FaRegUserCircle } from 'react-icons/fa';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';

const Navbar = () => {


    const [navbar, setNavbar] = useState(false);


    const changeBackground = () => {
        if (window.scrollY >= 65) {
            setNavbar(true)
        } else {
            setNavbar(false)
        }
    }


    useEffect(() => {
        window.addEventListener("scroll", changeBackground);
        return () => window.addEventListener("scroll", changeBackground);
    }, [])


    return (<div className="top-navbar">
        <div style={{ position: "fixed", top: "0", left: "0", zIndex: "0" }} className={navbar ? 'top-navbar navbar-bg' : 'top-navbar navbar-bg-transparent'}></div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <h2 style={{ color: "#fff", zIndex: "1" }}>TripAi</h2>
            <Button size="large" style={{ backgroundColor:"transparent", borderRadius:"20px", display: "flex", gap: "5px", marginTop: "2px" }}>
                <p style={{ fontSize: "14px", color: "#fff", marginTop:".5px" }}>כניסה</p>
                <FaRegUserCircle style={{ fontSize: "16px", color: "#fff", marginTop: "4px" }} />
            </Button>
        </div>

    </div>)

}


export default Navbar;