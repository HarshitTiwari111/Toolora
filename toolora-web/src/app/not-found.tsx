import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="site flex min-h-screen flex-1 flex-col">
    <Header />
    <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 sm:px-6 lg:px-10 py-20 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-medium text-white">
        Back to home
      </Link>
    </main>
    <Footer />
    </div>
  );
}
