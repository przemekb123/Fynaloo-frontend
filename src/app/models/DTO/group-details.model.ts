import { MemberInfoModel } from './member-info.model';

export interface GroupDetailsModel {
  groupId: number;
  groupName: string;
  groupUrl: string;
  members: MemberInfoModel[];
}
