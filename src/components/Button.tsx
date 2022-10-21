import clsx from "clsx";

const defaultClass =
  "border border-cantoGreenDark bg-black px-6 py-1 lowercase text-cantoGreenDark hover:bg-cantoGreen hover:text-black";

const activeClass = "bg-cantoGreenDark text-black";

const importantClass = "bg-cantoGreen hover:bg-cantoGreenDark text-black";

export function Button({
  text,
  onClick,
  active,
  important,
  customClasses,
  type,
  disabled,
}: {
  text: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  active?: boolean;
  important?: boolean;
  customClasses?: string;
  disabled: boolean;
}) {
  const buttonType = type ?? "button";
  return (
    <button
      type={buttonType}
      className={clsx(
        defaultClass + " " + customClasses,
        active && activeClass,
        important && importantClass
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
