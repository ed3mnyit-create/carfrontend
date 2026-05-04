export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 pt-32 pb-12">
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}
