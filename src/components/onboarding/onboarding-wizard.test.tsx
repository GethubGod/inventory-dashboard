import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();
let localStore: Record<string, string> = {};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace,
    refresh,
  }),
  useSearchParams: () => new URLSearchParams(""),
}));

vi.mock("@/components/providers/supabase-provider", () => ({
  useSupabase: () => ({
    supabase: {
      from: vi.fn(),
    },
    user: {
      id: "user-test",
      user_metadata: {},
    },
    isLoading: false,
  }),
}));

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

describe("OnboardingWizard", () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    refresh.mockReset();
    localStore = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (key: string) => localStore[key] ?? null,
        setItem: (key: string, value: string) => {
          localStore[key] = value;
        },
        removeItem: (key: string) => {
          delete localStore[key];
        },
        clear: () => {
          localStore = {};
        },
      },
      configurable: true,
    });
  });

  it("preserves entered location data when navigating back and forward", async () => {
    const user = userEvent.setup();

    render(<OnboardingWizard />);

    await user.type(screen.getByLabelText(/organization name/i), "Babytuna Test Org");
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    await user.click(screen.getByRole("button", { name: /continue without square/i }));

    await user.type(await screen.findByLabelText(/location name/i), "Downtown Kitchen");
    await user.type(screen.getByLabelText(/address/i), "123 Market Street");
    await user.type(screen.getByLabelText(/phone/i), "(555) 222-9988");

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(await screen.findByText(/invite your team/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(await screen.findByLabelText(/location name/i)).toHaveValue("Downtown Kitchen");
    expect(screen.getByLabelText(/address/i)).toHaveValue("123 Market Street");
    expect(screen.getByLabelText(/phone/i)).toHaveValue("(555) 222-9988");

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(await screen.findByText(/invite your team/i)).toBeInTheDocument();
  });
});
