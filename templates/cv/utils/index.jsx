export const renderRichText = (text, listStyles = "leading-relaxed text-justify [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1") => {
  if (!text) return null;
  const isList = typeof text === "string" && /<ul|<ol|<li/.test(text);

  if (isList) {
    return (  <div   className={` ${listStyles}`}  dangerouslySetInnerHTML={{ __html: text }} />);
  }
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

export const getSectionTitle = (sectionTitles, key, defaultTitle) => {
  const section = sectionTitles?.find(s => s.key === key);
  return section?.title ? renderRichText(section.title) : defaultTitle;
};

export const Visible = ({ id, designConfig, children }) => {
  const visibility = designConfig?.visibility || {};
  if (visibility[id] === false) return null;

  const customHref = designConfig?.containers?.[id]?.style?.href;
  if (customHref?.trim()) {
    return (  <a href={customHref.startsWith('http') ? customHref : `https://${customHref}`} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-dotted">  {children}</a>);
  }
  return children;
};