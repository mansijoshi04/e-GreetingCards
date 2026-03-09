export default function CardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="w-96 h-64 bg-white rounded-xl shadow-lg animate-pulse" />
    </div>
  );
}
