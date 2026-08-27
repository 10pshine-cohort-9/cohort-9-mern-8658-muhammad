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

        {sideOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            onClick={() => setSideOpen(false)}
          />
        )}
        <main className="flex-1 overflow-y-auto ">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
