import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ShowUserCorrectionProps {
  @IsNotEmpty({ message: 'Informe o ID do usuário.' })
  @IsUUID('4', { message: 'ID de usuário inválido.' })
  user_id: string;

  @IsNotEmpty({ message: 'Informe o SLUG do desafio.' })
  @IsString({ message: 'ID do desafio inválido.' })
  challenge_slug: string;
}
