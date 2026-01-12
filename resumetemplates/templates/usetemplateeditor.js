export function useTemplateEditor(designConfig, selectedContainer, setSelectedContainer) {
  const getStyle = (id) => designConfig?.containers?.[id]?.style || {};

  const getHighlight = (id) => {
    const isActive = selectedContainer === id;
    
    // PAGE HIGHLIGHT
    if (id === "page") {
      return isActive 
        ? "ring-4 ring-blue-500 ring-inset z-50 transition-all duration-300 shadow-2xl" 
        : "hover:ring-4 hover:ring-blue-100 hover:ring-inset transition-all duration-300 cursor-pointer";
    }

    // ELEMENT HIGHLIGHT (Now with visible hover tint)
    return `
      relative transition-all duration-150 cursor-pointer rounded-sm
      ${isActive 
        ? "outline outline-2 outline-blue-500 outline-offset-4 ring-4 ring-blue-500/20 z-40 bg-blue-50/30" 
        : "hover:outline hover:outline-2 hover:outline-blue-300 hover:outline-offset-2 hover:bg-blue-50/50 hover:z-30"}
    `;
  };

  const select = (e, id) => {
    e.stopPropagation();
    setSelectedContainer?.(id);
  };

  const register = (id) => ({
    style: getStyle(id),
    className: getHighlight(id),
    onClick: (e) => select(e, id),
  });

  return { register };
}