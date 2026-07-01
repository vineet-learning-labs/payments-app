import { Link } from "react-router-dom";

const SignUpLogic = () => {}

const Signup = () => {
    return (
        <div className="flex justify-center  h-screen w-screen bg-grey-bg">
            <div className="m-auto rounded-xl px-8 pt-6 pb-4 bg-white w-100">
                <div className="flex flex-col align-middle text-center">
                    <h1 className="text-4xl mx-auto font-black"> Sign Up </h1>
                    <h2 className="text-lg text-grey py-2"> Enter your information to create an account</h2>
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
                    <h2 className="my-2"> First Name </h2>
                    <input 
                        type="text"
                        className="w-full border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                        placeholder="John"
                    />
                </div>
                <div className="py-2">
                    <h2 className="my-2"> Last Name </h2>
                    <input 
                        type="text"
                        className="w-full border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                        placeholder="Doe"
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
                        Sign Up
                    </button>
                    <div>
                        <div className="flex justify-around p-4">
                            <h3>Already have an account?</h3>
                            <Link to="/signin" className="underline text-black">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;