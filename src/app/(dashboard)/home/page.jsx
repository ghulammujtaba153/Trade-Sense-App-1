"use client"

import React, { useEffect, useState } from 'react';
import SalesStatsCard from '@/components/dashboard/SalesStatsCard';
import SalesOverviewCard from '@/components/dashboard/SalesOverViewCard';
import UserGrowth from '@/components/dashboard/UserGrowth';
import RatingsGraph from '@/components/dashboard/RatingsGraph';
import GoalsGraph from '@/components/dashboard/GoalsGraph';
import PageLoader from '@/components/loaders/PageLoader';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '@/components/loaders/Loading';

const salesData = [
  { title: 'Sales', subTitle: 'Last 7 days', value: 0 },
  { title: 'Customers', subTitle: 'Last 7 days', value: 0 },
];

const SalesOverViewData = [
  { title: 'Total Sales', value: 0, order: { value: "14" }, visit: { value: "10" } },
  { title: 'Total Customers', value: 0, order: { value: "14" }, visit: { value: "10" } },
];


export default function Page() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);



  // const fetch=async()=>{
  //   try {
  //      const res = await axios.get(`${API_URL}/api/dashboard`);
  //       setData(res.data);
      
  //   } catch (error) {
  //     toast.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }


  // useEffect(() => {
  //   fetch();
  // }, []);


  // if(isLoading) return <div>loading</div>




  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {salesData.map((item, index) => (
          <SalesStatsCard key={index} data={item} />
        ))}
        {SalesOverViewData.map((item, index) => (
          <SalesOverviewCard key={index} data={item} />
        ))}
      </div>

      <div className='flex items-center justify-center gap-4 w-full'>
        <div className="grid  sm:grid-cols-1 lg:grid-cols-2 gap-2 w-full">
            <RatingsGraph/>
            <UserGrowth/>
        </div>
      </div>

      <div className='flex items-center justify-center gap-4 w-full'>
        <GoalsGraph/>
      </div>
    </div>
  )
}
