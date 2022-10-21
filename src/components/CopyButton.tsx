import { useCopied } from "../hooks/useCopied";
import { ClipboardIcon } from "@heroicons/react/24/outline";
export const CopyButton = ({ value }: { value: string }) => {
  const { copy, copied } = useCopied();

  return (
    <div>
      {copied ? (
        <span className="ml-1">Copied</span>
      ) : (
        <ClipboardIcon
          onClick={() => copy(value)}
          className="mx-1 h-5 w-5 cursor-pointer hover:fill-cantoGreen hover:text-black"
        ></ClipboardIcon>
      )}
    </div>
  );
};
