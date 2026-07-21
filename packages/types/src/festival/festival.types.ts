import { z } from 'zod';
import * as schemas from './festival.schemas';
import * as dto from './festival.dto';

export type FestivalContent = z.infer<typeof schemas.festivalContentSchema>;
export type FestivalContentTranslation = z.infer<
  typeof schemas.festivalContentTranslationSchema
>;
export type FestivalEvent = z.infer<typeof schemas.festivalEventSchema>;
export type FestivalEventTranslation = z.infer<
  typeof schemas.festivalEventTranslationSchema
>;
export type FestivalNominations = z.infer<
  typeof schemas.festivalNominationsSchema
>;
export type FestivalNominationsTranslation = z.infer<
  typeof schemas.festivalNominationsTranslationSchema
>;
export type FestivalJury = z.infer<typeof schemas.festivalJurySchema>;
export type FestivalJuryTranslation = z.infer<
  typeof schemas.festivalJuryTranslationSchema
>;
export type FestivalJuryPerson = z.infer<
  typeof schemas.festivalJuryPersonSchema
>;
export type FestivalJuryPersonTranslation = z.infer<
  typeof schemas.festivalJuryPersonTranslationSchema
>;
export type FestivalOrganizations = z.infer<
  typeof schemas.festivalOrganizationsSchema
>;
export type FestivalOrganizationsTranslation = z.infer<
  typeof schemas.festivalOrganizationsTranslationSchema
>;
export type FestivalOrganization = z.infer<
  typeof schemas.festivalOrganizationSchema
>;
export type FestivalOrganizationTranslation = z.infer<
  typeof schemas.festivalOrganizationTranslationSchema
>;

export type CreateFestivalContentDto = z.infer<
  typeof dto.createFestivalContentDtoSchema
>;
export type UpdateFestivalContentDto = z.infer<
  typeof dto.updateFestivalContentDtoSchema
>;
export type CreateFestivalContentTranslationDto = z.infer<
  typeof dto.createFestivalContentTranslationDtoSchema
>;
export type UpdateFestivalContentTranslationDto = z.infer<
  typeof dto.updateFestivalContentTranslationDtoSchema
>;
export type CreateFestivalEventDto = z.infer<
  typeof dto.createFestivalEventDtoSchema
>;
export type UpdateFestivalEventDto = z.infer<
  typeof dto.updateFestivalEventDtoSchema
>;
export type CreateFestivalEventTranslationDto = z.infer<
  typeof dto.createFestivalEventTranslationDtoSchema
>;
export type UpdateFestivalEventTranslationDto = z.infer<
  typeof dto.updateFestivalEventTranslationDtoSchema
>;
export type CreateFestivalNominationsDto = z.infer<
  typeof dto.createFestivalNominationsDtoSchema
>;
export type UpdateFestivalNominationsDto = z.infer<
  typeof dto.updateFestivalNominationsDtoSchema
>;
export type CreateFestivalNominationsTranslationDto = z.infer<
  typeof dto.createFestivalNominationsTranslationDtoSchema
>;
export type UpdateFestivalNominationsTranslationDto = z.infer<
  typeof dto.updateFestivalNominationsTranslationDtoSchema
>;
export type CreateFestivalJuryDto = z.infer<
  typeof dto.createFestivalJuryDtoSchema
>;
export type UpdateFestivalJuryDto = z.infer<
  typeof dto.updateFestivalJuryDtoSchema
>;
export type CreateFestivalJuryTranslationDto = z.infer<
  typeof dto.createFestivalJuryTranslationDtoSchema
>;
export type UpdateFestivalJuryTranslationDto = z.infer<
  typeof dto.updateFestivalJuryTranslationDtoSchema
>;
export type CreateFestivalJuryPersonDto = z.infer<
  typeof dto.createFestivalJuryPersonDtoSchema
>;
export type UpdateFestivalJuryPersonDto = z.infer<
  typeof dto.updateFestivalJuryPersonDtoSchema
>;
export type CreateFestivalJuryPersonTranslationDto = z.infer<
  typeof dto.createFestivalJuryPersonTranslationDtoSchema
>;
export type UpdateFestivalJuryPersonTranslationDto = z.infer<
  typeof dto.updateFestivalJuryPersonTranslationDtoSchema
>;
export type CreateFestivalOrganizationsDto = z.infer<
  typeof dto.createFestivalOrganizationsDtoSchema
>;
export type UpdateFestivalOrganizationsDto = z.infer<
  typeof dto.updateFestivalOrganizationsDtoSchema
>;
export type CreateFestivalOrganizationsTranslationDto = z.infer<
  typeof dto.createFestivalOrganizationsTranslationDtoSchema
>;
export type UpdateFestivalOrganizationsTranslationDto = z.infer<
  typeof dto.updateFestivalOrganizationsTranslationDtoSchema
>;
export type CreateFestivalOrganizationDto = z.infer<
  typeof dto.createFestivalOrganizationDtoSchema
>;
export type UpdateFestivalOrganizationDto = z.infer<
  typeof dto.updateFestivalOrganizationDtoSchema
>;
export type CreateFestivalOrganizationTranslationDto = z.infer<
  typeof dto.createFestivalOrganizationTranslationDtoSchema
>;
export type UpdateFestivalOrganizationTranslationDto = z.infer<
  typeof dto.updateFestivalOrganizationTranslationDtoSchema
>;
