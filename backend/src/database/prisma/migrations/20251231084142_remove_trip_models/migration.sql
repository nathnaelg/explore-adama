/*
  Warnings:

  - You are about to drop the `Trip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TripPlace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- DropForeignKey
ALTER TABLE "TripPlace" DROP CONSTRAINT "TripPlace_placeId_fkey";

-- DropForeignKey
ALTER TABLE "TripPlace" DROP CONSTRAINT "TripPlace_tripId_fkey";

-- DropTable
DROP TABLE "Trip";

-- DropTable
DROP TABLE "TripPlace";
