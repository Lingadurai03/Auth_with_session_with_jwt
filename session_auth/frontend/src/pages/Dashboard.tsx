import React from "react";
import Button from "../components/Button";

function Dashboard() {
  return (
    <div>
      <nav className="flex justify-end py-2 px-5">
        <Button title="Logout" />
      </nav>
    </div>
  );
}

export default Dashboard;
