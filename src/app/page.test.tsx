import { render, screen } from "@testing-library/react"
import Page from "./page"

describe("Home page", () => {
  it("renders weather explorer shell", () => {
    render(<Page />)
    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(screen.getByText("Country Weather Explorer")).toBeInTheDocument()
  })
})
