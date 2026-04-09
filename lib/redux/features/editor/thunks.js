import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "@lib/redux/features/toast/thunks";
import { fetchResumes } from "../resumes/resumecrud/thunks";
import { fetchCoverletters } from "../coverletter/coverlettercrud/thunks";
import { generateresumefromjobdata } from "./generate/resume/generateresumefromjobdata";
import { generatesuggestions } from "./generate/ats/generatescore";
import { generatecoverletterfromjobdata } from "./generate/coverletter/generatecoverletterfromjobdata";

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
export const fetchAIdataforDocument = createAsyncThunk(
  "editor/fetchAIdata",
  async ({ type, sectionIds, signal }, { dispatch, getState, rejectWithValue }) => {
    try {
     const state = getState();
      const { currentJob } = state.jobsStore;
      const { allResumes, aiResumeRef } = state.resumecrud;
      const { aiAgent } = state;
      const { formDataMap } = state.editor;
      console.log(type);
      console.log(sectionIds);
      
      const selectedResume = allResumes.find(r => r._id === aiResumeRef) || allResumes[0];

      if (!selectedResume) return rejectWithValue("No Source Resume selected.");

      let generateTask;

      if (type === "ats") {
        if (!currentJob) return rejectWithValue("Select a job to analyze.");
        generateTask = () => generatesuggestions(aiAgent,formDataMap, currentJob, signal);
      } else if (type === "resume") {
        generateTask = generateresumefromjobdata(aiAgent, sectionIds, currentJob,    selectedResume, dispatch, displayToast, signal);
      } else {
        generateTask = generatecoverletterfromjobdata(aiAgent, sectionIds, currentJob, selectedResume, dispatch, displayToast, signal);
      }

      const result = await generateTask();

      // 4. Refresh the data to show the new AI content
      if (type === "resume") {
        await dispatch(fetchResumes()).unwrap();
        dispatch(displayToast({   message: `New tailored ${type === "resume" ? "resume" : "cover letter"} created!`,   type: "success" }));
      }
      else if (type === "coverletter") {
        await dispatch(fetchCoverletters()).unwrap();
        dispatch(displayToast({   message: `New tailored ${type === "resume" ? "resume" : "cover letter"} created!`,   type: "success" }));
      }
      else {
        dispatch(displayToast({   message: `ATS suggestions created!`,   type: "success" }));
      }
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
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