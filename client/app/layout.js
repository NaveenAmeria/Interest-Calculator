import "../styles/globals.css";
import Navbar from "../components/Navbar";

export const metadata = { title: "Interest Calculator WebApp" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
