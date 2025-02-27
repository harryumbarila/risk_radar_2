export interface ChannelDataDto {
  id: number;
  name: string;
  is_default: 'Yes' | 'No';
}

export interface IrisChannelsResponseDto {
  data: ChannelDataDto[];
}
