import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoxesReceivedListComponent } from './components/boxes-received-list/boxes-received-list.component';
import { BoxesSentListComponent } from './components/boxes-sent-list/boxes-sent-list.component';
import { GovernanceComponent } from './components/governance/governance.component';
import { OverTheCounterComponent } from './components/over-the-counter/over-the-counter.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SendComponent } from './components/send/send.component';
import { StakingComponent } from './components/staking/staking.component';

const routes: Routes = [
  { path: 'send', component: SendComponent },
  { path: 'over-the-counter', component: OverTheCounterComponent },
  { path: 'boxes/received', component: BoxesReceivedListComponent },
  { path: 'boxes/sent', component: BoxesSentListComponent },
  { path: 'staking', component: StakingComponent },
  { path: 'governance', component: GovernanceComponent },
  { path: '', redirectTo: '/send', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
