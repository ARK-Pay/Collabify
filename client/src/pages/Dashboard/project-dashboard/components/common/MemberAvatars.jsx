export const MemberAvatars = ({ count }) => {
    const maxVisible = 5;
    const getAvatarUrl = (index) => `https://i.pravatar.cc/32?img=${index}`;
  
    return (
      <div className="flex -space-x-2">
        {[...Array(Math.min(maxVisible, count))].map((_, index) => (
          <img
            key={index}
            src={getAvatarUrl(index + 1)}
            alt={`Member ${index + 1}`}
            className="w-7 h-7 rounded-full border-2 border-white"
          />
        ))}
        {count > maxVisible && (
          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm text-gray-600">
            +{count - maxVisible}
          </div>
        )}
      </div>
    );
  };