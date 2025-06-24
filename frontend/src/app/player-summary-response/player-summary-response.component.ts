import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { CropsService } from '../_services/players.service';

@UntilDestroy()
@Component({
  selector: 'crop-summary-response-component',
  templateUrl: './player-summary-response.component.html',
  styleUrls: ['./player-summary-response.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CropSummaryResponseComponent implements OnInit, OnDestroy {
  endpoint: any;
  apiResponse: any;
  cropID: number = 1;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected cropsService: CropsService
  ) {}

  ngOnInit(): void {
    this.fetchApiResponse();
  }

  changeParams(): void {
    this.fetchApiResponse();
  }

  fetchApiResponse(): void {
    this.cropsService
      .getCropSummary(this.cropID)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.endpoint = data.endpoint;
        this.apiResponse = JSON.stringify(data.apiResponse, null, 2);
      });
  }

  ngOnDestroy() {}
}
