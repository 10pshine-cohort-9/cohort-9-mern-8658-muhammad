"use server";
import { axiosClient } from "@/lib/api/axios";

export async function register(formdata) {
  try {
    const name = formdata.get("name");
    const email = formdata.get("email");
    const password = formdata.get("password");
    const confirmPassword = formdata.get("confirmPassword");

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Password doesn't match",
      };
    }

    const res = await axiosClient.post("/auth/signup", {
      name,
      email,
      password,
    });

    return {
      success: true,
      message: "Register successfull",
    };
  } catch (error) {
    return {
      success: "false",
      message: error.response?.data.message || "Failed to Register",
    };
  }
}
