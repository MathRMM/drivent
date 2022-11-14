import { request } from "@/utils/request";
import { notFoundError, requestError } from "@/errors";
import addressRepository, { CreateAddressParams } from "@/repositories/address-repository";
import enrollmentRepository, { CreateEnrollmentParams } from "@/repositories/enrollment-repository";
import { exclude } from "@/utils/prisma-utils";
import { Address, Enrollment } from "@prisma/client";
import { ViaCEPAddress } from "@/protocols";

async function getAddressFromCEP(cep: string): Promise<CEPAddress> {
  const result = await request.get(`https://viacep.com.br/ws/${cep}/json/`);
  const data = result.data as ViaCEPAddress;
  if (!result.data || result.data?.erro) {
    throw notFoundError();
  }

  const address: CEPAddress = {
    bairro: data.bairro,
    logradouro: data.logradouro,
    complemento: data.complemento,
    cidade: data.localidade,
    uf: data.uf
  };

  return address;
}

type CEPAddress = {
  bairro: string,
  logradouro: string,
  complemento: string,
  cidade: string,
  uf: string
}

/* type ViaCEPAddressComplete = {
  cep: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string,
} & ViaCEPAddress

function getViaCepAddress(data: ViaCEPAddressComplete): ViaCEPAddress{
  return
} */

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, "userId", "createdAt", "updatedAt", "Address"),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, "userId" | "createdAt" | "updatedAt">;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, "createdAt", "updatedAt", "enrollmentId");
}

type GetAddressResult = Omit<Address, "createdAt" | "updatedAt" | "enrollmentId">;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, "address");
  const address = getAddressForUpsert(params.address);
  //TODO - Verificar se o CEP é válido
  const cepValidation = await getAddressFromCEP(address.cep);
  if(!cepValidation.bairro) throw notFoundError;

  /* try {
    const cepValidation = await getAddressFromCEP(address.cep);
  } catch (error) {
    console.log("deu erro", error);
  } */

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, "userId"));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP
};

export default enrollmentsService;
