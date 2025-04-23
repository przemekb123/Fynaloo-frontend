import {FriendshipStatus} from '../Enums/friendship-status.model';


export interface FriendRequest {
  id: number;
  senderId: number;
  senderUsername: string;
  senderFirstName: string;
  senderLastName: string;
  receiverId: number;
  receiverUsername: string;
  status: FriendshipStatus;
}

export interface FriendActionRequest{
  userId: number;
}

