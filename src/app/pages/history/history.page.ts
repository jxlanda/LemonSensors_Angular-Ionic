import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Platform } from '@ionic/angular';
// Importacion de Chart JS
import { Chart } from 'chart.js';
import { ChartDialogComponent } from 'src/app/components/chart-dialog/chart-dialog.component';
import { History } from 'src/app/models/history.model';
import { HistoryStoreService } from 'src/app/store/history-store.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  // Componente gráfica -> https://www.chartjs.org/
  @ViewChild("lineCanvas", { static: true }) lineCanvas: ElementRef;
  // Nombre de la gráfica
  private lineChart: Chart;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterTerm: string = '';
  panelOpenState: boolean = false;
  isDesktop: boolean = false;
  isMobile: boolean = false;
  showChart: boolean = false;

  array: any[] = [];
  displayedColumns: string[] = ['sensor', 'value','datetime'];
  dataSource: MatTableDataSource<History>;
  loading: boolean = false;

  @ViewChildren('panel', { read: ElementRef }) panels;

  constructor(private historyStore: HistoryStoreService,
    public dialog: MatDialog,
    public platform: Platform) {
    if (this.platform.is('desktop')) {
      this.isDesktop = true;
    }

    if (this.platform.is('mobileweb') || this.platform.is('mobile')) {
      this.isMobile = true;
    }

    this.platform.resize.subscribe(async (data) => {
      if (this.platform.width() >= 576) {
        this.isMobile = false;
        this.isDesktop = true;
      } else {
        this.isMobile = true;
        this.isDesktop = false;
      }
    });

    this.loading = true;
    this.historyStore.history$.subscribe(data => {
      if (data.length == 0) {
        this.array = [];
        var historyEmpty: History = {
          _id: null,
          sensor: {
            id: null,
            name: null,
            model: null,
            maxvalue: null,
            minvalue: null,
            measurement: null,
            sensinginseconds: null,
            storageplace: null
          },
          value: null,
          datetime: null,
          isEvent: null,
          user: {
            id: null,
            username: null,
            email: null,
            imgurl: null,
          }
        };
        for (var i = 0; i < 5; i++) {
          this.array.push(historyEmpty);
        }
        this.dataSource = new MatTableDataSource(this.array);
      } else {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.data);

        // Sort data by date
        // var datasort = this.dataSource.data.sort((a, b) => {
        //   return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
        // });
      }
    });
  }

  // Método para generar una gráfica de líneas
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
      topLimit.push(h.sensor.maxvalue);
      bottomLimit.push(h.sensor.minvalue);
      let date = new Date(h.datetime);
      labels.push(date.toLocaleDateString());
    });

    // Se crea una nueva gráfica
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
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
              labelString: "Fecha"
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
  
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    this.loading = false;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  opened(i: number, panel: MatExpansionPanel) {
    this.panels
      .toArray()[i]
      .nativeElement
      .scrollIntoView({ behavior: 'smooth' });
  }

  openChartDialog() {
    const dialogRef = this.dialog.open(ChartDialogComponent, { 
      autoFocus: false, 
      data: {
        title: "Ejemplo",
        content: "Contenido"
      } 
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result != null && result != undefined && result != false){
        this.showChart = true;
        var historyMockData: History[] = result;
        var lastItem = historyMockData[historyMockData.length -1];
        // Se llama al método de generar gráfica de líneas
        this.generateLineChart(historyMockData, lastItem.sensor.measurement);
      }
    });
  }

  backToHistory(){
    this.showChart = false;
  }
}
