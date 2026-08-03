/*
  Warnings:

  - You are about to drop the column `booster` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `expansion` on the `Card` table. All the data in the column will be lost.
  - Added the required column `setName` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "booster",
DROP COLUMN "expansion",
ADD COLUMN     "packName" TEXT,
ADD COLUMN     "setName" TEXT NOT NULL;
