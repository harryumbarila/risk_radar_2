export class EmailMessage {
  public to: string[];

  public subject: string;

  public body: string;

  public context: { [key: string]: unknown };

  public attachments?: Attachment[];
}
/**
 * Represents an email attachment with all relevant metadata
 */
export type Attachment = {
  /**
   * The raw binary content of the attachment
   * @example new Uint8Array() or Buffer.from("") or new TextEncoder().encode("")
   */
  RawContent: Uint8Array;

  /**
   * How the attachment should be displayed
   * @default "ATTACHMENT"
   */
  ContentDisposition?: 'ATTACHMENT' | 'INLINE';

  /**
   * The name of the file to be displayed
   */
  FileName: string;

  /**
   * Description of the attachment content
   * @optional
   */
  ContentDescription?: string;

  /**
   * Content ID used for inline attachments in HTML emails
   * @optional
   */
  ContentId?: string;

  /**
   * The encoding used for the attachment content
   * @default "BASE64"
   */
  ContentTransferEncoding?: 'BASE64' | 'QUOTED_PRINTABLE' | 'SEVEN_BIT';

  /**
   * MIME type of the attachment
   * @example "application/pdf", "image/png"
   */
  ContentType?: string;
};
