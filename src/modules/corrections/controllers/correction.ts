import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { Correction } from '@database/entities/correction';

import { CreateCorrectionService } from '../services';
import { CreateCorrectionProps } from '../types';

@Service()
@JsonController('/corrections')
export class CorrectionsController {
  constructor(
    @Inject()
    private createCorrectionService: CreateCorrectionService,
  ) {}

  @Post()
  async store(@Body() correction: CreateCorrectionProps): Promise<Correction> {
    return this.createCorrectionService.create(correction);
  }
}
