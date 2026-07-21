import { z } from 'zod';
import * as schemas from './pryalochka-of-time.schemas';
import * as dto from './pryalochka-of-time.dto';

export type PryalochkaOfTimeContent = z.infer<
  typeof schemas.pryalochkaOfTimeContentSchema
>;
export type PryalochkaOfTimeEvent = z.infer<
  typeof schemas.pryalochkaOfTimeEventSchema
>;
export type PryalochkaOfTimeEventTranslation = z.infer<
  typeof schemas.pryalochkaOfTimeEventTranslationSchema
>;
export type PryalochkaOfTimeActor = z.infer<
  typeof schemas.pryalochkaOfTimeActorSchema
>;
export type PryalochkaOfTimeActorTranslation = z.infer<
  typeof schemas.pryalochkaOfTimeActorTranslationSchema
>;
export type CreatePryalochkaOfTimeContentDto = z.infer<
  typeof dto.createPryalochkaOfTimeContentDtoSchema
>;
export type UpdatePryalochkaOfTimeContentDto = z.infer<
  typeof dto.updatePryalochkaOfTimeContentDtoSchema
>;
export type CreatePryalochkaOfTimeEventDto = z.infer<
  typeof dto.createPryalochkaOfTimeEventDtoSchema
>;
export type UpdatePryalochkaOfTimeEventDto = z.infer<
  typeof dto.updatePryalochkaOfTimeEventDtoSchema
>;
export type CreatePryalochkaOfTimeEventTranslationDto = z.infer<
  typeof dto.createPryalochkaOfTimeEventTranslationDtoSchema
>;
export type UpdatePryalochkaOfTimeEventTranslationDto = z.infer<
  typeof dto.updatePryalochkaOfTimeEventTranslationDtoSchema
>;
export type CreatePryalochkaOfTimeActorDto = z.infer<
  typeof dto.createPryalochkaOfTimeActorDtoSchema
>;
export type UpdatePryalochkaOfTimeActorDto = z.infer<
  typeof dto.updatePryalochkaOfTimeActorDtoSchema
>;
export type CreatePryalochkaOfTimeActorTranslationDto = z.infer<
  typeof dto.createPryalochkaOfTimeActorTranslationDtoSchema
>;
export type UpdatePryalochkaOfTimeActorTranslationDto = z.infer<
  typeof dto.updatePryalochkaOfTimeActorTranslationDtoSchema
>;
