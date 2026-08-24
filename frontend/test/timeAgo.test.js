import { timeAgo } from "../src/lib/timeAgo";

describe("timeAgo", () => {
  it("returns seconds ago for recent timestamps", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 45 * 1000);

    expect(timeAgo(past.toISOString())).toBe("45 sec ago");
  });

  it("returns minutes ago for timestamps under an hour", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 5 * 60 * 1000);

    expect(timeAgo(past.toISOString())).toBe("5 min ago");
  });

  it("returns hours ago for timestamps under a day", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    expect(timeAgo(past.toISOString())).toBe("3 hours ago");
  });

  it("returns days ago for timestamps under a month", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

    expect(timeAgo(past.toISOString())).toBe("4 days ago");
  });

  it("returns months ago for timestamps under a year", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000);

    expect(timeAgo(past.toISOString())).toBe("2 months ago");
  });

  it("returns years ago for older timestamps", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);

    expect(timeAgo(past.toISOString())).toBe("2 years ago");
  });
});
