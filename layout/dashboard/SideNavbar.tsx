// import { AiOutlineCloudServer } from 'react-icons/ai';
// import { BsCloudCheck } from 'react-icons/bs';
import { BiHomeSmile } from 'react-icons/bi';
// import { TbMessages } from 'react-icons/tb';
// import { SiProbot } from 'react-icons/si';
// import { FaMedapps } from 'react-icons/fa';
// import { FcServices } from 'react-icons/fc';
// import { MdOutlineContactSupport } from 'react-icons/md';

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { managementRoutes } from '../../src/Router';
import { useEffect } from 'react';
import mFetcher from '../../src/Fetch/Fetcher';


type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  theme?: 'light' | 'dark' | null,
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    theme,
    type
  } as MenuItem;
}


const icons: any = {
  "home": <BiHomeSmile style={{ fontSize: "20px" }} />
}


const SideNavbar = (props: any) => {


  const [current, setCurrent] = useState('1');
  const [items, setItems] = useState<MenuItem[]>([]);
  const router = useRouter();


  const initItems = async () => {

    let tmpRoutes = [];
    let tmpManagement = [];

    try {
      const fRes = await mFetcher.fetch({ 'url': '/api/role', method: 'GET' });
      for await (const item of fRes?.data?.data) {
        if(item?.columns?.length > 0){
          tmpRoutes.push(getItem(item.page, `/dashboard/${item.page.toLowerCase()}`, icons['home']));
        }
        
      }
    } catch (error) {
      console.error(error)
    }





    // for await (const item of Object.keys(routes)){
    //   if(routes[item].allowed.includes(props?.user?.role)){
    //     tmpRoutes.push(getItem(routes[item].title, routes[item].path, icons[routes[item].icon]))
    //   }
    // }

    for await (const item of Object.keys(managementRoutes)) {
      if (managementRoutes[item].allowed.includes(props?.user?.role)) {
        tmpManagement.push(getItem(managementRoutes[item].title, managementRoutes[item].path, icons[managementRoutes[item].icon]))
      }
    }

    if (props?.user?.role === "SuperAdmin") {
      tmpRoutes.push(getItem('Management', '/dashboard/management', null, tmpManagement, null, 'group'));
    }

    setItems(tmpRoutes);

  }


  const onClick: MenuProps['onClick'] = (e: any) => {
    //console.log("onclick: ", e)
    setCurrent(e.key);
    if(typeof window !== 'undefined'){
      router.push(e.key);
    }
    
  };



  useEffect(() => {
    initItems();
  }, []);



  return (<div className={`dashboard-sidenavbar${props.isSideNavbar ? "" : " hidden"}`}>

    <div style={{ width: "100%", height: "70px", borderBottom: "1px solid #ededf5", textAlign: "center", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "0px" }}>
      <img src="/images/sun-real-estate-logo.png" style={{ width: "60%", marginLeft:"17%" }} />
    </div>

    <Menu
      onClick={onClick}
      style={{ width: 200, marginTop: "50%" }}
      selectedKeys={[current]}
      mode="vertical"
      theme="light"
      items={items}
      getPopupContainer={function test(node) {
        return node.parentNode as HTMLElement;
      }}
    />


  </div>)

}


export default SideNavbar;