import { User } from '@app/models/User';
import { Description } from './../models/description';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DescriptionService {
	constructor(
		private httpClient: HttpClient,
		private authService: AuthenticationService
	) {}

	getDescription(cnpj: string, kpiAlias: string) {
		return this.httpClient.get(`${environment.appApi}/description`, {
			headers: this.authService.getAuthorizationHeaders(),
			params: {
				accountingId: User.fromLocalStorage().organization.id.toString(),
				cnpj,
				kpiAlias
			}
		});
	}

	patchDescription(description: Description) {
		return this.httpClient.patch(
			`${environment.appApi}/description/${description.id}`,
			{ description: description.description },
			{
				headers: this.authService.getAuthorizationHeaders()
			}
		);
	}

	getDescriptionList(cnpj: string, scriptId?: number) {
		const possibleScriptId = scriptId ? `&scriptId=${scriptId}` : '';
		const possibleCnpj = cnpj ? `&cnpj=${cnpj}` : '';

		return this.httpClient.get(
			`${environment.appApi}/description/descriptions?accountingId=${
				User.fromLocalStorage().organization.id
			}${possibleScriptId}${possibleCnpj}&page_size=100`,
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}

	deleteDescription(id: number) {
		const url = `${environment.appApi}/description/${id}`;
		const headers = { headers: this.authService.getAuthorizationHeaders() };
		return this.httpClient.delete(url, headers);
	}

	updateDescriptionList(descriptions: Description[]) {
		descriptions = descriptions.map(desc => {
			if (+desc.kpiAlias >= 60 && desc.graphOrder < 60) {
				desc.graphOrder += 60;
			}
			return desc;
		})
		return this.httpClient.post(
			`${environment.appApi}/description/update`,
			{ descriptions },
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}
}
