export interface RoleplayActor {
  readonly id: number;

  readonly slug: string;
  readonly Date: string;
  readonly Name: string;
  readonly SystemPrompt: string;

  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}
