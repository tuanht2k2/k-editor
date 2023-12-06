"use client";

import { makeStore } from "@/lib/redux/store";
import { useRef } from "react";
import { Provider } from "react-redux";

function StoreProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

export default StoreProvider;
