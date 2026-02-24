import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  UserAddressVO,
  UserAddressCreateRequest,
  UserAddressUpdateRequest,
  AddressModule,
} from '../types/address';

export class AddressApi implements AddressModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async list(): Promise<UserAddressVO[]> {
    return this.client.get<UserAddressVO[]>(appApiPath('/user/address'));
  }

  async getById(addressId: string): Promise<UserAddressVO> {
    return this.client.get<UserAddressVO>(appApiPath(`/user/address/${addressId}`));
  }

  async getDefault(): Promise<UserAddressVO> {
    return this.client.get<UserAddressVO>(appApiPath('/user/address/default'));
  }

  async create(request: UserAddressCreateRequest): Promise<UserAddressVO> {
    return this.client.post<UserAddressVO>(appApiPath('/user/address'), request);
  }

  async update(addressId: string, request: UserAddressUpdateRequest): Promise<UserAddressVO> {
    return this.client.put<UserAddressVO>(appApiPath(`/user/address/${addressId}`), request);
  }

  async delete(addressId: string): Promise<void> {
    await this.client.delete(appApiPath(`/user/address/${addressId}`));
  }

  async setDefault(addressId: string): Promise<UserAddressVO> {
    return this.client.put<UserAddressVO>(appApiPath(`/user/address/${addressId}/default`));
  }
}

export function createAddressApi(client: HttpClient): AddressModule {
  return new AddressApi(client);
}
