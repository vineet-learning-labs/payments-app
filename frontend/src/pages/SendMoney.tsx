import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { StatusCodes } from "#lib/http/index.ts";
import type { User } from "#types/user.ts"
import { delay } from "#utils/delay.ts"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const SendMoney = () => {
        const navigate = useNavigate();
        const location = useLocation();

        const user: User = location.state?.user;

        const[ loading, setLoading ] = useState(false);
        const [ success, setSuccess ] = useState(false);

        const [ errors, setErrors ] = useState<string[]>([]);
        const [ amount, setAmount ] = useState(0);

        useEffect(() => {
            const token = localStorage.getItem("token");

            const tokenCheck=async()=>{
                if (!token) {
                    setErrors(["Invalid login, redirecting to dashboard"]);
                    await delay(1000);
                    navigate("/signin", { replace: true });
                }
            }

            tokenCheck();
        }, [navigate]);

        useEffect(() => {
            if (!user) {
                navigate("/dashboard", { replace: true });
            }
        }, [user, navigate]);

        if (!user){
            return null;
        }

        const handleTransfer=async(amount: number)=>{
            setErrors([]);
            setSuccess(false);
            
            if (amount <= 0){
                setErrors(["Please enter a valid amount."]);
                return;
            }
            
            setLoading(true);
            try{
                const token = localStorage.getItem("token");
                const response = await axios.post(
                    `${backendUrl}/api/v1/account/transfer`,
                    {
                        to: user._id,
                        amount: amount
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.status === StatusCodes.OK){
                    setSuccess(true);
                    await delay(1500);
                    navigate("/dashboard", { replace: true });
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrors(error.response?.data.errors ?? ["Unable to connect to the server"]);
                    if (error.response?.status === 401){
                        setErrors(["Invalid login, redirecting to dashboard"]);
                        localStorage.removeItem("token");
                        await delay(1000);
                        navigate("/signin", { replace: true });
                    }
                } else {
                    console.error(error);
                    setErrors(["An unexpected error occurred."]);
                }
            } finally{
                setLoading(false);
            }
        }

        return (
        <div className="flex justify-center  h-screen w-screen bg-grey-bg">

            <div className="m-auto rounded-xl px-8 pt-6 pb-4 bg-white w-100">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleTransfer(amount);
                    }}
                >
                    <div className="flex flex-col align-middle text-center">
                        <h1 className="text-4xl mx-auto font-black"> Send Money </h1>
                        <h2 className="text-lg text-grey py-2"> Enter the amount you want to send to</h2>
                    </div>
                    {
                        errors.length > 0 ? (
                            <div className="text-red-600 text-xs text-center"> {
                                errors.map((error, index) => (
                                    <div key={index}>{error}</div>
                                ))
                            }
                            </div>) : null
                    }
                    {
                        success ? (
                            <div className="text-green-600 text-s text-center">
                                Transfer Successful! <br/>
                                Redirecting to Dashboard
                            </div>
                        ) : null
                    }
                    <div className="flex flex-col justify-center">
                        <div className="flex pt-4 items-center">
                            <div className="flex flex-col select-none w-10 h-10 rounded-full text-white bg-green-500 items-center justify-center font-normal">
                                {user?.firstName.charAt(0).toUpperCase()}
                            </div>
                            <div className="px-2 flex flex-col justify-center font-bold text-2xl">
                                {user.firstName} {user.lastName}
                                <div className="text-sm">
                                    {user.username}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="py-2">
                        <h2 className="my-2"> Amount (in $) </h2>
                        <input 
                            type="number"
                            className="w-full border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e)=>setAmount(Number(e.target.value))}
                            disabled={loading || success}
                            required
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`text-white w-full p-2 py-3 rounded-xl font-medium
                                    ${loading
                                        ? "bg-black cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600"         
                                    }
                                `}
                            disabled={loading || success}
                        >
                            {loading ? "In progress..." : "Initiate Transfer"}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default SendMoney;