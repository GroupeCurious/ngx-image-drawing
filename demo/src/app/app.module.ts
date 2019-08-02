import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ImageDrawingModule } from 'ngx-image-drawing';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ImageDrawingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
