import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Form from "../../components/UploadFile/UploadForm/index";
import { MemoryRouter } from "react-router-dom";

test("renders Upload a File title", () => {
  render(<MemoryRouter><Form /></MemoryRouter>);
  const titleElement = screen.getByText(/Upload a File/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders File Upload input", () => {
  render(<MemoryRouter><Form /></MemoryRouter>);
  const fileUploadInput = screen.getByLabelText(/Upload File/i);
  expect(fileUploadInput).toBeInTheDocument();
});

test("renders Upload Name input", () => {
  render(<MemoryRouter><Form /></MemoryRouter>);
  const uploadNameInput = screen.getByPlaceholderText(/Analytical Report on Machine Learning/i);
  expect(uploadNameInput).toBeInTheDocument();
});

test("renders File Description input", () => {
  render(<MemoryRouter><Form /></MemoryRouter>);
  const fileDescriptionInput = screen.getByPlaceholderText(/This file contains such and such/i);
  expect(fileDescriptionInput).toBeInTheDocument();
});

test("renders Passphrase input", () => {
  render(<MemoryRouter><Form /></MemoryRouter>);
  const passphraseInputs = screen.getAllByPlaceholderText(/Cat Dog Duck/i);
  const passphraseInput = passphraseInputs[0];
  expect(passphraseInput).toBeInTheDocument();
});
