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
  { name: 'I´m Alive!',
    href: '/dashboard/lifeproof',
    icon: HandRaisedIcon,
  },
  {
    name: 'Create Will',
    href: '/dashboard/createwill',
    icon: DocumentTextIcon,
  },
  { name: 'Succesors',
    href: '/dashboard/successors',
    icon: UserGroupIcon
  },
  { name: 'Assets',
    href: '/dashboard/tokenassets',
    icon: CurrencyDollarIcon
  },
  { name: 'Delete Will',
    href: '/dashboard/deletewill',
    icon: TrashIcon
  },
  { name: 'Claim Will',
    href: '/dashboard/claimwill',
    icon: ArrowDownOnSquareIcon
  },
  { name: 'Execute Will',
    href: '/dashboard/executewill',
    icon: CheckBadgeIcon
  },
  { name: 'User Profile',
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
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'btn flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3',
              {
                '': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}