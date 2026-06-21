import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'
import styles from '../../styles/styles'

const Navbar = ({active}) => {
  return (
    <div className={`flex flex-col md:flex-row`}>
         {
            navItems && navItems.map((i,index) => (
                <div key={i.id || index} className="flex">
                    <Link to={i.url}
                    className={`${active === index + 1 ? "text-[#17dd1f] font-bold" : "text-black md:text-[#fff] text-white/90"} font-medium px-4 py-2 cursor-pointer hover:text-white`}
                    >
                    {i.title}
                    </Link>
                </div>
            ))
         }
    </div>
  )
}

export default Navbar