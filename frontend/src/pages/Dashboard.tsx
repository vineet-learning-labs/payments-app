const Dashboard = () => {
    return (
        <div>
            <div className="flex justify-between align-middle p-4 border-b-1 border-b-gray-300">
                <h1 className="font-extrabold text-2xl">Payments App</h1>
                <div className="flex">
                    <div className="flex flex-col justify-center px-2">
                        <h1>Hello, User</h1>
                    </div>
                    <div className="select-none w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-normal">
                        {"User".charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
            <div className="p-4 text-xl font-bold">
                <h1 className="py-2">Your Balance: $5000</h1>
                <h1 className="py-2">Users</h1>
                <input
                    className="w-full text-base font-normal border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                    type="text"
                    placeholder="Search users..."
                />

                <div className="pt-6 flex justify-between">
                    <div className="flex flex-col justify-center">
                        <div className="flex">
                            <div className="select-none w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-normal">
                                {"User".charAt(0).toUpperCase()}
                            </div>
                            <div className="px-2 flex flex-col justify-center">
                                User1
                            </div>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-medium">
                        Send Money
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Dashboard;