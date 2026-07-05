import { StatusCodes } from "#lib/http/index.ts";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "#types/user.ts"
import { delay } from "#utils/delay.ts"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
    const navigate = useNavigate();

    const [ selfLoading, setSelfLoading ] = useState(false);
    const [ usersLoading, setUsersLoading ] = useState(false);
    const [ errors, setErrors ] = useState<string[]>([]);

    const [ query, setQuery ] = useState("");
    const [ debouncedQuery, setDebouncedQuery ] = useState("");

    const [ self, setSelf ] = useState<User>();
    const [ matchedUsers, setMatchedUsers ] = useState<User[]>([]);

    const fetchSelf=async()=>{
        setSelfLoading(true);
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${backendUrl}/api/v1/user/me`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === StatusCodes.OK){
                setSelf(response.data.user);
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
            setSelfLoading(false);
        }
    }

    const fetchUsers=async()=>{
        setUsersLoading(true);
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${backendUrl}/api/v1/user/bulk?filter=${debouncedQuery}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === StatusCodes.OK){
                setMatchedUsers(response.data.users);
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
            setUsersLoading(false);
        }
    }

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
        fetchSelf();

    }, [navigate]);

    useEffect(()=>{                         // anytime debouncedQuery changes => fetchusers with that query
        fetchUsers();
    }, [debouncedQuery]);

    useEffect(()=>{                         // anytime query changes => set debouncedQuery after 500ms
        const id = setTimeout(()=>{
            setDebouncedQuery(query);
        }, 500);

        return ()=>{
            clearTimeout(id);
        }
    }, [query])

    return (
        <div>
            <div className="flex justify-between align-middle px-6 py-2 border-b-1 border-b-gray-300">
                <div className="flex flex-col justify-center">
                    <h1 className="font-extrabold text-2xl">Payments App</h1>
                </div>
                <div className="flex">
                    <div className="flex flex-col justify-center px-2">
                        {
                            selfLoading ? 
                                <div>
                                    ...
                                </div>
                            :
                                <div className="flex justify-center">
                                    <div className="flex flex-col justify-center px-2">
                                        Hello, {self?.firstName}
                                    </div>
                                    <div className="select-none w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-normal">
                                        {self?.firstName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
            {
                errors.length > 0 ? (
                    <div className="flex justify-center pt-2 text-red-600 text-xs"> {
                        errors.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))
                    }
                    </div>) : null
            }
            <div className="p-4 text-xl font-bold">
                <h1 className="flex py-2">
                    Your Balance:
                    <div className="px-5">
                        {
                            selfLoading
                                ? "Loading..."
                                : self
                                    ? `$${self.balance}`
                                    : "$0"
                        }
                    </div>
                </h1>
                <h1 className="py-2">Users</h1>
                <input
                    className="w-full text-base font-normal border-gray-300 pl-4 rounded-lg border px-4 py-3 outline-none"
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e)=>setQuery(e.target.value.toLowerCase())}
                />
                {
                    usersLoading ? <div className="pt-6 flex justify-center">
                        Loading...
                    </div> : (
                        matchedUsers.length > 0 ? matchedUsers.map((user: User)=>{
                            return (
                                <div key={user._id} className="pt-6 flex justify-between">
                                    <div className="flex flex-col justify-center">
                                        <div className="flex">
                                            <div className="select-none w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-normal">
                                                {user.firstName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="px-2 flex flex-col justify-center">
                                                {user.firstName} {user.lastName} - {user.username}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                      className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-medium"
                                      onClick={() => navigate("/send", {
                                        state: {
                                            user
                                        }
                                      })}
                                    >
                                        Send Money
                                    </button>
                                </div>
                            )
                        }) : <div className="pt-6 flex justify-center">
                            No matches found!
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Dashboard;