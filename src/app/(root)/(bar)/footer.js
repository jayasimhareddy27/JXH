import { Companyname } from "@/globalvar/companydetails";
import Link from "next/link";


const Footer = () => {
  return (
    <footer
      id="about"
      className="py-6 text-center bg-[color:var(--color-background-primary)] border-t border-[color:var(--color-border-primary)]"
    >
            <div className="flex flex-col gap-2 items-center">
        
        <div className="flex gap-4 text-sm">
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>
        </div>

        <p className="text-[color:var(--color-text-secondary)] text-sm select-none">
          &copy; {new Date().getFullYear()} {Companyname}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
