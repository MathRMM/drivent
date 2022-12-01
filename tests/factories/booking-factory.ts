import { prisma } from "@/config";
import { Room, User } from "@prisma/client";

export async function createBooking(room: Room, user: User) {
  return await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: room.id,
    },
  });
}

export async function findBooking(id: number) {
  return await prisma.booking.findFirst({
    where: {
      id,
    },
  });
}
