'use client';

import {
  UserGroupIcon,
  HandRaisedIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TrashIcon,
  UserCircleIcon,
  ArrowDownOnSquareIcon,
  WindowIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Dashboard',
    href: '/dashboard',
    icon: WindowIcon,
  },
  {
    name: 'Create Will',
    href: '/dashboard/createwill',
    icon: DocumentTextIcon,
  },
  { name: 'Modify Will',
    href: '/dashboard/modify',
    icon: UserGroupIcon
  },
  { name: 'Claim/Execute Will',
    href: '/dashboard/claimwill',
    icon: ArrowDownOnSquareIcon
  },
  { name: 'Register/Update User Info',
    href: '/dashboard/useraccount',
    icon: UserCircleIcon
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link role="tab"
            key={link.name}
            href={link.href}
            className={clsx(
              'tab',
              {
                'tab tab-active': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <span className="hidden lg:block">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}