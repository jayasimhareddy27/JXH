import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectContainer } from '@lib/redux/features/editor/slice';
import { bind } from '@/app/editor/(shared)/editorstyles';

export const useResumeLogic = (IDS, layoutGrid) => {
  const dispatch = useDispatch();
  const [contentHeight, setContentHeight] = useState(0);

  const formDataMap = useSelector((state) => state.editor.formDataMap, shallowEqual);

  useEffect(() => {

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
    educationHistory: formDataMap.educationHistory || [],
    workExperience: formDataMap.workExperience || [],
    projects: formDataMap.projects || [],
    certifications: formDataMap.certifications || [],
    skillsSummary: formDataMap.skillsSummary || {},
    careerSummary: formDataMap.careerSummary || {},
    sectionTitles: formDataMap.sectionTitles || [],
    
    // Spread the rest
    ...formDataMap,
    
    getBind,
    handleDeselect,
    contentHeight,
    layoutKey,
    gridClass: layoutGrid[layoutKey] || layoutGrid.primary,
    designConfig,
    loading: false
  };
};