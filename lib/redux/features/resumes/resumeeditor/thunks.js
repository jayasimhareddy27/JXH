import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "@lib/redux/features/toast/thunks";
import { fetchPhaseDatainJson } from "@/app/dashboard/myresumes/(components)";

/* ================================
   FETCH RESUME BY ID
   - merges designConfig into formDataMap
================================ */
export const fetchResumeById = createAsyncThunk(
  "resumes/fetchResumeById",
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/resume/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch resume");

      const resume = await response.json();

      // Ensure designConfig exists
      resume.formDataMap = resume.formDataMap || {};
      resume.formDataMap.designConfig = resume.formDataMap.designConfig || {};

      return resume;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

/* ================================
   FETCH AI DATA FOR A PHASE
   - merges data into existing formDataMap
================================ */
export const fetchAIdata_resume = createAsyncThunk(
  "resumes/fetchAIdata_resume",
  async (
    { phase, resumeText, aiAgentConfig },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      if (!resumeText) {
        throw new Error("Please upload your resume first");
      }

      if (
        !aiAgentConfig?.provider ||
        !aiAgentConfig?.model ||
        !aiAgentConfig?.ApiKey
      ) {
        throw new Error("Please configure an AI agent in settings");
      }

      const data = await fetchPhaseDatainJson(
        phase.id,
        phase.key,
        resumeText,
        aiAgentConfig,
        !!phase.arrayFieldKey
      );
      
      dispatch(
        displayToast({
          message: `AI data fetched for ${phase.title}`,
          type: "success",
        })
      );

      // Merge AI data into existing formDataMap
      const { formDataMap } = getState().resumeEditor;

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
      dispatch(
        displayToast({
          message: `Failed to fetch AI data: ${error.message}`,
          type: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

/* ================================
   SAVE RESUME
   - sends formDataMap including designConfig
================================ */
export const saveResumeById = createAsyncThunk(
  "resumes/saveResumeById",
  async ({ resumeId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { formDataMap } = getState().resumeEditor;

      // Ensure designConfig is always present
      const payload = {
        ...formDataMap,
        designConfig: formDataMap.designConfig || {},
      };

      const response = await fetch(`/api/resume/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save resume");

      const updatedResume = await response.json();

      dispatch(
        displayToast({
          message: "Resume saved successfully!",
          type: "success",
        })
      );

      return updatedResume;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);
