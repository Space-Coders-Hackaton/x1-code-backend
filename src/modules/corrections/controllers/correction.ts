import { Authorized, Body, JsonController, OnUndefined, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { SendChallengeToCorrectionService } from '../services';
import { SendChallengeToCorrectionProps } from '../types';

@Service()
@JsonController('/corrections')
export class CorrectionsController {
  constructor(
    @Inject()
    private sendChallengeToCorrectionService: SendChallengeToCorrectionService,
  ) {}

  @Authorized(['USER'])
  @Post('/send')
  @OnUndefined(200)
  async send(@Body() challenge: SendChallengeToCorrectionProps): Promise<undefined> {
    await this.sendChallengeToCorrectionService.execute(challenge);
    return undefined;
  }
}
