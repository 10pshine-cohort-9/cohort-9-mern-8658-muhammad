import { render, screen } from "@testing-library/react";

import Home from "../src/app/page";

describe("Home page", () => {
  it("renders the landing page hero and feature section", () => {
    render(<Home />);

    expect(screen.getByText(/your ideas/i)).toBeInTheDocument();
    expect(screen.getByText(/beautifully organized/i)).toBeInTheDocument();
    expect(screen.getAllByText(/rich text editor/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/instant search/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/favorites & pinning/i).length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByRole("heading", {
        name: /everything you need. nothing you don't./i,
      }),
    ).toBeInTheDocument();
  });

  it("renders important navigation links", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: /features/i })).toHaveAttribute(
      "href",
      "#features",
    );
    expect(
      screen.getAllByRole("link", { name: /about/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /help/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /get started/i }).length,
    ).toBeGreaterThan(0);
  });
});
