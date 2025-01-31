export function formatMessageTime(date) {
  return new Date(date).toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hout12: false,
  });
}
