import React from "react";

const LeaderBoard = () => {
  return (
    <aside className="p-4 max-w-sm rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">LeaderBoard</h2>
      <ul className="mt-4">
        <li className="flex justify-between py-2 border-b border-muted">
          <span>User 1</span>
          <span>1000 points</span>
        </li>
        <li className="flex justify-between py-2 border-b border-muted">
          <span>User 2</span>
          <span>900 points</span>
        </li>
        <li className="flex justify-between py-2 border-b border-muted">
          <span>User 3</span>
          <span>800 points</span>
        </li>
      </ul>
    </aside>
  );
};

export default LeaderBoard;
