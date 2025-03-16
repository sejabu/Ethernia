import SideNav from '~~/components/dashboard/sidenav';
import { Header } from "~~/components/dashboard/header";

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'><Header />
      <div className="flex-grow p-1 pt-24 pb-12 md:pt-32 md:pb-20 custom-scrollbar">{children}</div>
    
    </div>
  );
}