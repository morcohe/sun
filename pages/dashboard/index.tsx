//import { auth } from '../../src/AccessControl';


export async function getServerSideProps({ req }: any) {
    return { redirect: { destination: '/dashboard', permanent: false, }, }
    //return await auth("Main", req);
}


const HomePage = (props: any) => {


    return <div>
        
    </div>
}

export default HomePage;