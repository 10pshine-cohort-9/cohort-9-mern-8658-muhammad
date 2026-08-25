import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Sidenavbar from "../src/components/sidenavbar";
import { Userlogout } from "@/lib/api/logout";
import { toast } from "../src/components/ui/toast";

const mockLogout = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/app",
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("@/context/userContext", () => ({
  useUser: () => ({
    logout: mockLogout,
  }),
}));

jest.mock("@/lib/api/logout", () => ({
  Userlogout: jest.fn(),
}));

jest.mock("../src/components/ui/toast", () => ({
  toast: {
    add: jest.fn(),
  },
}));

describe("Sidenavbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the main navigation items and logout action", () => {
    render(<Sidenavbar sideOpen={true} setSideOpen={jest.fn()} />);

    expect(screen.getByText("NoteSphere")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my notes/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /favorites/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("logs the user out when logout is clicked", async () => {
    const user = userEvent.setup();
    Userlogout.mockResolvedValue({ success: true });

    render(<Sidenavbar sideOpen={true} setSideOpen={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(Userlogout).toHaveBeenCalledTimes(1);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Logout",
        description: "Thank for using our platform",
      }),
    );
  });
});
