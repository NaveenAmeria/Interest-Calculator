export default function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid var(--border)",
        outline: "none",
        background: "white"
      }}
    >
      {children}
    </select>
  );
}
