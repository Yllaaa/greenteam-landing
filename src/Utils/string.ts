export const getInitials = (name: string | null, maxLength = 2): string => {
  if (!name) return "?"
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLength)
}