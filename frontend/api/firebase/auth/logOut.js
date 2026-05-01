import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

export async function signOutFromFireBase() {
    try {
         await signOut(auth)
    } catch (error) {
        console.error("Unable to log out: ", error)
    }
}