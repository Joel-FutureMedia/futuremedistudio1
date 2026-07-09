import Nav from "./Nav";
import Footer from "./Footer";

export default function PageShell({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-[#313e4a] text-white ${className}`}>
      <Nav />
      <main className="pt-[4.75rem] md:pt-[5rem]">{children}</main>
      <Footer />
    </div>
  );
}
