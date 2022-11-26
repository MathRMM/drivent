import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

export async function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(hotel: Hotel): Promise<Room> {
  return prisma.room.create({
    data: {
      name: faker.lorem.sentence(),
      capacity: faker.datatype.number({ min: 1, max: 6 }),
      hotelId: hotel.id,
    },
    include: {
      Hotel: true
    }
  });
}
