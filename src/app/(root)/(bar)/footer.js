import { Companyname } from "@/globalvar/companydetails";


const Footer = () => {
  return (
    <footer
      id="about"
      className="py-6 text-center bg-[color:var(--color-background-primary)] border-t border-[color:var(--color-border-primary)]"
    >
      <div>
        <p className="text-[color:var(--color-text-secondary)] text-sm select-none">
          &copy; {new Date().getFullYear()} {Companyname}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
