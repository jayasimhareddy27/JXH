import { Spinner } from "@components/icons";

// UploadButton component
const UploadButton = ({ onClick, disabled, isProcessing }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="form-button w-full p-3"
  >
    {isProcessing ? (
      <Spinner className="inline-block h-6 w-6 animate-spin" />
    ) : (
      'Select Resume File'
    )}
  </button>
);

export default UploadButton;