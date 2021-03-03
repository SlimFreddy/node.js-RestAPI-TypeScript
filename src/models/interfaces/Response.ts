export interface RPost {
  _id: string;
  postTitle: string;
  postBody: string;
  date: Date;
  author: RUser;
}

export interface RUser {
  _id: string;
  username: string;
}
