import TaskForm from "@/app/components/taskForm";

async function getTask(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/tasks/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const task = await getTask(id);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <TaskForm
        initialData={task.data}
        isEdit
      />
    </main>
  );
}