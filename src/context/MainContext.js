"use client"; // Tells Next.js this is a client-side component

import { createContext, useContext, useState, useEffect } from "react";
import Loader from "@/components/reusable/Loader";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// ✅ Creating the context with default values
const mainContext = createContext({
    user: {},                // Default user object
    loading: true,           // Initial loading state
    fetchUserProfile() { },   // Default empty function (won't actually be called, just for type reference)
    LogoutHandler() { }
});

// ✅ Custom hook to access context in other components
export const useMainContext = () => useContext(mainContext);

// ✅ MainContextProvider wraps the entire app and provides user state
export const MainContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);      // Stores logged-in user's data
    const [loading, setLoading] = useState(true); // Controls loading screen visibility
    const router = useRouter()

    // ✅ Fetch user profile from backend if token exists
    const fetchUserProfile = async () => {
        const token = localStorage.getItem("token");

        // If token is not found, skip fetching and stop loading
        if (!token) {
           
            setLoading(false);
            return;
        }

        try {
            // Make authorized request to fetch profile
            const response = await axiosClient.get("auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Store user data in state
            setUser(response.data);

        } catch (error) {
            // Handle error gracefully with toast notification
            console.error("Error fetching profile:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false); // Hide loader after request completes
        }
    };

    // ✅ Run this effect once when component mounts to fetch user data
    useEffect(() => {
        fetchUserProfile();
    }, []);

    // ✅ While loading, show a full-screen loader
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center w-full">
                <Loader />
            </div>
        );
    }

    //Logout function 
    const LogoutHandler = () => {
        localStorage.removeItem("token");//remove the token from the localStorage
        setUser(null)
        toast.success("Logged out successfully");
        router.push('/auth/login')
    }

    // ✅ Provide user and loading state to all child components
    return (
        <mainContext.Provider value={{ user, loading, fetchUserProfile, LogoutHandler }}>
            {children}
        </mainContext.Provider>
    );
};
