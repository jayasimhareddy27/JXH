import { selectContainer,clearSelectedContainer } from '@lib/redux/features/editor/slice';

/* ----------------------------------------
   Highlight & Dynamic Styles
----------------------------------------- */
export const getHighlightClass = (id, selected) => {
  const isActive = selected === id;
  return `resume-element ${isActive ? 'is-selected' : 'my-hover-effect'}`;
};



/* ----------------------------------------
   Full binder (handles clicks + styles)
export const bind = (id, designConfig, selectedContainer, dispatch, extraClasses = "") => {
  const isActive = selectedContainer === id;

  // Combining base class, state-based class, and your manual layout classes
  const finalClass = `resume-element ${isActive ? 'is-selected' : 'my-hover-effect'} ${extraClasses}`.trim();
  
  return {
    className: finalClass,
    style: designConfig?.containers?.[id]?.style || {},
    onClick: (e) => {
      e.stopPropagation();
      if(isActive){
        dispatch(clearSelectedContainer());
        return;
      }
      if (dispatch && id) {
        dispatch(selectContainer(id));
      }
      else{
        dispatch(clearSelectedContainer());
      }
    },
  };
};
   ----------------------------------------- */
export const bind = (id, designConfig, selectedContainer, dispatch, extraClasses = "") => {
  const isActive = selectedContainer === id;
  
  // 1. Get Global Styles (Page-level Theme)
  const themeStyles = designConfig?.theme || {}; 
  
  // 2. Get Specific Styles (Element-level)
  const specificStyles = designConfig?.containers?.[id]?.style || {};

  // 3. Merge: Specific overrides Global
  const mergedStyles = {
    ...themeStyles,
    ...specificStyles,
  };

  const finalClass = `resume-element ${isActive ? 'is-selected' : 'my-hover-effect'} ${extraClasses}`.trim();
  
  return {
    className: finalClass,
    style: mergedStyles, 
    onClick: (e) => {
      e.stopPropagation();
      if (isActive) {
        dispatch(clearSelectedContainer());
      } else if (dispatch && id) {
        dispatch(selectContainer(id));
      }
    },
  };
};
/* ----------------------------------------
   Dynamic style reader
----------------------------------------- */
export const getStyle = (designConfig, id) => {
  return designConfig?.containers?.[id]?.style || {};
};

