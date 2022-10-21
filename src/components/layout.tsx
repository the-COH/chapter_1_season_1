import React, { Fragment } from "react";

// import {
//   HomeIcon,
//   InformationCircleIcon,
//   HeartIcon,
// } from "@heroicons/react/24/outline";

// import classNames from "../utils/classNames";
import Header from "./header";

// const navigation = [
//   { name: "My Account", href: "#", icon: HomeIcon, current: true },
//   { name: "Favorites", href: "/favorites", icon: HeartIcon, current: false },
//   { name: "About", href: "#", icon: InformationCircleIcon, current: false },
// ];

type Props = {
  children?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      {/* <div className="hidden md:fixed md:inset-y-0 md:flex md:w-44 md:flex-col">
        <div className="flex h-16 w-44 flex-shrink-0 items-center justify-center " />
        <div className="flex flex-1 flex-col overflow-y-auto border border-cantoGreenDarker">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-cantoGreenDark text-black"
                    : "text-cantoGreen  hover:text-white",
                  "group flex items-center px-2 py-2 text-sm font-medium"
                )}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? "bg-cantoGreenDark text-black"
                      : "text-cantoGreen group-hover:text-gray-300",
                    "mr-3 h-6 w-6 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div> */}

      <div className="flex flex-col md:pl-44">{children}</div>
    </>
  );
};
