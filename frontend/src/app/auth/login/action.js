    "use server";

    import { axiosClient } from "@/lib/api/axios";
    import { cookies } from "next/headers";
    import { redirect } from "next/navigation";

    export async function login(formdata) {
    try {
        const email = formdata.get("email");
        const password = formdata.get("password");
        if (!email || !password) {
        return {
            success: false,
            message: "Enter valid email or password",
        };
        }
        const response = await axiosClient.post("/auth/signin", {
        email,
        password,
        });
        const { accessToken, refreshToken } = response.data;
        const cookieStore = await cookies();

        cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
        });

        cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        });
        
        return {
          success: true,
          message: "Login successfull",
        };
    } catch (error) {
        
        return {
        success: false,
        message: error.response?.data?.message || "Invalid email or password",
        };
    }
    }
