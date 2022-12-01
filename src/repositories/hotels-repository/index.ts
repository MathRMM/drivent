import { prisma } from "@/config";
import { Hotel, Room, Booking } from "@prisma/client";

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findRoomWithHotelByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId: hotelId,
    },
    select: {
      id: true,
      capacity: true,
      name: true,
      hotelId: true,
      Hotel: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}

async function findRoomById(id: number): Promise<Room & {Booking: Booking[]}> {
  return prisma.room.findUnique({
    where: {
      id,
    },
    include: {
      Booking: true
    }
  });
}

const hotelsRepository = {
  findHotels,
  findRoomWithHotelByHotelId,
  findRoomById
};

export default hotelsRepository;
