import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Notes from "../src/components/notes";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Notes component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a note card and opens it when clicked", async () => {
    const user = userEvent.setup();

    render(
      <Notes
        id={12}
        title="My Project"
        category="Work"
        content="<p>Draft note content</p>"
        tags={["planning", "ideas"]}
        createdAt={new Date().toISOString()}
        favorite={false}
        pinned={true}
        archive={false}
        onNoteAction={jest.fn()}
      />,
    );

    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("#planning")).toBeInTheDocument();

    await user.click(
      screen.getByRole("link", { name: /open note: my project/i }),
    );
    expect(mockPush).toHaveBeenCalledWith("/app/notes/12");
  });

  it("calls onNoteAction when the favorite button is clicked", async () => {
    const user = userEvent.setup();
    const onNoteAction = jest.fn();

    render(
      <Notes
        id={7}
        title="Favorite Note"
        category="Personal"
        content="<p>Content</p>"
        tags={[]}
        createdAt={new Date().toISOString()}
        favorite={false}
        pinned={false}
        archive={false}
        onNoteAction={onNoteAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: /toggle favorite/i }));
    expect(onNoteAction).toHaveBeenCalledWith(7, "favorite");
  });
});
