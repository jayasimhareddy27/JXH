import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "@lib/redux/features/toast/thunks";

/* ================================
   FETCH COVER LETTER BY ID
================================ */
export const fetchCoverLetterById = createAsyncThunk(
  "coverletterEditor/fetchCoverLetterById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/coverletter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cover letter");

      const data = await response.json();
      return data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

/* ================================
   SAVE COVER LETTER (Design Only)
================================ */
export const saveCoverLetterById = createAsyncThunk(
  "coverletterEditor/saveCoverLetterById",
  async ({ id }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { formDataMap } = getState().coverletterEditor;

      // We send the designConfig inside the formDataMap as per your requirement
      const payload = {
        designConfig: formDataMap.designConfig,
      };

      const response = await fetch(`/api/coverletter/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save cover letter layout");

      const updatedData = await response.json();

      dispatch(
        displayToast({
          message: "Layout saved successfully!",
          type: "success",
        })
      );

      return updatedData;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);