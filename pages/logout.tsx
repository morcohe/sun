import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = (props: any) => {

    const router = useRouter();

    const init = async () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("atkn");
        }
        if(typeof window !== 'undefined'){
            router.push("/login");
        }
        
    }

    useEffect(() => {
        init();
    }, [])


    return (<div>
        <h2 style={{textAlign:"center"}}>Logout...</h2>
    </div>);
}

export default Logout;