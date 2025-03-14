// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "../context/SidebarContext";
// import { useUser } from "../context/UserContext";
// import {
//   CalenderIcon,
//   ChevronDownIcon,
//   HorizontaLDots,
//   UserCircleIcon,
// } from "../icons/index";
// import {
//   HomeIcon,
//   Square3Stack3DIcon,
//   UsersIcon,
//   WrenchIcon,
// } from "@heroicons/react/24/outline";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
//   allowedRoles?: string[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <HomeIcon className="size-5" />,
//     name: "Dashboard",
//     path: "/",
//     allowedRoles: ["super-admin", "admin", "operator", "view-only"],
//   },
//   {
//     icon: <UserCircleIcon />,
//     name: "User Profile",
//     path: "/profile",
//     allowedRoles: ["super-admin", "admin", "operator", "view-only"],
//   },
//   {
//     name: "Users",
//     icon: <UsersIcon className="size-5" />,
//     subItems: [
//       { name: "Create Users", path: "/create-user", pro: false },
//       { name: "List Users", path: "/list-users", pro: false },
//     ],
//     allowedRoles: ["super-admin", "admin"],
//   },
//   {
//     name: "Tools",
//     icon: <WrenchIcon className="size-5" />,
//     subItems: [
//       { name: "Create Tools", path: "/create-tool", pro: false },
//       { name: "List Tools", path: "/list-tools", pro: false },
//     ],
//     allowedRoles: ["super-admin"],
//   },
//   {
//     name: "Companies",
//     icon: <Square3Stack3DIcon className="size-5" />,
//     subItems: [
//       { name: "Create Company", path: "/create-company", pro: false },
//       { name: "List Companies", path: "/list-companies", pro: false },
//     ],
//     allowedRoles: ["super-admin", "admin"],
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Calendar",
//     path: "/calendar",
//     allowedRoles: ["super-admin", "admin", "operator", "view-only"],
//   },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const { state } = useUser();
//   const { user, loading } = state;
//   const pathname = usePathname();
//   const role = user?.role || "view-only"; // Default to view-only if no role
//   console.log(role);
//   // Filter nav items based on user role
//   const filteredNavItems = navItems.filter((nav) =>
//     nav.allowedRoles?.includes(role)
//   );

//   const renderMenuItems = (navItems: NavItem[]) => (
//     <ul className="flex flex-col gap-4">
//       {navItems.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index)}
//               className={`menu-item group flex items-center w-full text-left focus:outline-none ${
//                 openSubmenu === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               } cursor-pointer ${
//                 !isExpanded && !isHovered && !isMobileOpen
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={`${
//                   openSubmenu === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text ml-3 flex-1">{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 href={nav.path}
//                 className={`menu-item group flex items-center w-full text-left ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text ml-3 flex-1">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 if (el) {
//                   subMenuRefs.current[index] = el; // Simplified ref key to index only
//                 }
//               }}
//               className="overflow-hidden transition-all duration-300 ease-in-out"
//               style={{
//                 height:
//                   openSubmenu === index
//                     ? `${subMenuHeight[index] || 0}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       href={subItem.path}
//                       className={`menu-dropdown-item flex items-center w-full text-left ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       <span className="flex-1">{subItem.name}</span>
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span
//                             className={`${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   const [openSubmenu, setOpenSubmenu] = useState<number | null>(null); // Index of the open submenu
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
//   const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

//   const isActive = useCallback((path: string) => path === pathname, [pathname]);

//   // Automatically open submenu if current path matches a submenu item
//   useEffect(() => {
//     console.log("Current pathname:", pathname);
//     console.log("Filtered Nav Items:", filteredNavItems);
//     let submenuMatched = false;
//     filteredNavItems.forEach((nav, index) => {
//       if (nav.subItems) {
//         nav.subItems.forEach((subItem) => {
//           if (isActive(subItem.path)) {
//             console.log(`Matched submenu: index: ${index}, path: ${subItem.path}`);
//             setOpenSubmenu(index);
//             submenuMatched = true;
//           }
//         });
//       }
//     });

//     if (!submenuMatched) {
//       console.log("No submenu matched, closing submenu");
//       setOpenSubmenu(null);
//     }
//   }, [pathname, filteredNavItems, isActive]);

//   // Calculate submenu height when opened
//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const ref = subMenuRefs.current[openSubmenu];
//       if (ref) {
//         const height = ref.scrollHeight;
//         console.log(`Setting height for index ${openSubmenu}: ${height}px`);
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [openSubmenu]: height,
//         }));
//       } else {
//         console.warn(`Ref not found for index: ${openSubmenu}`);
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number) => {
//     console.log(`Toggling submenu: index: ${index}`);
//     setOpenSubmenu((prevOpenSubmenu) => {
//       if (prevOpenSubmenu === index) {
//         console.log("Closing submenu");
//         return null;
//       }
//       console.log(`Opening submenu: index: ${index}`);
//       return index;
//     });
//   };

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link href="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <Image
//                 className="dark:hidden items-center justify-center"
//                 src="/images/logo/ACS-logo-color.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//               <Image
//                 className="hidden dark:block"
//                 src="/images/logo/ACS-logo.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <>
//               <Image
//                 className="dark:hidden items-center justify-center"
//                 src="/images/logo/ACS-logo-color.png"
//                 alt="Logo"
//                 width={32}
//                 height={32}
//               />
//               <Image
//                 className="hidden dark:block"
//                 src="/images/logo/ACS-logo.png"
//                 alt="Logo"
//                 width={32}
//                 height={32}
//               />
//             </>
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2>
//               {renderMenuItems(filteredNavItems)}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;




"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  Tools,
  UserCircleIcon,
} from "../icons/index";

