export interface IrisLeadSourceData {
    name: string; // Source name
    id: number; // Source ID
}

export interface IrisLeadSourcesResponseDto {
    data: IrisLeadSourceData[];
}
