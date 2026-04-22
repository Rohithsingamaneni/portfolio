import { render, screen } from "@testing-library/react";
import TopNav from "@/components/TopNav";

describe("top navigation", () => {
  it("renders the primary section anchors", () => {
    render(<TopNav />);

    expect(
      screen.queryByRole("link", { name: /rs/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /capabilities/i })).toHaveAttribute(
      "href",
      "#capabilities"
    );
    expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute(
      "href",
      "#experience"
    );
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute(
      "href",
      "#projects"
    );
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "#about"
    );
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
      "href",
      "#contact"
    );
  });
});
