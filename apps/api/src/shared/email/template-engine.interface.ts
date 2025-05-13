export type TemplateEngineInterface = {
  render(template: string, data: Record<string, unknown>): string;
};
