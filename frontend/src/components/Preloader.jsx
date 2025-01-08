export default function Preloader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 h-12 w-12" />
      </div>
    </div>
  );
}
