import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: bigint;
    name: string;
    deposit_amount: bigint;
    availability_status: ProductStatus;
    rental_price: bigint;
    description: string;
    sanitization_status: boolean;
    approved: boolean;
    center_id: bigint;
    vendor_id: bigint;
    images: Array<ExternalBlob>;
}
export interface ProductQuery {
    status?: ProductStatus;
    only_approved: boolean;
    max_rental_price?: bigint;
    only_sanitized: boolean;
    min_rental_price?: bigint;
    center_id?: bigint;
    vendor_id?: bigint;
}
export interface User {
    id: bigint;
    kyc_doc?: ExternalBlob;
    principal: Principal;
    gst_number?: string;
    name: string;
    role: UserRole;
    email: string;
    bank_kyc?: string;
    kyc_status: boolean;
    phone: string;
}
export interface UserProfile {
    kyc_doc?: ExternalBlob;
    gst_number?: string;
    name: string;
    role: UserRole;
    email: string;
    bank_kyc?: string;
    kyc_status: boolean;
    phone: string;
}
export enum ProductStatus {
    rented = "rented",
    atVendor = "atVendor",
    onTrial = "onTrial",
    underSanitization = "underSanitization",
    atCenter = "atCenter"
}
export enum UserRole {
    center = "center",
    admin = "admin",
    customer = "customer",
    vendor = "vendor"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acknowledgeReceivingProduct(product_id: bigint, center_id: bigint): Promise<void>;
    approveProduct(product_id: bigint): Promise<void>;
    approveUserKyc(user_id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getProduct(product_id: bigint): Promise<Product | null>;
    getProducts(productQueryParam: ProductQuery | null): Promise<Array<Product>>;
    getUser(user_id: bigint): Promise<User | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerCenter(name: string, email: string, phone: string): Promise<bigint>;
    registerCustomer(name: string, email: string, phone: string, kyc_doc: ExternalBlob | null): Promise<bigint>;
    registerVendor(name: string, email: string, phone: string, gst_number: string, bank_kyc: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitProductToCenter(product_id: bigint, center_id: bigint): Promise<void>;
    uploadProduct(name: string, description: string, rental_price: bigint, deposit_amount: bigint, images: Array<ExternalBlob>): Promise<bigint>;
}
