import { Authorized, Body, JsonController, OnUndefined, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { CreateCorrectionService, SendChallengeToCorrectionService } from '../services';
import { CreateCorrectionProps, SendChallengeToCorrectionProps } from '../types';

@Service()
@JsonController('/corrections')
export class CorrectionsController {
  constructor(
    @Inject()
    private sendChallengeToCorrectionService: SendChallengeToCorrectionService,

    @Inject()
    private createCorrectionService: CreateCorrectionService,
  ) {}

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
