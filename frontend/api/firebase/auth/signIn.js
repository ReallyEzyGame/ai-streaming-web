// Sign in method flow
/**
 * FIREBASE AUTHENTICATION
 * UI -- click = send request through firebase api --> firebase 
 * */
import {
    createUserWithEmailAndPassword,
    getAdditionalUserInfo,
    getRedirectResult,
    signInWithEmailAndPassword,
    signInWithRedirect,
    signInWithPopup
} from 'firebase/auth'
import { auth, googleProvider } from '../../../firebase/firebase'
/**
 * Note: Sig n In with Google can both handling sign in and sign up
 */
export async function signInWithGoogle() {
    try {
        const userCred = await signInWithPopup(auth, googleProvider)
        return userCred
    }
    catch (error) {
        console.error(error)
    }
}
export async function signIn(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password)
    }
    catch (error) {
        console.error(error)
    }
}
export async function signUp(email, password) {
    try {
        const newAccount = await createUserWithEmailAndPassword(auth, email, password)
        const result = await signInWithEmailAndPassword(auth, email, password)
    }
    catch (error) {
        console.error(error)
    }
}


export async function handleRedirectResult() {
    try {
        const result = await getRedirectResult(auth)
        if (result) {
            const user = result.user
            // save to firestore if user sign in for the first time
            return user
        }
    } catch (error) {
        console.error('Error while redirect: ', error)
    }
}