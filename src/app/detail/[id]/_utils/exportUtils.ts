import { Post } from "@/lib/types";

export function exportReport(report: Post) {
  if (!report) return;

  const blob = new Blob([report.content], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.title}.txt`;
  link.click();

  URL.revokeObjectURL(url);
}
