import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type UpdateTaskBody = {
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  due_date?: string;
  tags?: string[];
};

type Params = {
  params: {
    id: string;
  };
};

// UPDATE TASK
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const taskId = Number(params.id);

    console.log(params.id);
    console.log(taskId);

    if (isNaN(taskId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid task id",
        },
        {
          status: 400,
        }
      );
    }

    const body: UpdateTaskBody = await req.json();

    const {
      title,
      description,
      status,
      priority,
      due_date,
      tags,
    } = body;

    // check existing task
    const existingTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    // validate tags
    if (tags && tags.length > 5) {
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

    // update task
    await prisma.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        description,
        status,
        priority,
        due_date: due_date
          ? new Date(due_date)
          : undefined,
      },
    });

    // update tags
    if (tags) {
      // remove old tags relation
      await prisma.task_tags.deleteMany({
        where: {
          task_id: taskId,
        },
      });

      // recreate tags
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
            task_id: taskId,
            tag_id: tag.id,
          },
        });
      }
    }

    // fetch updated task
    const updatedTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
      include: {
        task_tags: {
          include: {
            tags: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
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

// DELETE TASK
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const taskId = Number(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid task id",
        },
        {
          status: 400,
        }
      );
    }

    // check existing task
    const existingTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    // delete task
    await prisma.tasks.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
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