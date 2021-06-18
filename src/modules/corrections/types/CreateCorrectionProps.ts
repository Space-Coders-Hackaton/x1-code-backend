import { Difficulty } from '@database/entities/correction';
import { IsNumber, IsNotEmpty, IsEnum, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateCorrectionProps {
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

  @IsNotEmpty({ message: 'Informe o total de testes no desafio.' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Total de testes inválido.' })
  total_tests: number;

  @IsNotEmpty({ message: 'Informe o total de testes passados no desafio.' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Total de testes passados inválido.' })
  passed_tests: number;

  @IsNotEmpty({ message: 'Informe a URL do repositório concluído.' })
  @IsUrl({ host_whitelist: ['github.com'] }, { message: 'URL de repositório inválido.' })
  repository_url: string;
}
