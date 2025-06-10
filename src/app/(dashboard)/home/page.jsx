'use client'

import React, { useContext, useEffect, useState } from 'react'
import UserGrowth from '@/components/dashboard/UserGrowth'
import RatingsGraph from '@/components/dashboard/RatingsGraph'
import GoalsGraph from '@/components/dashboard/GoalsGraph'
import PageLoader from '@/components/loaders/PageLoader'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_URL } from '@/configs/url'
import { useSearchParams } from 'next/navigation'
import { AuthContext } from '@/app/context/AuthContext'



export default function Page() {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  // const searchParams = useSearchParams();
  // const { googleLogin } = useContext(AuthContext);

  // useEffect(() => {
  //   console.log("token on home page", searchParams.get('token'))
  //   if (searchParams.get('token')) {
  //     googleLogin(searchParams.get('token'))
  //   }
  // }, [searchParams])

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard`)
      setData(res.data)
      console.log(res.data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  if (isLoading) return <PageLoader/>

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'>
        {/* /* Total Users */}
        <div className='flex flex-col gap-2 border border-gray-300 rounded-lg  h-[180px] w-full'>
          <h1 className='text-lg pt-4 px-4 font-semibold'>Total Users</h1>
          <p className='text-sm px-4 text-gray-500'>OverAll</p>
          <p className='text-2xl px-4 font-bold'>{data.totalUsers}</p>
          <div className='mt-auto w-full'>
            <svg width='100%' height='66' viewBox='0 0 262 66' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M85.5519 30.8939C52.9044 56.0553 14.9142 42.8972 0 33.173V65.5364H261.573V17.2192C218.305 27.4752 198.146 14.4842 166.187 5.59567C134.228 -3.29288 126.361 -0.557942 85.5519 30.8939Z'
                fill='url(#paint0_linear_55_323)'
                fill-opacity='0.3'
              />
              <path
                d='M0 33.173C14.9142 42.8972 52.9044 56.0553 85.5519 30.8939C126.361 -0.557944 134.228 -3.29288 166.187 5.59567C198.146 14.4842 218.305 27.4752 261.573 17.2192'
                stroke='#28C76F'
                stroke-width='1.67139'
                stroke-linecap='round'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_55_323'
                  x1='130.786'
                  y1='1.18953'
                  x2='130.786'
                  y2='65.5364'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='#28C76F' />
                  <stop offset='1' stop-color='#D9D9D9' stop-opacity='0' />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        <div className='flex flex-col gap-2 border border-gray-300 rounded-lg  h-[180px] w-full'>
          <h1 className='text-lg pt-4 px-4 font-semibold'>Courses Published</h1>
          <p className='text-sm px-4 text-gray-500'>OverAll</p>
          <p className='text-2xl px-4 font-bold'>{data.coursePublished}</p>
          <div className='w-full'>
            <svg width='100%' height='66' viewBox='0 0 262 66' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M85.5519 30.8939C52.9044 56.0553 14.9142 42.8972 0 33.173V65.5364H261.573V17.2192C218.305 27.4752 198.146 14.4842 166.187 5.59567C134.228 -3.29288 126.361 -0.557942 85.5519 30.8939Z'
                fill='url(#paint0_linear_55_323)'
                fill-opacity='0.3'
              />
              <path
                d='M0 33.173C14.9142 42.8972 52.9044 56.0553 85.5519 30.8939C126.361 -0.557944 134.228 -3.29288 166.187 5.59567C198.146 14.4842 218.305 27.4752 261.573 17.2192'
                stroke='#28C76F'
                stroke-width='1.67139'
                stroke-linecap='round'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_55_323'
                  x1='130.786'
                  y1='1.18953'
                  x2='130.786'
                  y2='65.5364'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='#28C76F' />
                  <stop offset='1' stop-color='#D9D9D9' stop-opacity='0' />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className='flex flex-col gap-2 border border-gray-300 rounded-lg  h-[180px] w-full'>
          <h1 className='text-lg pt-4 px-4 font-semibold'>Total Enrollments</h1>
          <p className='text-sm px-4 text-gray-500'>OverAll</p>
          <p className='text-2xl px-4 font-bold'>{data.totalEnrollments}</p>
          <div className='mt-auto w-full'>
            <svg width='100%' height='66' viewBox='0 0 262 66' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M85.5519 30.8939C52.9044 56.0553 14.9142 42.8972 0 33.173V65.5364H261.573V17.2192C218.305 27.4752 198.146 14.4842 166.187 5.59567C134.228 -3.29288 126.361 -0.557942 85.5519 30.8939Z'
                fill='url(#paint0_linear_55_323)'
                fill-opacity='0.3'
              />
              <path
                d='M0 33.173C14.9142 42.8972 52.9044 56.0553 85.5519 30.8939C126.361 -0.557944 134.228 -3.29288 166.187 5.59567C198.146 14.4842 218.305 27.4752 261.573 17.2192'
                stroke='#28C76F'
                stroke-width='1.67139'
                stroke-linecap='round'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_55_323'
                  x1='130.786'
                  y1='1.18953'
                  x2='130.786'
                  y2='65.5364'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='#28C76F' />
                  <stop offset='1' stop-color='#D9D9D9' stop-opacity='0' />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>


        <div className='flex flex-col gap-2 border border-gray-300 rounded-lg  h-[180px] w-full'>
          <h1 className='text-lg pt-4 px-4 font-semibold'>Active Enromments</h1>
          <p className='text-sm px-4 text-gray-500'>OverAll</p>
          <p className='text-2xl px-4 font-bold'>{data.activeEnrollments}</p>
          <div className='mt-auto w-full'>
            <svg width='100%' height='66' viewBox='0 0 262 66' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M85.5519 30.8939C52.9044 56.0553 14.9142 42.8972 0 33.173V65.5364H261.573V17.2192C218.305 27.4752 198.146 14.4842 166.187 5.59567C134.228 -3.29288 126.361 -0.557942 85.5519 30.8939Z'
                fill='url(#paint0_linear_55_323)'
                fill-opacity='0.3'
              />
              <path
                d='M0 33.173C14.9142 42.8972 52.9044 56.0553 85.5519 30.8939C126.361 -0.557944 134.228 -3.29288 166.187 5.59567C198.146 14.4842 218.305 27.4752 261.573 17.2192'
                stroke='#28C76F'
                stroke-width='1.67139'
                stroke-linecap='round'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_55_323'
                  x1='130.786'
                  y1='1.18953'
                  x2='130.786'
                  y2='65.5364'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='#28C76F' />
                  <stop offset='1' stop-color='#D9D9D9' stop-opacity='0' />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

      </div>

      <div className='flex items-center justify-center gap-4 w-full'>
        <div className='grid  sm:grid-cols-1 lg:grid-cols-2 gap-2 w-full'>
          <RatingsGraph />
          <UserGrowth />
        </div>
      </div>

      <div className='flex items-center justify-center gap-4 w-full'>
        <GoalsGraph />
      </div>
    </div>
  )
}
