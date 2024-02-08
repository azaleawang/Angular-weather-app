import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { WeatherService } from "./services/weather/weather.service";
import { WeatherChartsComponent } from "./weather-charts/weather-charts.component";
import { AgGridAngular } from "ag-grid-angular";
import { ChartModule } from 'angular-highcharts';
import { WelcomeComponent } from "./welcome/welcome.component";

const routes: Routes = [
  { path: "weather-charts", component: WeatherChartsComponent },
  { path: "", component: WelcomeComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridAngular,
    FormsModule,
    ChartModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [AppComponent, TopBarComponent, WeatherChartsComponent, WelcomeComponent, TopBarComponent],
  providers: [WeatherService],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
