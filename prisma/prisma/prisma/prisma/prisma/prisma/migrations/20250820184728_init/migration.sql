/*
  Warnings:

  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[OwnerId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `OwnerId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Profile_userId_key";

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "userId",
ADD COLUMN     "OwnerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_OwnerId_key" ON "public"."Profile"("OwnerId");
