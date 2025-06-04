import { Footer } from "./footer";
import { Header } from "./header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto flex flex-1 flex-col gap-2">
        <div className="p-2">{children}</div>
      </div>
    </>
  );
}
