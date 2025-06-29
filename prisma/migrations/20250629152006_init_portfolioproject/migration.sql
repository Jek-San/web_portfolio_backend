-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "portfolio";

-- CreateTable
CREATE TABLE "portfolio"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT NOT NULL,
    "images" JSONB,
    "link" TEXT NOT NULL,
    "repo" TEXT,
    "tags" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."ViewLog" (
    "id" SERIAL NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "portfolio"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "portfolio"."Project"("slug");

-- CreateIndex
CREATE INDEX "ViewLog_projectSlug_deviceId_createdAt_idx" ON "portfolio"."ViewLog"("projectSlug", "deviceId", "createdAt");

-- AddForeignKey
ALTER TABLE "portfolio"."ViewLog" ADD CONSTRAINT "ViewLog_projectSlug_fkey" FOREIGN KEY ("projectSlug") REFERENCES "portfolio"."Project"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
