import { IParseMailTemplateDto } from '../dtos/IParseMailTemplateDTO';

export interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDto): Promise<string>;
}
