import React, { useState } from 'react'
import Header from '../../components/dashboard/Header'
import Sidebar from '../../components/dashboard/Sidebar'
import './dashboard.css';

const Dashboard = ({children}) => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle)
    }
  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <div className='bg-slate-200' style={{gridColumn: '2 / span 3'}}> {/* Adjusted grid-column */}
        {children}
      </div>
    </div>
  )
}

export default Dashboard
