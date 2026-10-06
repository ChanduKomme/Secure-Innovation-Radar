import { createContext, useContext, useState, type ReactNode } from "react";
import { SUGGESTIONS, type Suggestion } from "@/data/mock";

interface Store {
  suggestions: Suggestion[];
  add: (s: Suggestion) => void;
  reviewed: Set<string>;
  markReview: (themeId: string) => void;
}
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [suggestions, setS] = useState<Suggestion[]>(SUGGESTIONS);
  const [reviewed, setR] = useState<Set<string>>(new Set());
  return (
    <Ctx.Provider
      value={{
        suggestions,
        add: (s) => setS((p) => [s, ...p]),
        reviewed,
        markReview: (id) => setR((p) => new Set(p).add(id)),
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
