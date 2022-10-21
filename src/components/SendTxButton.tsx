import React from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import clsx from "clsx";

const defaultClass =
  "m-2 h-7 w-7 transform text-cantoGreen transition ease-in-out hover:scale-110 hover:fill-cantoGreen hover:duration-500";

const activeClass = "bg-cantoGreenDark text-black";
// todo: add prisma and trpc to save favorite

const SendTxButton = ({
  onClick,
  active,
}: {
  onClick?: () => void;
  active?: boolean;
}) => {
  return (
    <>
      <PaperAirplaneIcon
        className={clsx(defaultClass, active && activeClass)}
        onClick={onClick}
      />
    </>
  );
};

export default SendTxButton;
