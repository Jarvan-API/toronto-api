export interface IFile {
  id: string;
  owner: string;
  folder: string;
  name: string;
  size: number;
  type: string;
  data: any;
  is_public: string;
  created_at: Date;
  updated_at: Date;
}
