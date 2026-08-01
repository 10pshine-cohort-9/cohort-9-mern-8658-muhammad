"use client";
import React, { useState } from "react";
import Sidenavbar from "../../components/sidenavbar";
import TopNavBar from "../../components/topnavbar";

function Layout({ children }) {
  const [sideOpen, setSideOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidenavbar sideOpen={sideOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div>
          <TopNavBar setSideOpen={setSideOpen} />
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
