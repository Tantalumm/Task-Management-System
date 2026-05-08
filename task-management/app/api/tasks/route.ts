import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

type CreateTaskBody = {
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  due_date?: string;
  tags?: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateTaskBody = await req.json();

    const {
      title,
      description,
      status = "todo",
      priority = "medium",
      due_date,
      tags = [],
    } = body;

    // validation
    if (!title || title.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (tags.length > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 5 tags allowed",
        },
        {
          status: 400,
        }
      );
    }

    // create task
    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        status,
        priority,
        due_date: due_date ? new Date(due_date) : null,
      },
    });

    // create/connect tags
    for (const tagName of tags) {
      const tag = await prisma.tags.upsert({
        where: {
          name: tagName,
        },
        update: {},
        create: {
          name: tagName,
        },
      });

      await prisma.task_tags.create({
        data: {
          task_id: task.id,
          tag_id: tag.id,
        },
      });
    }

    // fetch full task with tags
    const result = await prisma.tasks.findUnique({
      where: {
        id: task.id,
      },
      include: {
        task_tags: {
          include: {
            tags: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}