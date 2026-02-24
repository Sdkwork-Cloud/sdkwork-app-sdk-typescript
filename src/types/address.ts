export interface UserAddressVO {
  id: string;
  name: string;
  phone: string;
  countryCode?: string;
  provinceCode?: string;
  cityCode?: string;
  districtCode?: string;
  addressDetail?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UserAddressCreateRequest {
  name: string;
  phone: string;
  countryCode?: string;
  provinceCode?: string;
  cityCode?: string;
  districtCode?: string;
  addressDetail: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UserAddressUpdateRequest {
  name?: string;
  phone?: string;
  countryCode?: string;
  provinceCode?: string;
  cityCode?: string;
  districtCode?: string;
  addressDetail?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface AddressModule {
  list(): Promise<UserAddressVO[]>;
  getById(addressId: string): Promise<UserAddressVO>;
  getDefault(): Promise<UserAddressVO>;
  create(request: UserAddressCreateRequest): Promise<UserAddressVO>;
  update(addressId: string, request: UserAddressUpdateRequest): Promise<UserAddressVO>;
  delete(addressId: string): Promise<void>;
  setDefault(addressId: string): Promise<UserAddressVO>;
}
