import { HallForm } from "@/components/owner/hall-form";

export default function NewHallPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Add New Hall</h1>
      <HallForm mode="create" />
    </div>
  );
}
