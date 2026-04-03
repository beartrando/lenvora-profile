/*
  Warnings:

  - You are about to drop the `UserAchievement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAchievement" DROP CONSTRAINT "UserAchievement_profileId_fkey";

-- DropTable
DROP TABLE "public"."UserAchievement";

-- CreateTable
CREATE TABLE "public"."OwnerAchievement" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnerAchievement_profileId_achievementId_key" ON "public"."OwnerAchievement"("profileId", "achievementId");

-- AddForeignKey
ALTER TABLE "public"."OwnerAchievement" ADD CONSTRAINT "OwnerAchievement_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OwnerAchievement" ADD CONSTRAINT "OwnerAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
