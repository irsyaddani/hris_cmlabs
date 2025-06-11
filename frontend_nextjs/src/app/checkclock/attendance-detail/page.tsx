"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FilePreviewDialog } from "@/components/dialogs/file-preview-dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { IconEye, IconFile } from "@tabler/icons-react";
import DownloadButton from "@/components/ui/download-button";
import axios from "axios";

interface AttendanceData {
  id: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  clock_in?: string | null;
  clock_out?: string | null;
  workHours?: { hours: number; minutes: number } | null;
  type?: string;
  reason?: string;
  proofFile?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  } | null;
  start_date?: string;
  end_date?: string;
  status_approval?: string;
  employee: {
    firstName: string;
    lastName: string;
    position: string;
  };
}

const updateApproval = async (
  id: string,
  status: string,
  router: ReturnType<typeof useRouter>
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token undefined. Please login again.");
      return;
    }

    const response = await axios.put(
      `http://localhost:8000/api/checkclock/approval/${id}`,
      { status_approval: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Approval updated: ${status}`, response.data);
    router.refresh(); // Use router.refresh() instead of window.location.reload()
  } catch (err) {
    console.error("Error updating approval:", err);
    alert("Failed to update approval status.");
  }
};

export default function AttendanceDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<AttendanceData | null>(null);
  const id = searchParams?.get("id");

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token undefined. Please login again.");
      return;
    }

    axios
      .get(`http://localhost:8000/api/checkclock/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const item = res.data.data;

        // Hitung work hours jika clock_in dan clock_out tersedia
        if (item.clock_in && item.clock_out) {
          const inDate = new Date(item.clock_in.replace(" ", "T"));
          const outDate = new Date(item.clock_out.replace(" ", "T"));
          const diffMs = outDate.getTime() - inDate.getTime();
          const hours = Math.floor(diffMs / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          item.workHours = { hours, minutes };
        }
        console.log(res.data.data);
        setData(item);
      })
      .catch((err) => {
        console.error("Failed to fetch attendance data:", err);
        alert("Failed to fetch attendance data.");
      });

    if (searchParams?.get("success") === "edit-success") {
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [id, searchParams]);

  const isAnnualLeave = data?.type === "annual leave";
  const shouldShowProofSection = ["annual leave", "permit"].includes(
    data?.type || ""
  );

  async function handleDelete() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token undefined. Please login again.");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/checkclock/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) throw new Error("Delete failed");

      router.push("/checkclock?success=delete-success");
    } catch (error) {
      console.error("Failed to delete attendance data:", error);
      alert("An error occurred while deleting data.");
    }
  }

  // Format tanggal
  const formatDate = (dateStr?: string) =>
    dateStr && dateStr !== "-"
      ? new Date(dateStr.replace(" ", "T")).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        })
      : "-";

  const formatTime = (datetimeStr?: string | null, status?: string): string => {
    if (!datetimeStr || status === "permit" || status === "annual leave") {
      return "-";
    }

    const date = new Date(datetimeStr);
    if (isNaN(date.getTime())) return "-";

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7 relative">
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Attendance Details</h1>

        <div className="space-y-5">
          {data ? (
            <>
              <div className="border border-neutral-200 rounded-lg p-4 w-full">
                <div className="flex gap-x-3 mb-5 items-center">
                  <div className="w-11 h-11 bg-gray-400 rounded-full shrink-0" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {data.employee?.firstName} {data.employee?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.employee?.position}
                    </p>
                  </div>
                </div>
                {isAnnualLeave && (
                  <div className="flex gap-2">
                    <ConfirmDialog
                      trigger={
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      }
                      title="Are you sure?"
                      description="This will reject the request permanently."
                      confirmText="Reject"
                      onConfirm={() => updateApproval(id!, "rejected", router)}
                    />
                    <ConfirmDialog
                      trigger={
                        <Button
                          size="sm"
                          variant="default"
                          className="text-white"
                        >
                          Approve
                        </Button>
                      }
                      title="Are you sure?"
                      description="This will approve the request permanently."
                      confirmText="Approve"
                      onConfirm={() => updateApproval(id!, "approved", router)}
                    />
                  </div>
                )}
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 w-full">
                <h3 className="text-md text-muted-foreground mb-6">
                  Attendance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-md font-medium">
                      {isAnnualLeave
                        ? formatDate(data.start_date)
                        : formatDate(data.clock_in)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clock In</p>
                    <p className="text-md font-medium">
                      {formatTime(data.clock_in, data.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clock Out</p>
                    <p className="text-md font-medium">
                      {formatTime(data.clock_out, data.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Work Hours</p>
                    <p className="text-md font-medium">
                      {data.workHours
                        ? `${data.workHours.hours} hrs ${data.workHours.minutes} mins`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-md font-medium">
                      {data.type || "no-show"}
                    </p>
                  </div>
                  {isAnnualLeave && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Start Date
                        </p>
                        <p className="text-md font-medium">
                          {formatDate(data.start_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          End Date
                        </p>
                        <p className="text-md font-medium">
                          {formatDate(data.end_date)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {shouldShowProofSection && (
                <div className="border border-neutral-200 rounded-lg p-4 w-full">
                  <h3 className="text-md text-muted-foreground mb-6">
                    Proof of Absence
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label>Reason</Label>
                      <div className="min-h-[100px] px-3 py-2 border border-input bg-muted rounded-md">
                        <p className="text-sm whitespace-pre-wrap">
                          {data.reason || "No reason provided"}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Proof File</Label>
                      {data.proofFile ? (
                        <div className="flex justify-between items-center px-4 py-2 border rounded-md">
                          <div className="flex gap-2 items-center flex-1">
                            {data.proofFile.fileType.startsWith("image/") ? (
                              <IconEye className="h-4 w-4 text-primary-600" />
                            ) : (
                              <IconFile className="h-4 w-4 text-gray-600" />
                            )}
                            <span className="text-sm truncate">
                              {data.proofFile.fileName}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {data.proofFile.fileType.startsWith("image/") && (
                              <FilePreviewDialog
                                trigger={
                                  <Button variant="ghost" size="icon">
                                    <IconEye className="h-4 w-4" />
                                  </Button>
                                }
                                fileName={data.proofFile.fileName}
                                fileUrl={data.proofFile.fileUrl}
                                previewImageUrl={data.proofFile.fileUrl}
                              />
                            )}
                            <DownloadButton
                              fileUrl={data.proofFile.fileUrl}
                              fileName={data.proofFile.fileName}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-20 border border-dashed rounded-md text-gray-500">
                          No file uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Loading data...</p>
          )}
        </div>

        <div className="flex justify-end">
          <ConfirmDialog
            trigger={<Button variant="destructive">Delete</Button>}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the attendance record."
            confirmText="Delete"
            cancelText="Cancel"
            confirmClassName="bg-destructive text-white hover:bg-destructive/90"
            cancelClassName="hover:bg-neutral-200"
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
