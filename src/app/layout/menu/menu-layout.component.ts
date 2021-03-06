import { SelectCompanyComponent } from './../../shared/components/select-company/select-company.component';
import { GenericResponse } from '@app/models/GenericResponse';
import { KpiService } from '@shared/services/kpi.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { User } from '@app/models/User';
import { environment } from '@env';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { SigninAsDialogComponent } from '@shared/components/dialogs/signin-as-dialog/signin-as-dialog.component';
import { Router } from '@angular/router';

export const ROUTES: RouteInfo[] = [
	// {
	// 	path: '/home',
	// 	title: 'Início',
	// 	icon: 'fal fa-home',
	// 	class: '',
	// 	permissonLevelNeeded: 2
	// },
	{
		path: '/pointers',
		title: 'Indicadores',
		icon: 'fal fa-analytics',
		class: '',
		permissonLevelNeeded: 2
	},
	{
		path: '/comparatives',
		title: 'Comparativos',
		icon: 'fal fa-chart-line',
		class: '',
		permissonLevelNeeded: 2
	},
	{
		path: '/options/accounting',
		title: 'Configurações da contabilidade',
		icon: 'fal fa-th-list',
		class: '',
		permissonLevelNeeded: 1,
		disabledOnMobile: true
	},
	{
		path: '/options/company',
		title: 'Configurações por empresa',
		icon: 'fal fa-th-list',
		class: '',
		permissonLevelNeeded: 1,
		disabledOnMobile: true
	}
	// {
	// 	path: '/settings',
	// 	title: 'Configurações',
	// 	icon: 'fal fa-user-cog',
	// 	class: '',
	// 	permissonLevelNeeded: 3,
	// 	disabledOnMobile: true
	// }
];

@Component({
	selector: 'app-menu-layout',
	templateUrl: './menu-layout.component.html',
	styleUrls: ['./menu-layout.component.scss']
})
export class MenuLayoutComponent implements OnInit {
	menuItems: RouteInfo[];
	profileUrl: string;
	user: User;

	@ViewChild('drawer') drawer: ElementRef<MatSidenav>;

	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(map(result => result.matches));

	constructor(
		private breakpointObserver: BreakpointObserver,
		private authenticationService: AuthenticationService,
		private router: Router,
		public dialog: MatDialog,
	) {}

	ngOnInit() {
		this.user = User.fromLocalStorage();
		this.profileUrl =
			environment.accountsUrl + '/dashboard/users/' + this.user.id;
		this.menuItems = ROUTES.filter(menuItem => menuItem);
	}

	openDialog(): void {
		this.dialog.open(ShareDialogComponent, {});
	}

	logout() {
		this.router.navigate(['auth', 'logout']);
	}

	public openAccountingDialog() {
		this.dialog.open(SigninAsDialogComponent);
	}
}

export interface RouteInfo {
	path: string;
	title: string;
	icon: string;
	class: string;
	permissonLevelNeeded: number;
	disabledOnMobile?: boolean;
}

@Component({
	selector: 'share-dialog',
	templateUrl: 'share-dialog.component.html'
})
export class ShareDialogComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<ShareDialogComponent>,
		private kpiService: KpiService
	) {}

	url: string;

	ngOnInit() {
		this.kpiService
			.requestShareUrl()
			.subscribe((response: GenericResponse<{ id: string }>) => {
				this.url = response.record.id;
			});
	}

	onNoClick(): void {
		window.open(this.url, '_blank');
		this.dialogRef.close();
	}

	copyInputMessage(inputElement) {
		inputElement.select();
		document.execCommand('copy');
		inputElement.setSelectionRange(0, 0);
		this.dialogRef.close();
	}

}
