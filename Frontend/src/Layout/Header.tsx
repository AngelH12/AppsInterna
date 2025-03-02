import React, { useEffect } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import NotificationDropdown from "Common/NotificationDropdown";
import { Dropdown } from "Common/Components/Dropdown";
import { changeLeftsidebarSizeType } from "slices/thunk";
import { useLogout } from "hooks";
import { useSessionStore } from "Common/Stores";
import { motion } from 'framer-motion';

const Header = ({ handleToggleDrawer, handleDrawer }: any) => {
  const dispatch = useDispatch<any>();


  const { session } = useSessionStore();
  const { logout } = useLogout();

  const selectLayoutState = (state: any) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout: any) => ({
      layoutSidebarSizeType: layout.layoutSidebarSizeType,
      layoutType: layout.layoutType,
    })
  );

  const { layoutSidebarSizeType, layoutType } = useSelector(
    selectLayoutProperties
  );

  const handleTopbarHamburgerIcon = () => {
    var windowSize = document.documentElement.clientWidth;
    let sidebarOverlay = document.getElementById("sidebar-overlay") as any;

    if (windowSize < 768) {
      document.body.classList.add("overflow-hidden");
      if (sidebarOverlay.classList.contains("hidden")) {
        sidebarOverlay.classList.remove("hidden");
        (document as Document | any)
          .querySelector(".app-menu")
          .classList.remove("hidden");
      } else {
        sidebarOverlay.classList.add("hidden");
        (document as Document | any)
          .querySelector(".app-menu")
          .classList.add("hidden");
      }
      dispatch(changeLeftsidebarSizeType("lg"));
    } else {
      dispatch(
        changeLeftsidebarSizeType(layoutSidebarSizeType === "sm" ? "lg" : "sm")
      );
    }
  };

  useEffect(() => {
    // resize
    const handleResizeLayout = () => {
      var windowSize = document.documentElement.clientWidth;

      if (windowSize < 768) {
        dispatch(changeLeftsidebarSizeType("lg"));
      } else if (windowSize <= 1024) {
        if (layoutType === "vertical") {
          dispatch(changeLeftsidebarSizeType("sm"));
        } else {
          dispatch(changeLeftsidebarSizeType("lg"));
        }
      } else {
        dispatch(changeLeftsidebarSizeType("lg"));

      }
    };

    const outerSideElement = () => {
      var windowSize = document.documentElement.clientWidth;
      var sidebarOverlay = document.getElementById("sidebar-overlay") as any;
      if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", () => {
          if (!sidebarOverlay.classList.contains("hidden")) {
            if (windowSize <= 768) {
              document?.querySelector(".app-menu")?.classList.add("hidden");
              document.body.classList.remove("overflow-hidden");
              sidebarOverlay.classList.add("hidden");
            } else {
              dispatch(changeLeftsidebarSizeType("lg"));
            }
          }
        });
      }
    };

    const scrollNavigation = () => {
      var scrollUp = document.documentElement.scrollTop;
      if (scrollUp >= 50) {
        document.getElementById("page-topbar")?.classList.add("is-sticky");
      } else {
        document.getElementById("page-topbar")?.classList.remove("is-sticky");
      }
    };

    window.addEventListener("scroll", scrollNavigation, true);
    window.addEventListener("click", outerSideElement);
    window.addEventListener("resize", handleResizeLayout);

    return () => {
      window.removeEventListener("scroll", scrollNavigation, true);
      window.removeEventListener("click", outerSideElement);
      window.removeEventListener("resize", handleResizeLayout);
    };
  }, [layoutType, dispatch]);

  return (
    <React.Fragment>
      <header
        id="page-topbar"
        className="ltr:md:left-vertical-menu rtl:md:right-vertical-menu group-data-[sidebar-size=md]:ltr:md:left-vertical-menu-md group-data-[sidebar-size=md]:rtl:md:right-vertical-menu-md group-data-[sidebar-size=sm]:ltr:md:left-vertical-menu-sm group-data-[sidebar-size=sm]:rtl:md:right-vertical-menu-sm group-data-[layout=horizontal]:ltr:left-0 group-data-[layout=horizontal]:rtl:right-0 fixed right-0 z-[1000] left-0 print:hidden group-data-[navbar=bordered]:m-4 group-data-[navbar=bordered]:[&.is-sticky]:mt-0 transition-all ease-linear duration-300 group-data-[navbar=hidden]:hidden group-data-[navbar=scroll]:absolute group/topbar group-data-[layout=horizontal]:z-[1004]"
      >
        <div className="layout-width">
          <div className="flex items-center px-4 mx-auto bg-topbar border-b-2 border-topbar group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-brand shadow-md h-header shadow-slate-200/50 group-data-[navbar=bordered]:rounded-md group-data-[navbar=bordered]:group-[.is-sticky]/topbar:rounded-t-none group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:border-zink-700 dark:shadow-none group-data-[topbar=dark]:group-[.is-sticky]/topbar:dark:shadow-zink-500 group-data-[topbar=dark]:group-[.is-sticky]/topbar:dark:shadow-md group-data-[navbar=bordered]:shadow-none group-data-[layout=horizontal]:group-data-[navbar=bordered]:rounded-b-none group-data-[layout=horizontal]:shadow-none group-data-[layout=horizontal]:dark:group-[.is-sticky]/topbar:shadow-none">
            <div className="flex items-center w-full group-data-[layout=horizontal]:mx-auto group-data-[layout=horizontal]:max-w-screen-2xl navbar-header group-data-[layout=horizontal]:ltr:xl:pr-3 group-data-[layout=horizontal]:rtl:xl:pl-3">
              <button
                onClick={handleTopbarHamburgerIcon}
                type="button"
                className="inline-flex relative justify-center items-center p-0 text-topbar-item transition-all size-[37.5px] duration-75 ease-linear bg-topbar rounded-md btn hover:bg-slate-100 group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-dark group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-brand group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:text-zink-200 group-data-[topbar=dark]:dark:border-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[layout=horizontal]:flex group-data-[layout=horizontal]:md:hidden hamburger-icon"
                id="topnav-hamburger-icon"
              >
                <ChevronsLeft className="w-5 h-5 group-data-[sidebar-size=sm]:hidden" />
                <ChevronsRight className="hidden w-5 h-5 group-data-[sidebar-size=sm]:block" />
              </button>

              <div className="flex gap-3 ms-auto">

                <NotificationDropdown />

                <Dropdown className="relative flex items-center h-header">
                  <Dropdown.Trigger
                    type="button"
                    className="inline-block p-0 transition-all duration-200 ease-linear bg-topbar rounded-full text-topbar-item dropdown-toggle btn hover:bg-topbar-item-bg-hover hover:text-topbar-item-hover group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[topbar=dark]:dark:text-zink-200"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                  >
                    <div className="flex justify-center items-center">
                      <motion.div
                        className="bg-pink-100 rounded-full p-1"
                        animate={{ scale: [1, 1.15, 1] }} 
                        transition={{
                          repeat: Infinity,
                          duration: 1.3,
                          ease: "easeInOut", 
                        }}                     
                         >
                        <img
                          src="https://img.freepik.com/foto-gratis/renderizacion-3d-nino-que-lleva-gorra-letra-r_1142-40523.jpg?t=st=1737079743~exp=1737083343~hmac=cbc081f9b3cf496a5ab5752cc3b230118dee544598e7f4a7097525544fdecb48&w=900"
                          alt="Avatar"
                          className="size-[37.5px] rounded-full"
                        />
                      </motion.div>
                    </div>
                  </Dropdown.Trigger>
                  <Dropdown.Content
                    placement="right-end"
                    className="absolute z-50 p-4 ltr:text-left rtl:text-right bg-white rounded-md shadow-md !top-4 dropdown-menu min-w-[14rem] dark:bg-zink-600"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <ul>
                      <li className=" dark:border-zink-500">
                        <button
                          className="block ltr:pr-4 rtl:pl-4 py-1.5 text-base font-medium transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:text-custom-500 focus:text-custom-500 dark:text-zink-200 dark:hover:text-custom-500 dark:focus:text-custom-500"

                          onClick={logout}

                        >
                          <LogOut className="inline-block size-4 ltr:mr-2 rtl:ml-2"></LogOut>{" "}
                          Cerrar Sessión
                        </button>
                      </li>
                    </ul>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;