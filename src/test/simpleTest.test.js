import React from "react";
import { render, screen } from "@testing-library/react";

const BasicComponent = () => <div>Hello, Tests!</div>;

describe("Basic Test", () => {
    it("renders the component", () => {
        render(<BasicComponent />);
        expect(screen.getByText(/Hello, Tests!/i)).toBeInTheDocument();
    });
});
