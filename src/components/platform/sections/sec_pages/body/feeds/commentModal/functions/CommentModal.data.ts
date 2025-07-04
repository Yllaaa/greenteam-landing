export function formatTimeDifference(targetDate: string): string {
  // Convert the target date string to a Date object
  const target = new Date(targetDate);
  const now = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = now.getTime() - target.getTime();

  // Convert milliseconds to seconds
  const differenceInSeconds = Math.floor(differenceInMs / 1000);

  // Format the difference
  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}S`; // Seconds
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes}m`; // Minutes
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours}hr`; // Hours
  } else {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days}D`; // Days
  }
}
