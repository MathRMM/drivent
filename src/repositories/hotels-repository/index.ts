import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

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
        }
      },
    },
  });
}

const hotelsRepository = {
  findHotels,
  findRoomWithHotelByHotelId,
};

export default hotelsRepository;
