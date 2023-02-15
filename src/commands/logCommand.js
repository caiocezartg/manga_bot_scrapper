export function logCommand(message) {
  const chatInfo = {
    user: {
      id: message.from.id,
      name: `${message.from.first_name} ${message.from.last_name}`,
      username: message.from.username,
    },
    chat: {
      id: message.chat.id,
      message: message.text,
      date: new Date(),
    },
  };

  console.log(chatInfo);
}
