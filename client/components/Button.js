export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        background: "var(--brand)",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "10px 14px",
        cursor: "pointer",
        fontWeight: 700
      }}
    >
      {children}
    </button>
  );
}
