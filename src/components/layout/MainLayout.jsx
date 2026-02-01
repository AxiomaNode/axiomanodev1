import ThemeToggle from "./ThemeToggle";

export default function MainLayout({ children }) {
  return (
    <>
      <ThemeToggle />
      {children}
    </>
  );
}
