// "use client";
// import { useMainContext } from "@/context/MainContext";
// import React from "react";

// const HeaderName = () => {
//   const { user } = useMainContext();
//   const account_type = user?.ac_type !== undefined ? user.ac_type : 'N/A';
  
//   return (
//     <>
//       <div>
//         <h1 className="text-2xl font-bold text-gray-600 w-full border-b border-b-gray-200 py-2 px-1 select-none">
//         {user.name} | <span className="text-base capitalize text-blue-500 underline">{account_type} Account </span> 
//         </h1>
//       </div>
//     </>
//   );
// };

// export default HeaderName;


"use client";
import { useMainContext } from "@/context/MainContext";
import React from "react";

const HeaderName = () => {
  const { user } = useMainContext();

  if (!user) return null; // or return a fallback UI

  const account_type = user.ac_type !== undefined ? user.ac_type : "N/A";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-600 w-full border-b border-b-gray-200 py-2 px-1 select-none">
        {user.name} |{" "}
        <span className="text-base capitalize text-blue-500 underline">
          {account_type} Account
        </span>
      </h1>
    </div>
  );
};

export default HeaderName;
