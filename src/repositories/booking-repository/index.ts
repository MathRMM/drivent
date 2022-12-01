import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function upsertBooking(userId: number, roomId: number, bookingId?: number) {
  return await prisma.booking.upsert({
    create: {
      userId,
      roomId,
    },
    update: {
      roomId: roomId
    },
    where: {
      id: bookingId || 0
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  upsertBooking,
};
export default bookingRepository;
