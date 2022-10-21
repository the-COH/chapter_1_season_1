import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface ShowPrimaryProps {
  primaryName: object;
}

const ShowPrimaryCNS: React.FC<ShowPrimaryProps> = (props) => {
  return (
    <div className=" border border-cantoGreenDark text-cantoGreen">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between p-2">
              <>
                Primary CNS Name: {props.primaryName}
                <ChevronRightIcon
                  className={
                    open
                      ? "h-6 w-6 rotate-90 transform text-cantoGreenDarker"
                      : " h-6 w-6 text-cantoGreenDarker"
                  }
                />
              </>
            </Disclosure.Button>

            <Disclosure.Panel className="text-cantoGreenDark">
              <p className="m-1 p-2 text-sm font-extralight">
                This designates one of your CNS names to represent your address
                and act as your cross-platform web3 username and profile. You
                can only have one Primary CNS Name per address and can change it
                at any time.
              </p>

              <p className="m-1 p-2 text-sm font-medium text-cantoGreen">
                * indicates the name is set as your primary
              </p>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default ShowPrimaryCNS;
