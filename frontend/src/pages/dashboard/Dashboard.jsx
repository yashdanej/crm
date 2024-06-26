import React, { useEffect, useState } from 'react'
import Header from '../../components/dashboard/Header'
import Sidebar from '../../components/dashboard/Sidebar'
import './dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/UserSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Profile from './Profile';
import { MenuPopupState, SimpleBadge, api } from '../../utils/Utils';
import { getUserNotification, removeNotification } from '../../store/slices/Notification';
import { MenuPopup } from './MenuPopup';
import useDropdown from '../../components/useDropdown';

const Dashboard = ({children}) => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { openStates, toggleDropdown } = useDropdown();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
    const dispatch = useDispatch();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpenSidebarToggle(true);
      } else {
        setOpenSidebarToggle(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const sidebarFn = () => {

    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const main = document.querySelector('.main');
  
    const handleSidebarOverlayClick = (e) => {
      e.preventDefault();
      main.classList.add('active');
      sidebarOverlay.classList.add('hidden');
      sidebarMenu.classList.add('-translate-x-full');
    };
  
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        main.classList.toggle('active');
        sidebarOverlay.classList.toggle('hidden');
        sidebarMenu.classList.toggle('-translate-x-full');
      });
    }
  
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', handleSidebarOverlayClick);
    }
  
    const handleDropdownToggleClick = (item) => (e) => {
      e.preventDefault();
      const parent = item.closest('.group');
      if (parent.classList.contains('selected')) {
        parent.classList.remove('selected');
      } else {
        document
          .querySelectorAll('.sidebar-dropdown-toggle')
          .forEach(function (i) {
            i.closest('.group').classList.remove('selected');
          });
        parent.classList.add('selected');
      }
    };
  
    document
      .querySelectorAll('.sidebar-dropdown-toggle')
      .forEach(function (item) {
        item.addEventListener('click', handleDropdownToggleClick(item));
      });
  
    return () => {
      if (sidebarToggle) {
        sidebarToggle.removeEventListener('click', handleSidebarToggle);
      }
      if (sidebarOverlay) {
        sidebarOverlay.removeEventListener('click', handleSidebarOverlayClick);
      }
      document
        .querySelectorAll('.sidebar-dropdown-toggle')
        .forEach(function (item) {
          item.removeEventListener('click', handleDropdownToggleClick(item));
        });
    };
  }
  useEffect(() => {
    sidebarFn();
  }, [openSidebarToggle]);

  useEffect(() => {
    const handleTabClick = (e) => {
      e.preventDefault();
      const tab = e.target.dataset.tab;
      const page = e.target.dataset.tabPage;
      const target = document.querySelector(
        `[data-tab-for="${tab}"][data-page="${page}"]`
      );

      document
        .querySelectorAll(`[data-tab="${tab}"]`)
        .forEach((i) => i.classList.remove('active'));
      document
        .querySelectorAll(`[data-tab-for="${tab}"]`)
        .forEach((i) => i.classList.add('hidden'));

      e.target.classList.add('active');
      target.classList.remove('hidden');
    };

    document
      .querySelectorAll('[data-tab]')
      .forEach((item) => item.addEventListener('click', handleTabClick));

    return () => {
      document
        .querySelectorAll('[data-tab]')
        .forEach((item) => item.removeEventListener('click', handleTabClick));
    };
  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeNotification());
    Cookies.remove("access_token");
    localStorage.removeItem("user");
    !isLoggedIn && navigate('/login');
  }
    let getUser = JSON.parse(localStorage.getItem("user"));

    const menu = [
      {
        title: "Setup",
        items: [
          { href: '/setup/status', label: 'Status' },
          { href: '/setup/sources', label: 'Sources' },
          { href: '/setup/agents', label: 'Agents' },
          { href: '/setup/typeofwork', label: 'Type Of Work' },
          { href: '/setup/profileofclient', label: 'Profile Of Client' },
          { href: '/setup/designation', label: 'Designation' },
          { href: '/setup/group', label: 'Group' },
          { href: '/setup/currency', label: 'Currency' },
          { href: '/setup/it_status', label: 'IT Status' },
          { href: '/setup/master_type', label: 'Master Type' },
          { href: '/setup/sub_master', label: 'Sub Master' },
          { href: '/setup/custom_field', label: 'Custom Fields' },
          { href: '/setup/employees', label: 'Employees' },
        ]
      },
      {
        title: "Orders",
        items: [
          { href: '#', label: 'Agents' },
          { href: '#', label: 'Status' },
          { href: '#', label: 'Sources' },
          { href: '#', label: 'Type Of Work' },
          { href: '#', label: 'Profile Of Client' },
        ]
      }
    ]
    const location = useLocation();
  return (
    <div className=''>
      <div className="fixed left-0 top-0 w-64 h-full bg-gray-900 p-4 z-50 sidebar-menu transition-transform">
        <a href="#" className="flex items-center pb-4 border-b border-b-gray-800">
            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover"/>
            <span className="text-lg font-bold text-white ml-3">Logo</span>
        </a>
        <ul className="mt-4">
            {
                getUser?.role === 3 && (
                    <li className={`mb-1 group ${location.pathname === "/superadmin/users" && "active"}`}>
                        <Link to="/superadmin/users" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                            <i className="ri-home-2-line mr-3 text-lg"></i>
                            <span className="text-sm">User</span>
                        </Link>
                    </li>
                )
            }
             {
                getUser?.role === 4 ? (
                  <>
                    <li className={`mb-1 group ${location.pathname === "/developer/company" && "active"}`}>
                        <Link to="/developer/company" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                            <i className="ri-home-2-line mr-3 text-lg"></i>
                            <span className="text-sm">Company</span>
                        </Link>
                    </li>
                    <li className={`mb-1 group ${location.pathname === "/developer/super_admin" && "active"}`}>
                        <Link to="/developer/super_admin" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                            <i className="ri-home-2-line mr-3 text-lg"></i>
                            <span className="text-sm">Super Admin</span>
                        </Link>
                    </li>
                  </>
                ):(
                  <>
                    <li className={`mb-1 group ${location.pathname === "/admin/dashboard" && "active"}`}>
                        <Link to="/admin/dashboard" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                            <i className="ri-home-2-line mr-3 text-lg"></i>
                            <span className="text-sm">Dashboard</span>
                        </Link>
                    </li>
                    <li className={`mb-1 group ${location.pathname === "/admin/leads" && "active"}`}>
                        <Link to="/admin/leads" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                            <i className="ri-home-2-line mr-3 text-lg"></i>
                            <span className="text-sm">Leads</span>
                        </Link>
                    </li>
                    <li className={`mb-1 group ${location.pathname === "/admin/customer" && "active"}`}>
                        <Link to="/admin/customer" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                            <i className="ri-home-2-line mr-3 text-lg"></i>
                            <span className="text-sm">Customer</span>
                        </Link>
                    </li>
                    <li className={`mb-1 group ${location.pathname === "/admin/task" && "active"}`}>
                        <Link to="/admin/task" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                            <i className="ri-home-2-line mr-3 text-lg"></i>
                            <span className="text-sm">Task</span>
                        </Link>
                    </li>
                      {getUser?.role !== 1 && menu.map((item, index) => {
                        console.log('location.pathname.startsWith("/setup")', location.pathname.startsWith("/setup"));
                        return (
                          <li className={`mb-1 group ${location.pathname.startsWith("/setup") && "active"}`} key={index}>
                            <button
                              onClick={() => toggleDropdown(index)}
                              className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md"
                            >
                              <i className="ri-instance-line mr-3 text-lg"></i>
                              <span className="text-sm">{item.title}</span>
                              <i
                                className={`ri-arrow-right-s-line ml-auto transition-transform ${
                                  openStates[index] ? 'rotate-90' : ''
                                }`}
                              ></i>
                            </button>
                            <ul className={`pl-7 mt-2 ${openStates[index] ? 'block' : 'hidden'}`}>
                              {item?.items?.map((subItem, subIndex) => (
                                <li key={subIndex} className={`mb-4 ${location.pathname === subItem.href && "active"}`}>
                                  <Link
                                    to={subItem.href}
                                    className="text-gray-300 text-sm flex items-center hover:text-gray-100 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3"
                                    >
                                    {subItem.label}
                              </Link>
                              </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                  </>
                )
            }
            {/* <li className="mb-1 group">
                <a href="#" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
                    <i className="ri-settings-2-line mr-3 text-lg"></i>
                    <span className="text-sm">Settings</span>
                </a>
            </li> */}
        </ul>
    </div>
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay"></div>

    <main className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-50 min-h-screen transition-all main">
        <div className="py-2 px-6 bg-white flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
            <button type="button" className="text-lg text-gray-600 sidebar-toggle" onClick={sidebarFn}>
                <i className="ri-menu-line"></i>
            </button>
            <ul className="flex items-center text-sm ml-4">
                <li className="mr-2">
                    <a href="#" className="text-gray-400 hover:text-gray-600 font-medium">Dashboard</a>
                </li>
                <li className="text-gray-600 mr-2 font-medium">/</li>
                <li className="text-gray-600 mr-2 font-medium">Analytics</li>
            </ul>
            <ul className="ml-auto flex items-center">
                <li className="mr-1 dropdown">
                    <button type="button" className="dropdown-toggle text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                        <i className="ri-search-line"></i>
                    </button>
                    <div className="dropdown-menu shadow-md shadow-black/5 z-30 hidden max-w-xs w-full bg-white rounded-md border border-gray-100">
                        <form action="" className="p-4 border-b border-b-gray-100">
                            <div className="relative w-full">
                                <input type="text" className="py-2 pr-4 pl-10 bg-gray-50 w-full outline-none border border-gray-100 rounded-md text-sm focus:border-blue-500" placeholder="Search..."/>
                                <i className="ri-search-line absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </form>
                        <div className="mt-3 mb-2">
                            <div className="text-[13px] font-medium text-gray-400 ml-4 mb-2">Recently</div>
                            <ul className="max-h-64 overflow-y-auto">
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                                        <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle"/>
                                        <div className="ml-2">
                                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">Create landing page</div>
                                            <div className="text-[11px] text-gray-400">$345</div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li>
                    <MenuPopup />
                </li>
                <Profile handleLogout={handleLogout} />
            </ul>
        </div>
        {children}
    </main>
    </div>
  )
}

export default Dashboard
