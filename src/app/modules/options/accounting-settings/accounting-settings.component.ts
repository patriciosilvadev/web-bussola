import { DescriptionService } from '@shared/services/description.service';
import { ScriptType } from '@shared/services/script-types.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { VariableInfo, AccountingVariableInfo } from '@shared/models/variables';
import { VariableService } from '@shared/services/variable.service';
import { ToastService } from '@shared/services/toast.service';
import { Description } from '@shared/models/description';
import { Kobiton } from 'protractor/built/driverProviders';
import { TokenInfo } from '@app/models/TokenInfo';

@Component({
	selector: 'app-accounting-settings',
	templateUrl: 'accounting-settings.component.html',
	styleUrls: ['accounting-settings.component.scss']
})
export class AccountingSettingsComponent implements OnInit {
	types: ScriptType[];
	selectedScript: ScriptType;
	variables: AccountingVariableInfo[] = [];

	pointerDescriptions: Description[] = [];
	comparativeDescriptions: Description[] = [];

	canManage: boolean;

	constructor(
		private variableService: VariableService,
		private toastService: ToastService,
		private descriptionService: DescriptionService
	) {}

	ngOnInit() {
		this.canManage = TokenInfo.fromLocalStorage().canManage();
		this.variableService
			.requestScriptType()
			.subscribe((types: ScriptType[]) => {
				this.selectedScript = types[0];
				this.types = types;
				this.onScriptChanged();
			});
	}

	onScriptChanged() {
		this.variables = [];
		this.pointerDescriptions = [];
		this.comparativeDescriptions = [];

		this.requestVariables();
		this.requestDescriptionList();
	}

	requestVariables() {
		this.variableService
			.requestAccountingVariables(this.selectedScript.id)
			.subscribe((res: any) => {
				this.variables = res.content;
			});
	}

	requestDescriptionList() {
		this.descriptionService
			.getDescriptionList(null, this.selectedScript.id)
			.subscribe((descriptions: any) => {
				descriptions.content.forEach((description: Description) => {
					+description.kpiAlias < 60
						? this.pointerDescriptions.push(description)
						: this.comparativeDescriptions.push(description);
				});
			});
	}

	adjustKpi(kpi: any) {
		if (kpi.graphOrder < 60) {
			kpi.graphOrder = kpi.graphOrder + 60;
		}
		return kpi.graphOrder
	}

	onVariableEdited(variableInfo: AccountingVariableInfo) {
		if (!this.canManage) { return; }
		// const varIndex = this.variables.indexOf(variableInfo);
		this.variables[this.variables.indexOf(variableInfo)] = variableInfo;

		this.variableService.postAccountingVariable(variableInfo).subscribe(
			res => this.toastService.show('Parâmetro alterado com sucesso'),
			() => this.toastService.show('Erro ao alterar parâmetro', 'danger')
		);
	}

	onDescriptionChanged(descriptions: Description[]) {
		if (!this.canManage) { return; }
		this.descriptionService.updateDescriptionList(descriptions).subscribe(
			() => {
				this.toastService.show('Alterado com sucesso', 'success');
			},
			err => {
				console.log(err);
				this.toastService.show('Erro ao fazer alterações', 'danger');
			}
		);
	}
}
