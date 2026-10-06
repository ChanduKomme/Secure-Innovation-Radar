import { createContext, useContext, useState, type ReactNode } from "react";
import { SUGGESTIONS, type Suggestion } from "@/data/mock";

export type ProposalStatus = "open" | "review" | "investigation" | "dismissed";

interface Store {
  suggestions: Suggestion[];
  add: (s: Suggestion) => void;
  proposal: Record<string, ProposalStatus>;
  setProposal: (themeId: string, s: ProposalStatus) => void;
}
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [suggestions, setS] = useState<Suggestion[]>(SUGGESTIONS);
  const [proposal, setP] = useState<Record<string, ProposalStatus>>({});
  return (
    <Ctx.Provider
      value={{
        suggestions,
        add: (s) => setS((p) => [s, ...p]),
        proposal,
        setProposal: (id, s) => setP((p) => ({ ...p, [id]: s })),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
