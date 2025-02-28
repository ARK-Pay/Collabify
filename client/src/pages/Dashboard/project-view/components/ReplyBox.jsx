const ReplyBox = ({ message, onSendReply, onCancelReply }) => (
  <div className="bg-gray-200 p-3 rounded-lg mt-2">
    {/* Display the message creator's ID being replied to */}
    <p className="text-sm font-semibold text-gray-700">Replying to {message.creator_id}</p>

    {/* Show the content of the message being replied to */}
    <p className="text-sm text-gray-500">{message.content}</p>

    {/* Textarea for typing the reply */}
    <textarea
      value={message.content}
      onChange={(e) => onSendReply(e.target.value)}
      className="w-full border border-gray-300 p-2 mt-2 rounded-lg"
      placeholder="Type your reply..."
    />

    {/* Buttons for sending or canceling the reply */}
    <div className="flex space-x-2 mt-2">
      <button
        onClick={onSendReply} // Trigger send reply action when clicked
        className="bg-blue-950 text-white rounded-full px-6 py-2"
      >
        Send Reply
      </button>
      <button
        onClick={onCancelReply} // Trigger cancel reply action when clicked
        className="bg-gray-500 text-white rounded-full px-6 py-2"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default ReplyBox
