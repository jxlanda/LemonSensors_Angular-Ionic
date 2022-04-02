import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterData, History } from 'src/app/models/history.model';
import { HistoryService } from '../services/history.service';
import { uuid } from './users-store.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryStoreService {

  constructor(private historyService: HistoryService) {
    this.fetchAll();
  }

  private readonly _history = new BehaviorSubject<History[]>([]);
  readonly history$ = this._history.asObservable();

  get history(): History[] {
    return this._history.getValue();
  }

  set history(val: History[]) {
    this._history.next(val);
  }

  async fetchAll() {
    this.history = await this.historyService.index().toPromise();
  }

  async getHistoryByRange(filter: FilterData) {
    var data = await this.historyService.getByDateRange(filter).toPromise();
    return data;
  }

}