import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  Square3Stack3DIcon,
  UsersIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import SidebarWidget from "./SidebarWidget";
import { useUser } from "@/context/UserContext";
// Import your authentication hook/context here.
// For example:
// import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  allowedRoles?: string[];
};

const navItems: NavItem[] = [
  {
    icon: <HomeIcon className="size-5" />,
    name: "Dashboard",
    path: "/",
    allowedRoles: ["super-admin", "admin", "operator", "view-only"],
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
    allowedRoles: ["super-admin", "admin", "operator", "view-only"],
  },
  {
    name: "Users",
    icon: <UsersIcon className="size-5" />,
    subItems: [
      { name: "Create Users", path: "/create-user", pro: false },
      { name: "List Users", path: "/list-users", pro: false },
    ],
    allowedRoles: ["super-admin", "admin"],
  },
  {
    name: "Tools",
    icon: <WrenchIcon className="size-5" />,
    subItems: [
      { name: "Create Tools", path: "/create-tool", pro: false },
      { name: "List Tools", path: "/list-tools", pro: false },
    ],
    allowedRoles: ["super-admin"],
  },
  {
    name: "Companies",
    icon: <Square3Stack3DIcon className="size-5" />,
    subItems: [
      { name: "Create Company", path: "/create-company", pro: false },
      { name: "List Companies", path: "/list-companies", pro: false },
    ],
    allowedRoles: ["super-admin", "admin"],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
    allowedRoles: ["super-admin", "admin", "operator", "view-only"],
  },
];

const AppSidebar: React.FC = () => {
  const { state } = useUser();
  const { user, loading } = state;
  const userRole = user?.role; // <-- Replace this hardcoded value!

  // Filter the nav items based on the allowedRoles property.
  const filteredNavItems = navItems.filter((nav) =>
    nav.allowedRoles?.includes(userRole!)
  );

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems &&
            (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => path === pathname,
    [pathname]
  );

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened.
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <>
              <Image
                className="dark:hidden items-center justify-center"
                src="/images/logo/ACS-logo-color.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/ACS-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <>
              <Image
                className="dark:hidden items-center justify-center"
                src="/images/logo/ACS-logo-color.png"
                alt="Logo"
                width={32}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/ACS-logo.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {(isExpanded || isHovered || isMobileOpen)
                  ? "Menu"
                  : <HorizontaLDots />}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
