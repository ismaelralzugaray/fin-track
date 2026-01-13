export interface TaxProfiles {
    id: string;
    name: string;
    percentage: number;
}

export interface Settings {
    userId: string;
    usdRateCurrent: number;
    taxProfiles: TaxProfiles[];
    updatedAt: Date;
}