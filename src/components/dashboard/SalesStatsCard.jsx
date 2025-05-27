import React from 'react';

const SalesStatsCard = ({ data }) => {
  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded-lg  h-[180px] w-full">
      <h1 className="text-lg pt-4 px-4 font-semibold">{data.title}</h1>
      <p className="text-sm px-4 text-gray-500">{data.subTitle}</p>
      <p className="text-2xl px-4 font-bold">{data.value}</p>
      <div className="mt-auto w-full">
        <svg width="100%" height="66" viewBox="0 0 262 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M85.5519 30.8939C52.9044 56.0553 14.9142 42.8972 0 33.173V65.5364H261.573V17.2192C218.305 27.4752 198.146 14.4842 166.187 5.59567C134.228 -3.29288 126.361 -0.557942 85.5519 30.8939Z" fill="url(#paint0_linear_55_323)" fill-opacity="0.3"/>
        <path d="M0 33.173C14.9142 42.8972 52.9044 56.0553 85.5519 30.8939C126.361 -0.557944 134.228 -3.29288 166.187 5.59567C198.146 14.4842 218.305 27.4752 261.573 17.2192" stroke="#28C76F" stroke-width="1.67139" stroke-linecap="round"/>
        <defs>
        <linearGradient id="paint0_linear_55_323" x1="130.786" y1="1.18953" x2="130.786" y2="65.5364" gradientUnits="userSpaceOnUse">
        <stop stop-color="#28C76F"/>
        <stop offset="1" stop-color="#D9D9D9" stop-opacity="0"/>
        </linearGradient>
        </defs>
        </svg>
      </div>
    </div>
  );
};

export default SalesStatsCard;
