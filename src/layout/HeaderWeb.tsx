import React, { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type HeaderWebProps = {
  menuButton: ReactNode;
  title?: string;
  username?: string;
}

const HeaderWeb: React.FC<HeaderWebProps> = ({ title = "НРИ", username = "user", menuButton }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div className='flex justify-between items-center gap-2'>
        {/* {couldReturnToPreviousPage && <p className='cursor-pointer' onClick={returnToPreviousPage}>
          {`<<`}
        </p>} */}
        <div className='flex flex-col items-start md:grid md:grid-cols-2 md:divide-x-2 md:items-center cursor-pointer' onClick={() => navigate("/")}>
          <p
            // text-nowrap truncate
            className="px-4 text-xl font-bold">
            {title}
          </p>
          <p
            className="px-4 text-lg text-gray-400 font-bold">
            {username}
          </p>
        </div>
      </div>
      <div className="relative">
        {menuButton}
      </div>
    </div>
  )
}

export default HeaderWeb
