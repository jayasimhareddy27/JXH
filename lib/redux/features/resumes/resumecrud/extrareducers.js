import {
  fetchResumes,
  createResume,
  deleteResume,
  copyResume,
  uploadResume_AI_Ref,
  makePrimaryResume,
  markAIPrimaryResume,
  markProfileResume,
  returnuseReference
} from "./thunks";

import * as h from "./handlers";

export const resumecrudExtraReducers = (builder) => {
  builder
    // FETCH RESUMES
    .addCase(fetchResumes.pending, h.handlePending)
    .addCase(fetchResumes.fulfilled, h.handleFetchResumesFulfilled)
    .addCase(fetchResumes.rejected, h.handleRejected)

    // CREATE
    .addCase(createResume.pending, h.handlePending)
    .addCase(createResume.fulfilled, h.handleCreateResumeFulfilled)
    .addCase(createResume.rejected, h.handleRejected)

    // UPLOAD AI REF
    .addCase(uploadResume_AI_Ref.pending, h.handlePending)
    .addCase(uploadResume_AI_Ref.fulfilled, h.handleUploadAIRefFulfilled)
    .addCase(uploadResume_AI_Ref.rejected, h.handleRejected)

    // DELETE
    .addCase(deleteResume.pending, h.handlePending)
    .addCase(deleteResume.fulfilled, h.handleDeleteResumeFulfilled)
    .addCase(deleteResume.rejected, h.handleRejected)

    // COPY
    .addCase(copyResume.pending, h.handlePending)
    .addCase(copyResume.fulfilled, h.handleCopyResumeFulfilled)
    .addCase(copyResume.rejected, h.handleRejected)

    // MAKE PRIMARY
    .addCase(makePrimaryResume.pending, h.handlePending)
    .addCase(makePrimaryResume.fulfilled, h.handleMakePrimaryFulfilled)
    .addCase(makePrimaryResume.rejected, h.handleRejected)

    // MARK AI PRIMARY
    .addCase(markAIPrimaryResume.pending, h.handlePending)
    .addCase(markAIPrimaryResume.fulfilled, h.handleMarkAIPrimaryFulfilled)
    .addCase(markAIPrimaryResume.rejected, h.handleRejected)

    // MARK PROFILE
    .addCase(markProfileResume.pending, h.handlePending)
    .addCase(markProfileResume.fulfilled, h.handleMarkProfileFulfilled)
    .addCase(markProfileResume.rejected, h.handleRejected)

    // RETURN REFERENCES
    .addCase(returnuseReference.pending, h.handlePending)
    .addCase(returnuseReference.fulfilled, h.handleReturnUseReferenceFulfilled)
    .addCase(returnuseReference.rejected, h.handleRejected);
};
