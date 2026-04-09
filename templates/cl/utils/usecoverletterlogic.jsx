import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRef, useEffect, useState } from 'react';
import { selectContainer } from '@lib/redux/features/editor/slice';
import { bind } from '@/app/editor/(shared)/editorstyles';

export const useCoverletterLogic = (IDS, layoutGrid) => {
  const dispatch = useDispatch();
  const coverletterRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const formDataMap = useSelector((state) => state.editor.formDataMap, shallowEqual);

  useEffect(() => {
    if (coverletterRef.current) {
      setContentHeight(coverletterRef.current.offsetHeight);
    }
  }, [formDataMap]);
  
  if (!formDataMap) return { loading: true };

  const { designConfig = {} } = formDataMap;
  const layoutKey = designConfig.layout || 'primary';
  
  const getBind = (id, classes = "") => 
    bind(id, designConfig, designConfig.selectedContainer, dispatch, classes);

  const handleDeselect = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(selectContainer(null));
    }
  };
  
return {
    // Provide defaults for all major sections to prevent "undefined" crashes
    personalInformation: formDataMap.personalInformation || {},
    onlineProfiles: formDataMap.onlineProfiles || {},
    recipientInformation: formDataMap.recipientInformation || {},
    letterMeta: formDataMap.letterMeta || {},
    letterContent: formDataMap.letterContent || {},
    bodyParagraphs: formDataMap.bodyParagraphs || [],
    signOff: formDataMap.signOff || {},
    
    // Spread the rest
    ...formDataMap,
    
    getBind,
    handleDeselect,
    coverletterRef,
    contentHeight,
    layoutKey,
    gridClass: layoutGrid[layoutKey] || layoutGrid.primary,
    designConfig,
    loading: false
  };
};