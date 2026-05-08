"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialData?: any;
  isEdit?: boolean;
};

export default function TaskForm({ initialData, isEdit }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");

  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  const [status, setStatus] = useState(initialData?.status || "todo");

  const [priority, setPriority] = useState(initialData?.priority || "medium");

  const [tags, setTags] = useState(
    initialData?.task_tags?.map((t: any) => t.tags.name).join(", ") || "",
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [dueDate, setDueDate] = useState(
    initialData?.due_date ? initialData.due_date.split("T")[0] : "",
  );

  //conditional rendering of error message for title and due date
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    const tagList = tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean);

    if (tagList.length > 5) {
      setError("Maximum 5 tags allowed");
      return;
    }

    setLoading(true);

    const body = {
      title,
      description,
      status,
      priority,
      due_date: dueDate,
      tags: tagList,
    };

    const url = isEdit ? `/api/tasks/${initialData.id}` : "/api/tasks";

    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow"
    >
      <h1 className="mb-6 text-3xl font-bold">
        {isEdit ? "Edit Task" : "Create Task"}
      </h1>

      <div className="mb-4">
        <label className="mb-2 block">Title</label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full rounded-lg border p-3 ${
            error && !title.trim() ? "border-red-500" : ""
          }`}
        />
        {!title.trim() && error && (
          <p className="mt-1 text-sm text-red-500">Title is required</p>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block">Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border p-3"
          rows={4}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block">Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="todo">Todo</option>

            <option value="in_progress">In Progress</option>

            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block">Priority</label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="mb-2 block">Due Date</label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
          {error === "Due date is required" && (
            <p className="mt-1 text-sm text-red-500">Due date is required</p>
          )}
        </div>

        <div className="mt-4">
          <label className="mb-2 block">Tags</label>

          <input
            type="text"
            placeholder="backend, urgent"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          {error === "Maximum 5 tags allowed" && (
            <p className="mt-1 text-sm text-red-500">Maximum 5 tags allowed</p>
          )}

          <p className="mb-2 block text-sm text-gray-500">
            Separate tags with commas
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-500 p-3 text-white"
      >
        <div className="flex items-center justify-center gap-2">
          {loading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}

          <span>{isEdit ? "Updating..." : "Creating..."}</span>
        </div>
      </button>
    </form>
  );
}
