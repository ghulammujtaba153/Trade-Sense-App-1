import UserList from '@/components/users/UserList'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div>
        <button>Assign Instructor</button>
      </div>
      <UserList/>
    </div>
  )
}

export default page
