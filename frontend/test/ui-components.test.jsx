import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NotFound from "../src/app/not-found";
import TopNavBar from "../src/components/topnavbar";
import DashboardCard from "../src/components/dashboardCard";
import CategoriesCard from "../src/components/dashboardCategoryChart";
import { ChartAreaLinear } from "../src/components/dashboardCharts";
import { UserDropdown } from "../src/components/userDropdown";
import { Userlogout } from "@/lib/api/logout";
import { toast } from "../src/components/ui/toast";

const mockSetTheme = jest.fn();
const mockSetSideOpen = jest.fn();
const mockLogout = jest.fn();
const mockReplace = jest.fn();

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: mockSetTheme,
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

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => <div />,
  Tooltip: () => null,
  AreaChart: ({ children }) => <div>{children}</div>,
  Area: () => <div />,
  CartesianGrid: () => null,
  XAxis: () => null,
  defs: () => null,
  linearGradient: () => null,
  stop: () => null,
}));

describe("Remaining UI components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the not-found page with the 404 message and support link", () => {
    render(<NotFound />);

    expect(screen.getByText(/404 - not found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/the page you.*looking for.*doesn't exist/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact support/i })).toHaveAttribute(
      "href",
      "mailto:mohsinnaveed196@gmail.com",
    );
  });

  it("renders top nav controls and toggles the theme", async () => {
    const user = userEvent.setup();

    render(<TopNavBar setSideOpen={mockSetSideOpen} />);

    const sidebarButton = screen.getByRole("button", { name: /toggle sidebar/i });
    const themeButton = screen.getByRole("button", { name: /toggle theme/i });

    expect(sidebarButton).toBeInTheDocument();
    expect(themeButton).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();

    await user.click(themeButton);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("renders a dashboard card with the provided stats", () => {
    const Icon = ({ className }) => <svg className={className} data-testid="icon" />;

    render(
      <DashboardCard
        Icon={Icon}
        text="Notes created"
        stats="128"
        color="from-violet-500 to-sky-500"
      />,
    );

    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("Notes created")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders category data for the notes distribution chart", () => {
    render(
      <CategoriesCard
        data={[
          { category: "Personal", count: 2 },
          { category: "Work", count: 3 },
          { category: "Ideas", count: 1 },
        ]}
      />,
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Distribution of your notes")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Ideas")).toBeInTheDocument();
  });

  it("renders the weekly activity chart with the correct title", () => {
    render(
      <ChartAreaLinear
        data={[
          { date: "Mon", count: 2 },
          { date: "Tue", count: 5 },
          { date: "Wed", count: 4 },
          { date: "Thu", count: 6 },
          { date: "Fri", count: 3 },
          { date: "Sat", count: 7 },
          { date: "Sun", count: 1 },
        ]}
      />,
    );

    expect(screen.getByText("Activity this week")).toBeInTheDocument();
    expect(screen.getByText("Notes updated per day")).toBeInTheDocument();
    expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
  });

  it("logs the user out when the dropdown logout action is clicked", async () => {
    const user = userEvent.setup();
    Userlogout.mockResolvedValue({ success: true });

    render(<UserDropdown />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const logoutItem = await screen.findByText(/log out/i);
    await user.click(logoutItem);

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
