/*
  Warnings:

  - You are about to drop the column `categoryNames` on the `Blog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Blog_userId_categoryNames_idx";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "categoryNames",
ADD COLUMN     "categoryName" TEXT;

-- CreateIndex
CREATE INDEX "Blog_userId_categoryName_idx" ON "Blog"("userId", "categoryName");
