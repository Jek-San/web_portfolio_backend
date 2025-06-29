/*
  Warnings:

  - You are about to drop the column `projectId` on the `viewlog` table. All the data in the column will be lost.
  - You are about to drop the column `referrer` on the `viewlog` table. All the data in the column will be lost.
  - Added the required column `deviceId` to the `ViewLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectSlug` to the `ViewLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `viewlog` DROP FOREIGN KEY `ViewLog_projectId_fkey`;

-- DropIndex
DROP INDEX `ViewLog_projectId_fkey` ON `viewlog`;

-- AlterTable
ALTER TABLE `viewlog` DROP COLUMN `projectId`,
    DROP COLUMN `referrer`,
    ADD COLUMN `deviceId` VARCHAR(191) NOT NULL,
    ADD COLUMN `projectSlug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `ViewLog_projectSlug_deviceId_createdAt_idx` ON `ViewLog`(`projectSlug`, `deviceId`, `createdAt`);

-- AddForeignKey
ALTER TABLE `ViewLog` ADD CONSTRAINT `ViewLog_projectSlug_fkey` FOREIGN KEY (`projectSlug`) REFERENCES `Project`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;
