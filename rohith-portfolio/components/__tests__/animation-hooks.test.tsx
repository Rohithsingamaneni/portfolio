import { render, screen } from "@testing-library/react";
import Capabilities from "@/components/Capabilities";
import Experience from "@/components/Experience";
import { capabilities, experiences } from "@/lib/portfolio-data";

describe("animation hooks", () => {
  it("marks capability and experience cards for scroll-driven motion", () => {
    const { container } = render(
      <>
        <Capabilities />
        <Experience />
      </>
    );

    expect(container.querySelectorAll(".signal-card")).toHaveLength(
      capabilities.length
    );
    expect(container.querySelectorAll(".timeline-card")).toHaveLength(
      experiences.length
    );
    expect(screen.getByText(/Professional_History/i)).toBeInTheDocument();
  });
});
