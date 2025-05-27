import CourseGraph from '@/components/courses/CourseGraph'
import CourseTable from '@/components/courses/CourseTable'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-4'>
      
      <CourseTable/>
      <CourseGraph/>
    </div>
  )
}

export default page
