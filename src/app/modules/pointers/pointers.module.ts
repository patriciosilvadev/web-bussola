import { MatDialogModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointersComponent } from './pointers.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { PointersRoutingModule } from './pointers-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ModalAnnotationsComponent } from './dashboard/modal-annotations/modal-annotations.component';
import { ContenteditableModule } from '@ng-stack/contenteditable';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { SharedModule } from '@shared/shared.module';

@NgModule({
	declarations: [
		PointersComponent,
		DashboardComponent,
		ModalAnnotationsComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		DropdownModule,
		PointersRoutingModule,
		MatDialogModule,
		NgxLinkifyjsModule,
		FileUploadModule,
		ButtonModule,
		SharedModule,
		ContenteditableModule,
		GoogleChartsModule.forRoot()
	],
	exports: [],
	providers: [],
	entryComponents: [ModalAnnotationsComponent]
})
export class PointersModule {}
