"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  task_tags?: {
    tags: {
      id: number;
      name: string;
    };
  }[];
  due_date: string;
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("");
  const [tag, setTag] = useState("");

  async function fetchTasks() {
    setLoading(true);

    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    if (status) {
      params.append("status", status);
    }

    if (priority) {
      params.append("priority", priority);
    }

    if (tag) {
      params.append("tags", tag);
    }

    if (firstLoad) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setFirstLoad(false);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await fetch(`/api/tasks?${params.toString()}`);

    const data = await res.json();

    setTasks(data.data);

    setLoading(false);
  }

  async function deleteTask(id: number) {
    const confirmDelete = confirm("Delete this task?");

    if (!confirmDelete) return;

    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Task Management</h1>

          <Link
            href="/create"
            className="rounded-lg bg-green-500 px-4 py-2 text-white"
          >
            Create Task
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border p-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border p-3"
          >
            <option value="">All Status</option>

            <option value="todo">Todo</option>

            <option value="in_progress">In Progress</option>

            <option value="done">Done</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border p-3"
          >
            <option value="">All Priority</option>

            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>

          <input
            type="text"
            placeholder="Tag..."
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-lg border p-3"
          />

          <button
            onClick={fetchTasks}
            className="rounded-lg bg-blue-500 px-5 text-white"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-white p-5 shadow"
              >
                <div className="h-6 w-1/3 rounded bg-gray-300" />

                <div className="mt-4 h-4 w-full rounded bg-gray-200" />

                <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />

                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-gray-200" />

                  <div className="h-6 w-16 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow">
                <p className="text-gray-500">No tasks found</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="rounded-2xl bg-white p-5 shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold">
                            {task.title}
                          </h2>

                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs">
                            {task.status}
                          </span>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
                            {task.priority}
                          </span>
                        </div>

                        <p className="mt-2 text-gray-600">{task.description}</p>

                        <p className="mt-3 text-sm text-gray-500">
                          Due Date :{" "}
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : "No due date"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {task.task_tags?.map((tagItem: any) => (
                            <span
                              key={tagItem.tags.id}
                              className="rounded-full bg-green-100 px-3 py-1 text-sm"
                            >
                              #{tagItem.tags.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/edit/${task.id}`}
                        className="rounded-lg bg-yellow-400 px-3 py-2"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
