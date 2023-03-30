import React from "react";
import { render, screen } from "@testing-library/react";
import ConfirmDialog from "../ConfirmDialog";

test("renders Confirm Dialogue", () => {
  render(
    <ConfirmDialog
      title="Delete Confirmation"
      description={`Do you want to delete this data ?`}
      onClose={jest.fn()}
      open={true}
      onYes={jest.fn()}
      loading={false}
    />);
  const linkElement = screen.getByTestId("confirm-dialog");
  expect(linkElement).toBeDefined();
});
