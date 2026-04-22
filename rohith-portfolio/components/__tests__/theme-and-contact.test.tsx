import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "@/components/Contact";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

describe("theme and contact experience", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("toggles the site theme and persists the selection", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe("dark");

    const toggle = screen.getByRole("button", {
      name: /switch to light mode/i,
    });

    await user.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("portfolio-theme")).toBe("light");
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  it("renders a concise contact closeout without duplicated social links", () => {
    render(<Contact />);

    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /send message/i })
    ).not.toBeInTheDocument();
  });
});
