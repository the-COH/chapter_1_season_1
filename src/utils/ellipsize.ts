export function middleEllipsize(str: string): string {
  if (str) {
    if (str.length > 41) {
      return (
        str.substring(0, 5) + "..." + str.substring(str.length - 5, str.length)
      );
    }
  }
  return str ?? "";
}
