import React from "react";
import { render, screen } from "@testing-library/react";
import DateToggler from "../DateToggler";
import { endOfWeek, startOfWeek } from "date-fns";

test("renders Date toggler", () => {
  render(
    <DateToggler
      startOfWeek={startOfWeek(new Date())}
      endOfWeek={endOfWeek(new Date())}
      handleDateToggler={jest.fn()}
      isPublished={false}
    />);
  const linkElement = screen.getByTestId("date-toggler");
  expect(linkElement).toBeDefined();
});
