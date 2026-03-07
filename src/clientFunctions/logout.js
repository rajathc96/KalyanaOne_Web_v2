import { signOut } from "firebase/auth";
import API_URL from "../../config";
import { clientAuth } from "../../firebase";

const handleLogout = async () => {
    try {
        const token = await clientAuth?.currentUser?.getIdToken();
        localStorage.clear();
        // await updateOnlineStatus(false);
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        });
        await signOut(clientAuth);
    } catch (error) { }
}

export default handleLogout;