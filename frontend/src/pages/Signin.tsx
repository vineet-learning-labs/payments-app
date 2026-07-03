import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { StatusCodes } from "#lib/http/index.ts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface SignInInput {
    username: string,
    password: string
}

const Signin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    const[ loading, setLoading ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const [ errors, setErrors ] = useState<string[]>([]);
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    // const delay = (ms: number) =>
    // new Promise(resolve => setTimeout(resolve, ms));

    const handleSignin = async (user: SignInInput) => {
        setErrors([]);
        setSuccess(false);
        setLoading(true);
        try{
            const response = await axios.post(
                `${backendUrl}/api/v1/user/signin`,
                user
            );
            if (response.status === StatusCodes.OK){
                setSuccess(true);
                const token: string = response.data.token;
                localStorage.setItem('token', token);

                // await delay(2000);
                
                navigate('/dashboard');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrors(error.response?.data.errors ?? ["Unable to connect to the server"]);
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
                    handleSignin({
                        username,
                        password
                    });
                }}>
                    <div className="flex flex-col align-middle text-center">
                        <h1 className="text-4xl mx-auto font-black"> Sign In </h1>
                        <h2 className="text-lg text-grey py-2"> Enter your credentials to access your account</h2>
                    </div>
                    {
                        errors.length > 0 ? (
                            <div className="text-red-600 text-xs"> {
                                errors.map((error, index) => (
                                    <div key={index}>{error}</div>
                                ))
                            }
                            </div>) : null
                    }
                    {
                        success ? (
                            <div className="text-green-600 text-xs">
                                Signin successful, redirecting to dashboard
                            </div>
                        ) : null
                    }
                    <div className="py-2">
                        <h2 className="my-2"> Username </h2>
                        <input 
                            type="text"
                            className="w-full border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                            placeholder="johndoe01"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value.toLowerCase())}
                            required
                        />
                    </div>
                    <div className="py-2">
                        <h2 className="my-2"> Password </h2>
                        <input
                            type="password"
                            className="w-full border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                            placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`text-white w-full p-2 py-3 rounded-xl font-medium
                                    ${loading
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-black hover:bg-gray-800"         
                                    }
                                `}
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                        <div>
                            <div className="flex justify-around p-4">
                                <h3>Don't have an account?</h3>
                                <Link to="/signup" className="underline text-black">Sign Up</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Signin;