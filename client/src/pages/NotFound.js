import React from 'react';
import { useLocation } from 'react-router-dom';

// Page that appears when the url provided doesnt match any url defined in the router
function NotFound() {
  let location = useLocation();
  return (
    <div className="card bg-white card-rounded w-50">
      <div className="card-header bg-dark text-center">
        <h1>
          No match for <code>{location.pathname}</code>
        </h1>
      </div>
    </div>
  );
}

export default NotFound;
