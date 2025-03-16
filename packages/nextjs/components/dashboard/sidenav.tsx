import NavLinks from './nav-links';

export default function SideNav() {
  return (
      <div className="flex grow flex-row justify-between space-x-2 w-full h-full p-2">
        <NavLinks />
      </div>
  );
}
