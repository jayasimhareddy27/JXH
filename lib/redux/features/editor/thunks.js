import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "@lib/redux/features/toast/thunks";
import { fetchPhaseDatainJson } from "@/app/editor/(shared)/index.js";

/* ================================
   FETCH DOCUMENT BY ID (CV or CL)
================================ */
export const fetchDocumentById = createAsyncThunk(
  "editor/fetchDocumentById",
  async ({ id, type }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // Dynamically select endpoint based on type: 'resume' or 'coverletter'
      const endpoint = type === "resume" ? `/api/resume/${id}` : `/api/coverletter/${id}`;

      const response = await fetch(endpoint, {headers: {  Authorization: `Bearer ${token}`,},});

      if (!response.ok) throw new Error(`Failed to fetch ${type}`);

      const document = await response.json();
      return { ...document, type }; // Include type to help the reducer update state.type
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

/* ================================
   FETCH AI DATA FOR A PHASE
================================ */
export const fetchAIdata = createAsyncThunk("editor/fetchAIdata",async ({ token,phase, aiAgentConfig },{ dispatch, getState, rejectWithValue }) => {
    try {
      const aiResumeRef = getState().resumecrud.aiResumeRef
      const response = await fetch(`/api/resume/${aiResumeRef}`, {headers: {  Authorization: `Bearer ${token}`,},});
      const aiResumeRefFormdataMap = await response.json();      
      const referenceText = aiResumeRefFormdataMap?.resumetextAireference || "";
      if(referenceText.trim().length===0){
        dispatch(displayToast({ message: "AI Resume reference text is  empty. Please generate it first.", type: "error" }));  
        return {
          phaseKey: phase.key,
          formDataMap: getState().editor.formDataMap,
        }   
      }
      if (!aiAgentConfig?.provider || !aiAgentConfig?.model || !aiAgentConfig?.ApiKey) {  throw new Error("Please configure an AI agent in settings");}

      const data = await fetchPhaseDatainJson(phase.id,phase.key,referenceText,aiAgentConfig,!!phase.arrayFieldKey);
      
      dispatch(  displayToast({  message: `AI data generated for ${phase.title}`,  type: "success",}));

      // Access the unified 'editor' slice state
      const { formDataMap } = getState().editor;

      return {
        phaseKey: phase.key,
        data,
        formDataMap: {
          ...formDataMap,
          [phase.key]: data,
          designConfig: formDataMap.designConfig || {},
        },
      };
    } catch (error) {
      dispatch(  displayToast({  message: `AI fetch failed: ${error.message}`,  type: "error",}));
      return rejectWithValue(error.message);
    }
  }
);

/* ================================
   SAVE DOCUMENT (CV or CL)
================================ */
export const saveDocumentById = createAsyncThunk(
  "editor/saveDocumentById",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { activeId, type, formDataMap } = getState().editor;

      if (!activeId || !type) throw new Error("Missing document ID or type");

      const endpoint = type === "resume" ? `/api/resume/${activeId}` : `/api/coverletter/${activeId}`;

      // Ensure designConfig and core document map are structured correctly
      const payload = {...formDataMap,designConfig: formDataMap.designConfig || {},};

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {  "Content-Type": "application/json",  Authorization: `Bearer ${token}`,},
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to save ${type}`);

      const updatedDocument = await response.json();

      dispatch(displayToast({message: `${type === "resume" ? "Resume" : "Cover Letter"} saved successfully!`,type: "success",}));

      return updatedDocument;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);