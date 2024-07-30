// VoteButtons.js
import React, { useState } from 'react';

const VoteButtons = () => {
  const [approvalCount, setApprovalCount] = useState(0);
  const [disapprovalCount, setDisapprovalCount] = useState(0);

  const handleApproval = () => {
    setApprovalCount(approvalCount + 1);
  };

  const handleDisapproval = () => {
    setDisapprovalCount(disapprovalCount + 1);
  };

  return (
    <div>
      <button onClick={handleApproval}>👍</button>
      <span>{approvalCount}</span>

      <button onClick={handleDisapproval}>👎</button>
      <span>{disapprovalCount}</span>
    </div>
  );
};

export default VoteButtons;
