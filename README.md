# Task Management MVP

A simple internal Task Management system built with Next.js, TypeScript, Prisma, and MySQL.

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Reason
- เลือก Next.js เพราะว่ามันสามารถจัดการได้ทั้ง Frontend และ Backend ภายใน Project เดียว ช่วยทำให้ Setup Project ได้ง่าย
- เลือก Next.js อีกเหตุผลคือบริษัทเปิดรับ Developer ที่สามารถใช้ Node.js ได้ครับ
- เลือก TypeScript เพราะว่าเป็นภาษาที่ต้องกำหนด Type ให้ตัวแปรทำให้มีความปลอดภัยในการเกิด Bug ได้ยากขึ้น
- เลือก Tailwind CSS ช่วยพัฒนา UI ได้ง่ายแล้วก็เร็ว

---

## Backend
- Node.js
- Next.js API Routes
- Prisma ORM

### Reason
- Node.js เหมาะกับการสร้าง REST API แบบรวดเร็ว เข้าใจง่ายด้วยครับ
- Next.js ตามเหตุผลข้อด้านบน ช่วยลดความซับซ้อนในการเขียน code ระหว่าง Frontend กับ Backend
- Prisma ช่วยลดเวลาในการทำงานระหว่าง Source Code กับ Database สามารถดึงข้อมูลจาก Database มาใช้ใน Source Code ได้เลย

---

## Database
- MySQL

### Reason
- เป็น Database ที่เคยใช้อยู่แล้วใช้ง่ายเป็นพื้นฐาน แล้วก็เหมาะกับการใช้งานข้อมูลที่เป็น relational data 
- ซัพพอร์ตเรื่องของ Relationships ระหว่าง Table 

---

# Features

## Completed Features

### Backend API
- Create Tasks
- Get All Tasks
- Get Task By ID
- Update Task
- Delete Task

### Search & Filter
- Search by title and description
- Filter by status
- Filter by priority
- Filter by tags
- Multiple filters combined

### Pagination
- Pagination support
- Total count response

### Validation
- Required title validation
- Required due date validation
- Maximum 5 tags validation

### Frontend
- Task list page
- Create task page
- Edit task page
- Delete confirmation
- Loading states
- Error states

---

# Incomplete

---

# Run Project

- Create .env in folder task-managerment
- DATABASE_URL="mysql://root:password@localhost:3306/taskdb"

- cd .\task-management\app\
- npm run dev
- local : http://localhost:3000 สำหรับเปิดหน้าเว็บไซต์