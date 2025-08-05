

const huggingFaceModels = [
  { label: 'LLaMA 3.3 70B (Hyperbolic)', value: 'meta-llama/Llama-3.3-70B-Instruct:hyperbolic' },
  { label: 'LLaMA 3.2 3B (Hyperbolic)', value: 'meta-llama/Llama-3.2-3B-Instruct:hyperbolic' },
  { label: 'LLaMA 3.1 8B (Novita)', value: 'meta-llama/Llama-3.1-8B-Instruct:novita' },
  { label: 'LLaMA 4 Scout 17B (Novita)', value: 'meta-llama/Llama-4-Scout-17B-16E-Instruct:novita' },
];

const geminiModels = [
  { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
  { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
  { label: 'Gemini Pro', value: 'gemini-pro' },
];


const Companyname= "JobxHunter";
const Companylogo = "https://jobxhunter.com/logo.png";
const Companyemail = "jayasimhareddy27@gmail.com"
const Companyphone = "+1 4059569992";
const Companyaddress = "3785 gabrielle lane, aurora, IL 60504";
const Companydescription = "JobXHunter is a leading job portal connecting job seekers with top employers. We provide a platform for job listings, applications, and career resources to help individuals find their dream jobs.";
const Companywebsite = "https://jobxhunter.com";
const Companysocials = {
  facebook: "https://www.facebook.com/jobxhunter",
  twitter: "https://twitter.com/jobxhunter",
  linkedin: "https://www.linkedin.com/company/jobxhunter",
  instagram: "https://www.instagram.com/jobxhunter",
};
const Companyterms = "https://jobxhunter.com/terms";
const Companyprivacy = "https://jobxhunter.com/privacy";
const Companyshortname = "JxH";
const Companynameletters = ["J", "x", "H"];

export {
  Companyname,
  Companylogo,
  Companyemail,
  Companyphone,
  Companyaddress,
  Companydescription,
  Companywebsite,
  Companysocials,
  Companyterms,
  Companyprivacy,
  Companyshortname,
  Companynameletters,

  MONGODB_URI,

  geminiModels,
  huggingFaceModels

}