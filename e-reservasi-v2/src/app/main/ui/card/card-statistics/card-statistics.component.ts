import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexStroke, ApexTooltip } from 'ng-apexcharts';

import { colors } from 'app/colors.const';
import { CardStatisticsService } from 'app/main/ui/card/card-statistics/card-statistics.service';

// interface ChartOptions
export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors: string[];
}
@Component({
  selector: 'app-card-statistics',
  templateUrl: './card-statistics.component.html',
  styleUrls: ['./card-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardStatisticsComponent implements OnInit {
  private $barColor = '#f3f3f3';
  private $trackBgColor = '#EBEBEB';
  private $primary_light = '#A9A2F6';
  private $success_light = '#55DD92';
  private $warning_light = '#ffc085';

  public data: any;

  // private
  private _unsubscribeAll: Subject<any>;

  // private
  private $primary = '#7367F0';
  private $success = '#28c76f';
  private $danger = '#EA5455';
  private $warning = '#FF9F43';
  // public content-header
  public contentHeader: object;
  // public apexcharts variable
  public statisticsBar;
  public statisticsLine;
  public gainedChartoptions: Partial<ChartOptions>;
  public revenueChartoptions: Partial<ChartOptions>;
  public salesChartoptions: Partial<ChartOptions>;
  public orderChartoptions: Partial<ChartOptions>;
  public trafficChartoptions: Partial<ChartOptions>;
  public userChartoptions: Partial<ChartOptions>;
  public newsletterChartoptions: Partial<ChartOptions>;

  constructor(private _cardStatisticsService: CardStatisticsService) {
    this._unsubscribeAll = new Subject();
    this.statisticsBar = {
      chart: {
        height: 70,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false
        }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
          top: -15,
          bottom: -15
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          startingShape: 'rounded',
          colors: {
            backgroundBarColors: [this.$barColor, this.$barColor, this.$barColor, this.$barColor, this.$barColor],
            backgroundBarRadius: 5
          }
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [colors.solid.warning],
      series: [
        {
          name: '2020',
          data: [45, 85, 65, 45, 65]
        }
      ],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    };
    this.statisticsLine = {
      chart: {
        height: 70,
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      grid: {
        // show: true,
        borderColor: this.$trackBgColor,
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        padding: {
          // left: 0,
          // right: 0,
          top: -30,
          bottom: -10
        }
      },
      stroke: {
        width: 3
      },
      colors: [colors.solid.info],
      series: [
        {
          data: [0, 20, 5, 30, 15, 45]
        }
      ],
      markers: {
        size: 2,
        colors: colors.solid.info,
        strokeColors: colors.solid.info,
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 5,
            fillColor: '#ffffff',
            strokeColor: colors.solid.info,
            size: 5
          }
        ],
        shape: 'circle',
        radius: 2,
        hover: {
          size: 3
        }
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '0px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    };
    // Subscribers Gained chart
    this.gainedChartoptions = {
      chart: {
        height: 100,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$primary],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100]
        }
      },
      // series: this.data?.subscribers_gained?.series,
      tooltip: {
        x: { show: false }
      }
    };
    // Revenue Generated Chart
    this.revenueChartoptions = {
      chart: {
        height: 100,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$success],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100]
        }
      },
      series: [
        {
          name: 'Revenue',
          data: [350, 275, 400, 300, 350, 300, 450]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };
    // Quaterly Sales Chart
    this.salesChartoptions = {
      chart: {
        height: 100,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$danger],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100]
        }
      },
      series: [
        {
          name: 'Sales',
          data: [10, 15, 7, 12, 3, 16]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };
    // Order Received Chart
    this.orderChartoptions = {
      chart: {
        height: 100,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$warning],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100]
        }
      },
      series: [
        {
          name: 'Orders',
          data: [10, 15, 8, 15, 7, 12, 8]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };
    // Site Traffic Chart
    this.trafficChartoptions = {
      chart: {
        height: 100,
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 5,
          left: 0,
          blur: 4,
          opacity: 0.1
        },
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$primary],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          gradientToColors: [this.$primary_light],
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      series: [
        {
          name: 'Traffic Rate',
          data: [150, 200, 125, 225, 200, 250]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };
    // Active Users Chart
    this.userChartoptions = {
      chart: {
        height: 100,
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 5,
          left: 0,
          blur: 4,
          opacity: 0.1
        },
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$success],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          gradientToColors: [this.$success_light],
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      series: [
        {
          name: 'Active Users',
          data: [750, 1000, 900, 1250, 1000, 1200, 1100]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };
    // News Letter Chart
    this.newsletterChartoptions = {
      chart: {
        height: 100,
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 5,
          left: 0,
          blur: 4,
          opacity: 0.1
        },
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$warning],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          gradientToColors: [this.$warning_light],
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      series: [
        {
          name: 'Newsletter',
          data: [365, 390, 365, 400, 375, 400]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit() {
    this._cardStatisticsService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
    });

    this.contentHeader = {
      headerTitle: 'Statistics Cards',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Cards',
            isLink: true,
            link: '/'
          },
          {
            name: 'Statistics Cards',
            isLink: false
          }
        ]
      }
    };
  }
}
