import { Companynameletters } from "@/globalvar/companydetails";

export default function InlineLoader() {
  return (
    <div className="inline-loading-container">
      <div className="loader">
        <span className="letter" style={{ animationDelay: '0s' }}>{Companynameletters[0]}</span>
        <span className="letter" style={{ animationDelay: '0.2s' }}>{Companynameletters[1]}</span>
        <span className="letter" style={{ animationDelay: '0.4s' }}>{Companynameletters[2]}</span>
      </div>
    </div>
  );
}
