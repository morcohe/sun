// import { useState } from "react";
// import mFetcher from "../src/Fetch/Fetcher";



// const MAGIC_LINK_API = "/api/user/login";



// const useTableV3 = () => {


//     const [isSession, setSession] = useState<boolean>(false);




//     /**
//      * @description trying to send a magic link to the supplied email (fires in login page)
//      * @param emailAddress 
//      * @returns a relevant response message
//      */
//     const sendMagicLink = async (emailAddress: string) => {
//         try {
//             const res = await mFetcher.fetch({ url: `${MAGIC_LINK_API}/${emailAddress}`, method: 'POST', name: "Send Magic Link" });
//             return res.data.message;
//         } catch (error) {
//             try {
//                 return error.data.message;
//             } catch (error) {
//                 return "Oops... Something is went wrong. Probably its our fault. Please try again or contact us."
//             }

//         }
//     }




//     const confirmMagicLink = async (token: string) => {
//         try {
//             const res = await mFetcher.fetch({ url: `${MAGIC_LINK_API}?token=${token}`, method: 'GET', name: "Confirm Magic Link" });
//             if (typeof window !== 'undefined') {
//                 //console.log(res.data.data);
//                 localStorage.setItem("accessToken", res.data.data.accessToken);
//                 setSession(true);
//             }
//             return res.data ? true : false;
//         } catch (error) {
//             return false;
//         }
//     }






//     return {
//         isSession,
//         setSession,
//         sendMagicLink,
//         confirmMagicLink
//     }

// }



// export default useTableV3;