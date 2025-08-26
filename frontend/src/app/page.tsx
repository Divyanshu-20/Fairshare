"use client";

import FairShare from "./FairShare";
import Navbar from "./Navbar";
import AppProvider from "./Providers";

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <Navbar />
        <FairShare />
      </div>
    </AppProvider>
  );
}
