import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Product, ProductQuery, User } from '../backend';
import { ExternalBlob } from '../backend';

// ─── User Profile Queries ─────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Registration Mutations ───────────────────────────────────────────────────

export function useRegisterCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      email: string;
      phone: string;
      kyc_doc: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerCustomer(params.name, params.email, params.phone, params.kyc_doc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegisterVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      email: string;
      phone: string;
      gst_number: string;
      bank_kyc: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerVendor(params.name, params.email, params.phone, params.gst_number, params.bank_kyc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegisterCenter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; email: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerCenter(params.name, params.email, params.phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Product Queries ──────────────────────────────────────────────────────────

export function useGetProducts(query?: ProductQuery | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', query],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts(query ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
  });
}

export function useUploadProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      rental_price: bigint;
      deposit_amount: bigint;
      images: ExternalBlob[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadProduct(
        params.name,
        params.description,
        params.rental_price,
        params.deposit_amount,
        params.images
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSubmitProductToCenter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { product_id: bigint; center_id: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitProductToCenter(params.product_id, params.center_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useAcknowledgeReceivingProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { product_id: bigint; center_id: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acknowledgeReceivingProduct(params.product_id, params.center_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useApproveProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveUserKyc() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveUserKyc(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
