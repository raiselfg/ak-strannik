import { z } from 'zod';
import {
  artistContentSchema,
  artistContentTranslationSchema,
} from './artist.schemas';
import {
  createArtistContentDtoSchema,
  createArtistContentTranslationDtoSchema,
  updateArtistContentDtoSchema,
  updateArtistContentTranslationDtoSchema,
} from './artist.dto';

export type ArtistContent = z.infer<typeof artistContentSchema>;
export type ArtistContentTranslation = z.infer<
  typeof artistContentTranslationSchema
>;
export type CreateArtistContentDto = z.infer<
  typeof createArtistContentDtoSchema
>;
export type UpdateArtistContentDto = z.infer<
  typeof updateArtistContentDtoSchema
>;
export type CreateArtistContentTranslationDto = z.infer<
  typeof createArtistContentTranslationDtoSchema
>;
export type UpdateArtistContentTranslationDto = z.infer<
  typeof updateArtistContentTranslationDtoSchema
>;
