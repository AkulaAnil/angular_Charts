import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { GuageChartComponent } from './guage-chart/guage-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

const routes: Routes = [
  {path: 'pieChart', component: PieChartComponent},
  {path: 'barChart', component: BarChartComponent},
  {path: 'lineChart', component: LineChartComponent},
  {path: 'guageChart', component: GuageChartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
