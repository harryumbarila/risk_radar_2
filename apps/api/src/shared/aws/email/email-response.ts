export class EmailResponse {
  public status: 'sent' | 'failed_to_send';

  public error?: string;
}
