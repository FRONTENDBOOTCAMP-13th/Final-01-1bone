export interface Comment {
  _id: number;
  content: string;
  createdAt: string;
  updateAt: string;
  user: {
    _id: number;
    name: string;
    image?: string;
  };
}
