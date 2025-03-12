// app/documents/page.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import DocumentsContent from "./DocumentsContent";

export default function DocumentsPage() {
  return (
    <ProtectedRoute>
      <DocumentsContent />
    </ProtectedRoute>
  );
}