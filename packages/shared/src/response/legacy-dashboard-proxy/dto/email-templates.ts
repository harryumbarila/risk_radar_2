export interface EmailTemplate {
  id: number;
  templateName: string;
  templateEmailBody: string;
}

export interface EmailTemplatesResponseDto {
  templates: EmailTemplate[];
}
