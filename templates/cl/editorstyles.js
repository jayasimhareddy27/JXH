import { selectContainer,clearSelectedContainer } from '@lib/redux/features/resumes/resumeeditor/slice';

/* ----------------------------------------
   Highlight & Dynamic Styles
----------------------------------------- */
export const getHighlightClass = (id, selected) => {
  const isActive = selected === id;
  return `resume-element ${isActive ? 'is-selected' : 'my-hover-effect'}`;
};

/* ----------------------------------------
   Full binder (handles clicks + styles)
----------------------------------------- */
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
/* ----------------------------------------
   Dynamic style reader
----------------------------------------- */
export const getStyle = (designConfig, id) => {
  return designConfig?.containers?.[id]?.style || {};
};

