import { Link } from "react-router-dom";

const SignInLogic = () => {}

const Signin = () => {
    return (
        <div className="flex justify-center  h-screen w-screen bg-grey-bg">
            <div className="m-auto rounded-xl px-8 pt-6 pb-4 bg-white w-100">
                <div className="flex flex-col align-middle text-center">
                    <h1 className="text-4xl mx-auto font-black"> Sign In </h1>
                        <h2 className="text-lg text-grey py-2"> Enter your credentials to access your account</h2>
                </div>
                <div className="py-2">
                    <h2 className="my-2"> Username </h2>
                    <input 
                        type="text"
                        className="w-full border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                        placeholder="johndoe01"
                    />
                </div>
                <div className="py-2">
                    <h2 className="my-2"> Password </h2>
                    <input 
                        type="text"
                        className="w-full border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                        placeholder="Password"
                    />
                </div>
                <div className="pt-4">
                    <button className="bg-black text-white w-full p-2 py-3 rounded-xl font-medium
                                        hover:bg-gray-800">
                        Sign In
                    </button>
                    <div className="">
                        <div className="flex justify-around p-4">
                            <h3>Don't have an account?</h3>
                            <Link to="/signup" className="underline text-black">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin;