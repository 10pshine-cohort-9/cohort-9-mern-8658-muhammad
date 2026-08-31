import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NotesPage from "../src/app/app/notes/page";
import { getNotes } from "../src/app/app/notes/action";

jest.mock("../src/app/app/notes/action", () => ({
  getNotes: jest.fn(),
  archievedNote: jest.fn(),
  deleteNote: jest.fn(),
  favoriteNote: jest.fn(),
  pinnedNote: jest.fn(),
}));

jest.mock("@/components/notes", () => ({
  __esModule: true,
  default: ({ title, category, tags = [] }) => (
    <article>
      <h2>{title}</h2>
      <p>{category}</p>
      <p>{tags.join(" ")}</p>
    </article>
  ),
}));

jest.mock("@/components/EmptyNoteAction", () => () => (
  <div>No notes found</div>
));
jest.mock("@/components/ui/toast", () => ({
  toast: {
    add: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("Notes page search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getNotes.mockResolvedValue({
      success: true,
      notes: [
        {
          id: 1,
          title: "Project planning",
          category: "Work",
          content: "<p>Roadmap details</p>",
          tags: ["roadmap"],
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Book notes",
          category: "Learning",
          content: "<p>Useful quotes</p>",
          tags: ["reading"],
          createdAt: new Date().toISOString(),
        },
      ],
    });
  });

  it("filters notes by search text and updates the count", async () => {
    const user = userEvent.setup();

    render(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText("Project planning")).toBeInTheDocument();
    });

    const searchInput = screen.getByRole("searchbox", {
      name: /search notes/i,
    });
    await user.type(searchInput, "roadmap");

    expect(screen.getByText("Project planning")).toBeInTheDocument();
    expect(screen.queryByText("Book notes")).not.toBeInTheDocument();
    expect(screen.getByText("1 note")).toBeInTheDocument();
  });
});
