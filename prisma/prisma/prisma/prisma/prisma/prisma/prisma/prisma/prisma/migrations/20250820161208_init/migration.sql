/*
  Warnings:

  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Profile_userId_key";

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "userId",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_owner_id_key" ON "public"."Profile"("owner_id");
