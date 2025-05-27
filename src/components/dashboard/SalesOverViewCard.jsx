import React from 'react';

const SalesOverviewCard = ({ data }) => {
  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-4 h-[180px] w-full">
      <p className="text-lg font-semibold">{data.title}</p>
      <p className="text-2xl font-bold">{data.value}</p>

      <div className="flex justify-between items-center mt-auto">
        <div className="flex flex-col">
          <p className="text-sm text-gray-500">Orders</p>
          <p>{data.order?.value}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-gray-500">Visits</p>
          <p>{data.visit?.value}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesOverviewCard;
