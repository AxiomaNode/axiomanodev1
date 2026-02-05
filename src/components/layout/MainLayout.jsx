import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";

export default function MainLayout({ children }) {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <ThemeToggle/>
      <main className="main-content">{children}</main>
    </div>
  );
}