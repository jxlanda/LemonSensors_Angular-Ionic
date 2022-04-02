import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { FilterData, History } from 'src/app/models/history.model';
import { MessagingService } from '../services/messaging.service';
import { AlertController, ToastController } from '@ionic/angular';
import { HistoryService } from '../services/history.service';
import { HistoryStoreService } from '../store/history-store.service';
import { iif, interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {
  public folder: string;
  public tokenSaved: string;

  subscription: Subscription;
  filter: FilterData = {
    from: new Date("2020-01-01"),
    to: new Date(),
    sensorid: null
  }

  historyTempeture: History[] = [];

  @ViewChild("temperatureCanvas", { static: true }) lineCanvas: ElementRef;
  private tempChart: Chart;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private messagingService: MessagingService,
    private historyStore: HistoryStoreService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) { 
      // Push notifications
      this.listenForMessages();
      this.historyStore.getHistoryByRange(this.filter).then(history => {
        this.historyTempeture = history;
        var last = this.historyTempeture[this.historyTempeture.length - 1];
        this.generateLineChart(this.historyTempeture, last.sensor.measurement);
      })
    }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription= interval(60000)
      .pipe(
        startWith(0),
        switchMap(() => this.historyStore.getHistoryByRange(this.filter))
      ).subscribe(x => {
        console.log(x);
        var lastItem = x[x.length-1];
        var lastItemNormal = this.historyTempeture[this.historyTempeture.length - 1];
        if(lastItem._id.$oid != lastItemNormal._id.$oid){
          console.log(this.historyTempeture);
          this.addData(lastItem);
          // this.historyTempeture.shift();
        }
      });
    ;
  }

  addData(history: History) {
    console.log("Updated chart");
    this.tempChart.data.labels.push(new Date(history.datetime).toLocaleTimeString());
    // Top
    if(history.sensor.maxvalue != null){
      this.tempChart.data.datasets[0].data.push(history.sensor.maxvalue);
    } else {
      this.tempChart.data.datasets[0].data.push(0);
    }
    
    // Bottom
    if(history.sensor.minvalue != null){
      this.tempChart.data.datasets[1].data.push(history.sensor.minvalue);
    } else {
      this.tempChart.data.datasets[1].data.push(0);
    }
   
    this.tempChart.data.datasets[2].data.push(history.value);
    this.tempChart.update();
}


  generateLineChart(history: History[], measurement: string) {
    
    // Array de labels
    let labels: string[] = [];
    let topLimit: number[] = [];
    let bottomLimit: number[] = [];

    // Array de valores normales
    let valuesNormal: number[] = [];

    // Se recorre el array de historial
    history.forEach(h => {
      valuesNormal.push(h.value);
      if(h.sensor.maxvalue != null){
        topLimit.push(h.sensor.maxvalue);
      } else {
        topLimit.push(0);
      }
      if(h.sensor.minvalue != null){
        bottomLimit.push(h.sensor.minvalue);
      } else {
        bottomLimit.push(0);
      }
      
      let date = new Date(h.datetime);
      labels.push(date.toLocaleTimeString());
    });

    // Se crea una nueva gráfica
    this.tempChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: measurement
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: new Date().toLocaleDateString()
            }
          }]
        }
      },
      data: {
        labels: labels,
        datasets: [
          {
            label: "Limite máximo",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "red",
            borderCapStyle: "butt",
            borderDash: [5,5],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "red",
            pointBackgroundColor: "red",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: topLimit,
            spanGaps: false
          },
          {
            label: "Limite mínimo",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "yellow",
            borderCapStyle: "butt",
            borderDash: [5,5],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "yellow",
            pointBackgroundColor: "yellow",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: bottomLimit,
            spanGaps: false
          },
          {
            label: "Normal",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: valuesNormal,
            spanGaps: false
          }
        ]
      }
    });
  }

  listenForMessages() {
    this.messagingService.getMessages().subscribe(async (msg: any) => {
      const alert = await this.alertCtrl.create({
        header: msg.notification.title,
        message: msg.notification.body,
        buttons: ['OK'],
      });
      console.log("Mensaje recibido");
      await alert.present();
    });
  }

  requestPermission() {
    this.messagingService.requestPermission().subscribe(
      async token => {
        const toast = await this.toastCtrl.create({
          message: 'Got your token',
          duration: 2000
        });
        this.tokenSaved = token;
        toast.present();
      },
      async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }

  async deleteToken() {
    this.messagingService.deleteToken();
    const toast = await this.toastCtrl.create({
      message: 'Token removed',
      duration: 2000
    });
    toast.present();
  }

}
