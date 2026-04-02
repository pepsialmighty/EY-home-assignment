interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm">
      {message}
    </div>
  );
}
