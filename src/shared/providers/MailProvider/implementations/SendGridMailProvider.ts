import sgMail from '@sendgrid/mail';
import { Inject, Service } from 'typedi';
import mailConfig from '@config/mail';

import { HandlebarsMailTemplateProvider } from '@shared/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

@Service()
class SendGridMailProvider implements IMailProvider {
  constructor(
    @Inject()
    private mailTemplateProvider: HandlebarsMailTemplateProvider,
  ) {}

  async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await sgMail.send({
      from: {
        name: from?.name || name,
        email: from?.email || email,
      },
      to: {
        name: to.name,
        email: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export { SendGridMailProvider };
