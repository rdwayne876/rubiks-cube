import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RubikCubeComponent } from './rubik-cube/rubik-cube.component';

@NgModule({
  declarations: [
    AppComponent,
    RubikCubeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
