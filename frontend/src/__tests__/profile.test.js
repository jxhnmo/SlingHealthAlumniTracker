import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "../pages/profiles/[id]";

describe("Profile Tests", () => {
  const testUser = {
    name: "Test User",
    year: "20XX",
    major: "Computer Engineering",
    bio: "I am not a real person",
    achievements: "I have no achievements",
    contact: "realEmail@email.com",
  };

  it("edit user attributes", async () => {
    render(<Profile />);
    const editButton = screen.getByRole("button", { name: /Edit/i });
    await userEvent.click(editButton);

    const name = screen.getByTestId(/name/i);
    await userEvent.clear(name);
    await userEvent.type(name, testUser.name);

    const major = screen.getByTestId(/major/i);
    await userEvent.clear(major);
    await userEvent.type(major, testUser.major);

    const year = screen.getByTestId(/year/i);
    await userEvent.clear(year);
    await userEvent.type(year, testUser.year);

    const bio = screen.getByTestId(/bio/i);
    await userEvent.clear(bio);
    await userEvent.type(bio, testUser.bio);

    const achievements = screen.getByTestId(/achievements/i);
    await userEvent.clear(achievements);
    await userEvent.type(achievements, testUser.achievements);

    const contact = screen.getByTestId(/contact/i);
    await userEvent.clear(contact);
    await userEvent.type(contact, testUser.contact);

    const save = screen.getByRole("button", { name: /Save/i });
    await userEvent.click(save);
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Computer Engineering Class of 20XX/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/I am not a real person/i)).toBeInTheDocument();
    expect(screen.getByText(/I have no achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/realEmail@email.com/i)).toBeInTheDocument();
  });
});
