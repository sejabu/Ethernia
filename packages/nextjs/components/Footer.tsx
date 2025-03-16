import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer>
      <div className="border-t border-base-300">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col justify-between">
            <Link href="/" passHref className="flex items-center gap-5 mr-6 shrink-0">
              <div className="flex relative w-10 h-10">
                <Image alt="Ethernia logo" className="cursor-pointer" fill src="/favicon.png" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold leading-tight">ETHERNIA</span>
                <span className="text-xs">Digital Inheritance Made Easy!</span>
              </div>
            </Link>
          </div>
          
          <div className="justify-between items-center">
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="justify-between items-center">
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary">Documentation</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Help Center</Link></li>
            </ul>
          </div>

          <div className="justify-between items-center">
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <FaTwitter size={20} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <FaDiscord size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </div>
        </div>
        </div>

        <div className="container mx-auto mt-2 text-left text-sm">
          <p>&copy; {new Date().getFullYear()} ETHERNIA. Made with ❤ for the Scroll Open Hackaton.</p>
        </div>
      
    </footer>
  );
}