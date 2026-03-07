import API_URL from "../../../../config";

async function activateAccount(emailOrPhone) {
    if(!emailOrPhone || emailOrPhone.trim() === "") {
        return {
            status: false,
            error: "Email or Phone number is required for activation."
        }
    }
    try {
        const res = await fetch(`${API_URL}/auth/activate-account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ emailOrPhone: emailOrPhone }),
        });
        const data = await res.json();
        
        if (!res.ok) {
            return {
                status: false,
                error: data?.error || "Activation failed. Please try again."
            }
        }
        if (!data?.email) return {
            status: false,
            error: "User email not found. Please try again."
        };
        return { status: true, email: data.email };
        
    } catch (error) {
        return {
            status: false,
            error: "An error occurred. Please try again."
        };
    }    
} 

export default activateAccount;