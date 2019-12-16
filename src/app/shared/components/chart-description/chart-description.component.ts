import { User } from '@shared/models/User';
import { ToastService } from '@shared/services/toast.service';
import { Description } from '@shared/models/description';
import { DescriptionService } from '@shared/services/description.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';

@Component({
	selector: 'chart-description',
	templateUrl: './chart-description.component.html',
	styleUrls: ['./chart-description.component.scss']
})
export class ChartDescriptionComponent implements OnInit {
	externalId: string;
	cnpj: string;
	kpiAlias: string;

	description?: Description;
	preEditedDescription?: string;

	userType = User.fromLocalStorage().type;

	contentEditable = false;

	constructor(
		private descriptionService: DescriptionService,
		private toastService: ToastService,
		public dialogRef: MatDialogRef<ChartDescriptionComponent>,
		public linkifyService: NgxLinkifyjsService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.externalId = data.externalId;
		this.cnpj = data.cnpj;
		this.kpiAlias = data.kpiAlias;
	}

	ngOnInit(): void {
		this.descriptionService
			.getDescription(this.externalId, this.cnpj, this.kpiAlias)
			.subscribe(res => {
				this.description = res[0];
			});
	}

	saveDescription() {
		this.descriptionService.patchDescription(this.description).subscribe(
			res => {
				this.contentEditable = false;
			},
			err => {
				this.toastService.show('Erro ao salvar descrição', 'danger');
			}
		);
	}
}