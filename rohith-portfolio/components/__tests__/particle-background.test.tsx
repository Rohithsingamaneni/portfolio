import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ParticleBackground from "@/components/ParticleBackground";

describe("particle background", () => {
  it("renders a dynamic particle canvas and atmospheric dot layers", () => {
    render(<ParticleBackground />);

    expect(screen.getByTestId("particle-background")).toHaveClass(
      "fixed",
      "inset-0"
    );
    expect(screen.getByTestId("particle-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("particle-dot-matrix")).toBeInTheDocument();
  });

  it("subscribes to pointer movement for interactive particle motion", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<ParticleBackground />);

    expect(addEventListener).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "pointerleave",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function)
    );
    expect(removeEventListener).toHaveBeenCalledWith(
      "pointerleave",
      expect.any(Function)
    );

    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });
});
