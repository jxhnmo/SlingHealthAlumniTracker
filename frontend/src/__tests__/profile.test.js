import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../pages/profile";

describe("Profile Tests", () => {
  it("should contain placeholder", () => {
    render(<Profile />);
    const name = screen.getByText(/Sabrina Carpet/i);
    expect(name).toBeInTheDocument();
  });
});
