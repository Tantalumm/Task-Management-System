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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    // filters
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const tag = searchParams.get("tags");

    // dynamic where
    const where: any = {};

    // search
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }

    // status filter
    if (status) {
      where.status = status;
    }

    // priority filter
    if (priority) {
      where.priority = priority;
    }

    // tag filter
    if (tag) {
      where.task_tags = {
        some: {
          tags: {
            name: tag,
          },
        },
      };
    }

    // total count
    const total = await prisma.tasks.count({
      where,
    });

    // tasks
    const tasks = await prisma.tasks.findMany({
      where,
      include: {
        task_tags: {
          include: {
            tags: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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