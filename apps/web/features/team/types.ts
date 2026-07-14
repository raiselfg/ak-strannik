export type PublicMedia = {
  url: string;
  alt: string;
  title: string | null;
  width: number | null;
  height: number | null;
};

export type PublicTeamMember = {
  id: string;
  name: string;
  role: string | null;
  description: string | null;
  image: PublicMedia | null;
};
