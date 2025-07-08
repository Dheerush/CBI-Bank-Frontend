"use client";
import Loader from '@/components/reusable/Loader';
import { useMainContext } from '@/context/MainContext';
import { setIsToggle, SidebarSlicePath } from '@/redux/slice/sidebarSlice';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { BiSolidDashboard } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
import { FaRupeeSign } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6"
import { FaBalanceScaleRight } from "react-icons/fa";

const RootTemplate = ({ children }) => {
  const { user } = useMainContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const dispatch = useDispatch();
  const isToggle = useSelector(SidebarSlicePath)
  const pathname = usePathname();


  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else {
      setLoading(false);
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <Loader />
      </div>
    );
  }

  const CustomMenu = ({ link, text, Icon }) => {
    const isActive = pathname === link;

    return (
      <MenuItem
        icon={<Icon className="text-xl" />}
        component={<Link href={link} />}
        style={{
          backgroundColor: isActive ? '#1e3a8a' : 'transparent',
          color: isActive ? '#fff' : '#e2e8f0',
          borderRadius: '0.375rem',
          margin: '4px 8px',
          fontWeight: isActive ? '600' : '500',
        }}
        className="hover:bg-[#334155] transition-colors"
      >
        {text}
      </MenuItem>
    );
  };


  return (
    < >
      <section className="flex relative h-[calc(100vh-4rem)] mt-16 overflow-hidden">
        <Sidebar
          breakPoint="lg"
          toggled={isToggle}
          onBackdropClick={() => dispatch(setIsToggle())}
          backgroundColor="#0d171f"
          className="h-full shadow-lg bg-[#0d171f] py-7 px-1 fixed top-5 left-0 w-[250px] z-40"
        >
          <Menu className="text-white">
            <CustomMenu link={'/'} text={'Dashboard'} Icon={BiSolidDashboard} />
            <CustomMenu link={'/amount'} text={'Amount'} Icon={FaRupeeSign} />
            <CustomMenu link={'/fd-amount'} text={'Fixed Deposit'} Icon={FaSackDollar} />
            <CustomMenu link={'/loans'} text={'Loans'} Icon={FaBalanceScaleRight} />
            <CustomMenu link={'/transactions'} text={'Transactions'} Icon={MdOutlineCompareArrows} />
            <CustomMenu link={'/profile'} text={'Profile'} Icon={CgProfile} />
          </Menu>
        </Sidebar>

        <main className=" w-full h-full overflow-y-auto p-4">
          {children}
        </main>
      </section>
    </>
  )
}

export default RootTemplate

