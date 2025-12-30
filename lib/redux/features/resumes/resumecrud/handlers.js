// GENERIC
export const handlePending = (state) => {
  state.loading = "loading";
  state.error = null;
};

export const handleRejected = (state, action) => {
  state.loading = "failed";
  state.error = action.error?.message || "Something went wrong";
};

// SPECIFIC
export const handleFetchResumesFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.allResumes = action.payload.resumes;
  state.primaryResumeId = action.payload.primaryResumeId;

  if (action.payload.references) {
    state.aiResumeRef = action.payload.references.aiResumeRef;
    state.myProfileRef = action.payload.references.myProfileRef;
  }
};

export const handleCreateResumeFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.allResumes.push(action.payload);
};

export const handleUploadAIRefFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.aiResumeRef = action.payload._id;
  state.allResumes.push(action.payload);
};

export const handleDeleteResumeFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.allResumes = state.allResumes.filter(
    (r) => r._id !== action.payload
  );
};

export const handleCopyResumeFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.allResumes.push(action.payload);
};

export const handleMakePrimaryFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.primaryResumeId = action.payload;
};

export const handleMarkAIPrimaryFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.aiResumeRef = action.payload;
};

export const handleMarkProfileFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.myProfileRef = action.payload;
};

export const handleReturnUseReferenceFulfilled = (state, action) => {
  state.loading = "succeeded";
  const { references } = action.payload;

  if (references) {
    state.primaryResumeId = references.primaryResumeRef || null;
    state.aiResumeRef = references.aiResumeRef || null;
    state.myProfileRef = references.myProfileRef || null;
  }
};
