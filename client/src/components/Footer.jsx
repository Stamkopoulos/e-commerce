export default function Footer() {
  return (
    <footer className="bottom-0 w-full bg-white border-t border-gray-200 p-4">
      <div className="text-sm text-gray-700">
        VOUTS&copy;{new Date().getFullYear()}
      </div>
    </footer>
  );
}
