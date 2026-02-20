"use client";

import { createContext, useContext, type ReactNode } from "react";

export type OrgContextValue = {
  profile: {
    id: string;
    full_name: string | null;
  };
  membership: {
    org_id: string;
    role: string | null;
  };
  organization: {
    id: string;
    name: string;
  };
};

const OrgContext = createContext<OrgContextValue | null>(null);

type OrgProviderProps = {
  value: OrgContextValue;
  children: ReactNode;
};

export function OrgProvider({ value, children }: OrgProviderProps) {
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  return useContext(OrgContext);
}
