import React from "react";

const TableCard = ({ index, id }) => {
  return (
    <tr className="border-t border-b">
      <td className="px-3 py-2">{index + 1}</td>
      <td className="px-3 py-2">Transaction ID</td>
      <td className="px-3 py-2">06:30 PM <br /> 31/05/2025</td>
      <td className="px-3 py-2">Debit</td>
      <td className="px-3 py-2">Rs. 50</td>
      <td className="px-3 py-2">Paid via Razorpay</td>
    </tr>
  );
};

export default TableCard;
