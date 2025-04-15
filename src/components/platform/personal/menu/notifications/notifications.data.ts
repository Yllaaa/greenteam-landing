export type NotificationItem = {
  title: string;
  description: string;
};

// export async function getNotificationItems(): Promise<NotificationItem[]> {
export function getNotificationItems() {
  return [
    {
      title: "Notification 1",
      description: "Notification Description",
    },
    {
      title: "Notification 1",
      description: "Notification Description",
    },
    {
      title: "Notification 1",
      description: "Notification Description",
    },
  ];
}
