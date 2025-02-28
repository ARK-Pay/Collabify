export const ErrorMessage = ({ message }) => (
    <div className="p-4 text-red-500 text-center">
      <p>{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 text-blue-500 underline"
      >
        Try again
      </button>
    </div>
  );