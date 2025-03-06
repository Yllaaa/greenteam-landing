/* eslint-disable @typescript-eslint/no-explicit-any */
export async function sendMessage(
    socket: any, 
    personId: string, 
    message: string
  ) {
    if (!socket?.connected || !message.trim() || !personId) return;
  
    const messageData = {
      content: message,
      recipient: { id: personId, type: "user" },
    };
  
    console.log("📤 Sending message:", messageData);
  
    return new Promise((resolve, reject) => {
      socket.emit("sendMessage", messageData, (response: any) => {
        if (response?.success) {
          console.log("✅ Message sent successfully:", response);
          resolve(response);
        } else {
          console.error("❌ Failed to send message:", response?.error);
          reject(response?.error);
        }
      });
    });
  }