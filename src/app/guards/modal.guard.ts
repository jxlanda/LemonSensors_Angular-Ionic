import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DeactivableComponent, DeactivatableComponentInterface } from '../components/deactivable/deactivable.component';

@Injectable({
  providedIn: 'root'
})
export class ModalGuard implements CanDeactivate<DeactivatableComponentInterface> {
  canDeactivate(
    component: DeactivatableComponentInterface,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(component);
        return component.canDeactivate ? component.canDeactivate() : true;
  }
  
}
