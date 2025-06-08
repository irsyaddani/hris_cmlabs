import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  IconAlertCircle,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

interface AlertMessageProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  showIcon?: boolean;
  duration?: number; // in milliseconds, 0 means no auto-hide
  onClose?: () => void;
  className?: string;
}

export function AlertMessage({
  type = "info",
  title,
  message,
  showIcon = true,
  duration = 5000, // 5 seconds default
  onClose,
  className = "",
}: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Get icon based on type
  const getIcon = () => {
    if (!showIcon) return null;

    switch (type) {
      case "success":
        return <IconCircleCheck className="h-4 w-4" />;
      case "error":
        return <IconCircleX className="h-4 w-4" />;
      case "warning":
        return <IconAlertCircle className="h-4 w-4" />;
      case "info":
      default:
        return <IconInfoCircle className="h-4 w-4" />;
    }
  };

  // Get alert variant/styling based on type
  const getAlertClass = () => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600";
      case "error":
        return "border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600";
      case "info":
      default:
        return "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600";
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 w-full max-w-md animate-in slide-in-from-bottom-2 ${className}`}
    >
      <Alert className={`relative ${getAlertClass()}`}>
        {getIcon()}

        {/* Close button */}
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Close alert"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}

        <div className="pr-8">
          {title && <AlertTitle className="mb-1">{title}</AlertTitle>}
          <AlertDescription>{message}</AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

// Usage Examples:
export function AlertExamples() {
  const [alerts, setAlerts] = useState<
    Array<{ id: number; type: string; title: string; message: string }>
  >([]);

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
  ) => {
    const newAlert = {
      id: Date.now(),
      type,
      title,
      message,
    };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Alert Examples</h2>

      {/* Test buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() =>
            showAlert("success", "Success!", "Data saved successfully")
          }
          className="px-4 py-2 bg-success-main text-white rounded hover:bg-success-border"
        >
          Show Success
        </button>
        <button
          onClick={() =>
            showAlert(
              "error",
              "Error!",
              "An error occured while saving the data"
            )
          }
          className="px-4 py-2 bg-danger-main text-white rounded hover:bg-danger-border"
        >
          Show Error
        </button>
        <button
          onClick={() =>
            showAlert("warning", "Warning!", "Double check the data entered")
          }
          className="px-4 py-2 bg-warning-main text-white rounded hover:bg-warning-border"
        >
          Show Warning
        </button>
        <button
          onClick={() =>
            showAlert("info", "Info", "Informasi tambahan untuk pengguna")
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Show Info
        </button>
      </div>

      {/* Render alerts */}
      {alerts.map((alert) => (
        <AlertMessage
          key={alert.id}
          type={alert.type as "success" | "error" | "warning" | "info"}
          title={alert.title}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
          duration={5000}
        />
      ))}
    </div>
  );
}
