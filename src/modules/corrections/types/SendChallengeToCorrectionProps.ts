import { IsNotEmpty, IsEnum, IsString, IsUrl, IsUUID } from 'class-validator';
import { Difficulty } from '@database/entities/correction';

export class SendChallengeToCorrectionProps {
  @IsNotEmpty({ message: 'Informe o ID do usuário.' })
  @IsUUID('4', { message: 'ID de usuário inválido.' })
  user_id: string;

  @IsNotEmpty({ message: 'Informe o SLUG do desafio.' })
  @IsString({ message: 'ID do desafio inválido.' })
  challenge_slug: string;

  @IsNotEmpty({ message: 'Informe a dificuldade do desafio.' })
  @IsEnum(Difficulty, { message: 'Dificuldade inválida.' })
  difficulty: Difficulty;

  @IsNotEmpty({ message: 'Informe a tecnologia do desafio.' })
  @IsString({ message: 'Tecnologia inválida.' })
  technology: string;

  @IsNotEmpty({ message: 'Informe a URL do repositório concluído.' })
  @IsUrl({ host_whitelist: ['github.com'] }, { message: 'URL de repositório inválido.' })
  repository_url: string;

  @IsNotEmpty({ message: 'Informe a URL do template do repositório.' })
  @IsUrl({ host_whitelist: ['github.com'] }, { message: 'URL de repositório inválido.' })
  template_url: string;
}
