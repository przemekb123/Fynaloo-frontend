import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guards';
import { LoginPage } from './pages/user/login.page';
import { RegisterPage } from './pages/user/register.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { CreateGroupPage } from './pages/group/create_group';
import { GroupsPage } from './pages/group/group.page';
import {GroupDetailsPage} from './pages/group/group-details.page';
import {FriendsPage} from './pages/friend/friend.page';
import {ProfilePage} from './pages/profile/profile.page';
//import {AddFriendPage} from './pages/friend/add-friend.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },

  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'groups', component: GroupsPage, canActivate: [authGuard] },
  { path: 'groups/create', component: CreateGroupPage, canActivate: [authGuard] },
  { path: 'groups/:groupId', component: GroupDetailsPage, canActivate: [authGuard] },
  {path: 'friends', component: FriendsPage, canActivate: [authGuard]},
  {path: 'profile', component:ProfilePage, canActivate:[authGuard]},
  //{ path: 'add-friend', component: AddFriendPage, canActivate:[authGuard] },

  { path: '**', redirectTo: 'login' },
];
