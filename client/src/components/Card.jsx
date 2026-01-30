export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        padding: 16,
        ...style
      }}
    >
      {children}
    </div>
  );
}
