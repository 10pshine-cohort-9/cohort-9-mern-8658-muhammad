"use client";
import React, { useState } from "react";
import Sidenavbar from "./sidenavbar";
import TopNavBar from "./topnavbar";

function AppLayout({ children }) {
  const [sideOpen, setSideOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidenavbar sideOpen={sideOpen} setSideOpen={setSideOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div>
          <TopNavBar sideOpen={sideOpen} setSideOpen={setSideOpen} />
        </div>

        <main
          className="flex-1 overflow-y-auto "
          onClick={() => setSideOpen(false)}
        >
          {" "}
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
