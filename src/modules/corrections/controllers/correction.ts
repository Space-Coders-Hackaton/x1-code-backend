import { Authorized, Body, CurrentUser, Get, JsonController, OnUndefined, Param, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { Session } from '@shared/auth';
import { CreateCorrectionService, SendChallengeToCorrectionService, ShowUserChallengeService } from '../services';
import { CreateCorrectionProps, SendChallengeToCorrectionProps, ShowCorrectionResponse } from '../types';

@Service()
@JsonController('/corrections')
export class CorrectionsController {
  constructor(
    @Inject()
    private showUserChallengeService: ShowUserChallengeService,

    @Inject()
    private sendChallengeToCorrectionService: SendChallengeToCorrectionService,

    @Inject()
    private createCorrectionService: CreateCorrectionService,
  ) {}

  @Authorized(['USER'])
  @Get('/:challenge_slug')
  @OnUndefined(200)
  async show(
    @Param('challenge_slug') challenge_slug: string,
    @CurrentUser() session: Session,
  ): Promise<ShowCorrectionResponse> {
    return this.showUserChallengeService.show({
      challenge_slug,
      user_id: session.id,
    });
  }

  @Authorized(['USER'])
  @Post('/send')
  @OnUndefined(200)
  async send(@Body() challenge: SendChallengeToCorrectionProps): Promise<undefined> {
    await this.sendChallengeToCorrectionService.execute(challenge);
    return undefined;
  }

  @Post('/')
  @OnUndefined(200)
  async sendToCorrection(@Body() challenge: CreateCorrectionProps): Promise<undefined> {
    await this.createCorrectionService.create(challenge);
    return undefined;
  }
}
