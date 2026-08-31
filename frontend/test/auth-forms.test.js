import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginForm } from "../src/components/login-form";
import { SignupForm } from "../src/components/signup-form";
import { login } from "@/app/auth/login/action";
import { register } from "@/app/auth/signup/action";
import { toast } from "../src/components/ui/toast";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

jest.mock("@/app/auth/login/action", () => ({
  login: jest.fn(),
}));

jest.mock("@/app/auth/signup/action", () => ({
  register: jest.fn(),
}));

jest.mock("../src/components/ui/toast", () => ({
  toast: {
    add: jest.fn(),
  },
}));

describe("Authentication forms", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form fields", () => {
    render(<LoginForm />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("submits the login form successfully and redirects to the app", async () => {
    login.mockResolvedValue({ success: true, message: "Login successful" });
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
    });

    const formData = login.mock.calls[0][0];
    expect(formData.get("email")).toBe("test@example.com");
    expect(formData.get("password")).toBe("Password123");
    expect(mockReplace).toHaveBeenCalledWith("/app");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        description: "Login successfully",
      }),
    );
  });

  it("shows an error toast when login fails", async () => {
    login.mockResolvedValue({
      success: false,
      message: "Invalid email or password",
    });
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "badPassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          title: "Failed to Login",
          description: "Invalid email or password",
        }),
      );
    });
  });

  it("renders the signup form fields", () => {
    render(<SignupForm />);

    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("submits the signup form successfully and redirects to login", async () => {
    register.mockResolvedValue({
      success: true,
      message: "Register successfull",
    });
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledTimes(1);
    });

    const formData = register.mock.calls[0][0];
    expect(formData.get("name")).toBe("Jane Doe");
    expect(formData.get("email")).toBe("jane@example.com");
    expect(formData.get("password")).toBe("Password123");
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        title: "Successfully register",
      }),
    );
  });

  it("shows an error toast when signup fails", async () => {
    register.mockResolvedValue({
      success: false,
      message: "Password doesn't match",
    });
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123");
    await user.type(screen.getByLabelText(/confirm password/i), "Mismatch123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          title: "Failed to create",
          description: "Password doesn't match",
        }),
      );
    });
  });
});
