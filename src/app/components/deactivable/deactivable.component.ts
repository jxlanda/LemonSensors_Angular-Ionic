import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-deactivable',
  templateUrl: './deactivable.component.html',
  styleUrls: ['./deactivable.component.scss'],
})
export class DeactivableComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}

export interface DeactivatableComponentInterface {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
