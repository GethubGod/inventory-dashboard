import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

afterEach(cleanup);

describe("Card", () => {
  it("renders with semantic token classes (no hardcoded colors)", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("bg-card");
    expect(card.className).toContain("border-border");
    expect(card.className).toContain("text-card-foreground");
    expect(card.className).not.toMatch(/bg-\[#/);
  });

  it("renders rounded-xl border radius", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("rounded-xl");
  });

  it("has soft shadow", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("shadow-");
  });

  it("renders full card composition", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("CardTitle uses semantic foreground color", () => {
    render(<CardTitle>Test Title</CardTitle>);
    const title = screen.getByText("Test Title");
    expect(title.className).toContain("text-foreground");
    expect(title.className).not.toMatch(/text-\[#/);
  });

  it("CardDescription uses muted-foreground", () => {
    render(<CardDescription>Test Desc</CardDescription>);
    const desc = screen.getByText("Test Desc");
    expect(desc.className).toContain("text-muted-foreground");
  });
});
