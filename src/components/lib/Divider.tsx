import React, { type ReactNode } from 'react'

type DividerProps = {
  className?: string
  children?: ReactNode
}

const Divider: React.FC<DividerProps> = ({ children, className }) => {
  return (<div className={`flex items-center gap-4 sticky top-0 backdrop-blur-sm ${className}`}>
    {children ? <><hr className="flex-1 w-1 divider-dimmed"/>
        {children}
      <hr className="flex-1 w-1 divider-dimmed "/></> :
      <hr className="flex-1 w-1 divider-dimmed "/>}
  </div>  
  )
}

export default Divider
