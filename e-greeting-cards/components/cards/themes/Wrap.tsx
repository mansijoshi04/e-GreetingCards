export default function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {children}
    </div>
  );
}
