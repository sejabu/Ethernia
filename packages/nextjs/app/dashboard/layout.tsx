import SideNav from '~~/components/dashboard/sidenav';
import { Header } from "~~/components/dashboard/header";

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div><Header />
      <div className={`flex flex-col min-h-screen `}>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <SideNav />
          </div>
          <div className="flex-grow p-6 md:overflow md:p-12 custom-scrollbar">{children}</div>
        </div>
      </div>
    </div>
  );
}