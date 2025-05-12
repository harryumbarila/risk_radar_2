export class EmailMessage {
  public to: string[];

  public subject: string;

  public body: string;

  public context: { [key: string]: unknown };

  public attachments?: unknown;
}
